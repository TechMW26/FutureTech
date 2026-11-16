import { Buffer } from 'node:buffer'
import process from 'node:process'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { siteDb, siteDbConfigured, takeQuota } from '../server/site-db.js'
import { getSiteSettings, updateSiteSettings } from '../server/site-settings.js'
import { handleError, HttpError, rateKey, readJson, requireSameOrigin, sendJson } from '../server/site-http.js'

const COOKIE = 'mwft_admin'
const SESSION_AGE = 8 * 60 * 60
const PAGE_SIZE = 30
const statuses = ['new', 'in-progress', 'closed']
const hash = value => createHash('sha256').update(value).digest('hex')

function cookie(res, token, age) {
  const secure = process.env.VERCEL ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Max-Age=${age}; Path=/api/admin; HttpOnly; SameSite=Strict${secure}`)
}

async function requireSession(req, db) {
  const token = req.headers.cookie?.match(/(?:^|;\s*)mwft_admin=([a-f\d]{64})(?:;|$)/)?.[1]
  if (!token) throw new HttpError(401, 'Sign in to continue.')
  const id = hash(token)
  const { rows } = await db.execute({
    sql: 'SELECT id FROM admin_sessions WHERE id = ? AND expires > ?',
    args: [id, Math.floor(Date.now() / 1000)],
  })
  if (!rows.length) throw new HttpError(401, 'Sign in to continue.')
  return id
}

export default async function handler(req, res) {
  try {
    const method = req.method
    if (method !== 'GET' && method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      throw new HttpError(405, 'Method not allowed.')
    }

    const password = process.env.MWFT_ADMIN_PASSWORD
    if (!siteDbConfigured() || !password || password.length < 16) {
      throw new HttpError(503, 'Admin access has not been configured.')
    }
    if (method === 'POST') requireSameOrigin(req)
    const input = method === 'POST' ? await readJson(req) : {}
    const db = await siteDb()
    const now = Math.floor(Date.now() / 1000)
    if (input.action === 'login') {
      const retry = await takeQuota(db, rateKey(req, 'admin-login', password), 900, 8)
      if (retry) {
        res.setHeader('Retry-After', String(retry))
        throw new HttpError(429, 'Too many attempts. Try again in 15 minutes.')
      }
      if (typeof input.password !== 'string' ||
          !timingSafeEqual(Buffer.from(hash(password), 'hex'), Buffer.from(hash(input.password), 'hex'))) {
        throw new HttpError(401, 'Incorrect password.')
      }
      const token = randomBytes(32).toString('hex')
      await db.batch([
        { sql: 'DELETE FROM admin_sessions WHERE expires <= ?', args: [now] },
        { sql: 'INSERT INTO admin_sessions (id,expires) VALUES (?,?)', args: [hash(token), now + SESSION_AGE] },
      ], 'write')
      cookie(res, token, SESSION_AGE)
      return sendJson(res, 200, { ok: true })
    }

    const session = await requireSession(req, db)
    if (method === 'GET') {
      const { searchParams } = new URL(req.url, 'http://localhost')
      const source = searchParams.get('source')
      const status = searchParams.get('status')
      const args = []
      const conditions = []
      if (source === 'contact' || source === 'summit') { conditions.push('source = ?'); args.push(source) }
      if (statuses.includes(status)) { conditions.push('status = ?'); args.push(status) }
      const page = Math.min(100000, Math.max(0, Math.floor(Number(searchParams.get('page')) || 0)))
      const [leads, settings] = await Promise.all([
        db.execute({
          sql: `SELECT * FROM leads ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
            ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
          args: [...args, PAGE_SIZE + 1, page * PAGE_SIZE],
        }),
        getSiteSettings(),
      ])
      return sendJson(res, 200, { leads: leads.rows.slice(0, PAGE_SIZE), more: leads.rows.length > PAGE_SIZE, settings })
    }
    if (input.action === 'logout') {
      await db.execute({ sql: 'DELETE FROM admin_sessions WHERE id = ?', args: [session] })
      cookie(res, '', 0)
      return sendJson(res, 200, { ok: true })
    }
    if (input.action === 'status' && typeof input.id === 'string' && statuses.includes(input.status)) {
      const result = await db.execute({ sql: 'UPDATE leads SET status = ? WHERE id = ?', args: [input.status, input.id] })
      if (!result.rowsAffected) throw new HttpError(404, 'Submission not found.')
      return sendJson(res, 200, { ok: true })
    }
    if (input.action === 'settings' && input.settings && typeof input.settings === 'object') {
      return sendJson(res, 200, { settings: await updateSiteSettings(db, input.settings) })
    }
    throw new HttpError(400, 'Invalid admin action.')
  } catch (error) {
    return handleError(res, error)
  }
}
