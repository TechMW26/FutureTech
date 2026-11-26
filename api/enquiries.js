import { randomUUID } from 'node:crypto'
import process from 'node:process'
import { siteDb, takeQuota } from '../server/site-db.js'
import { handleError, HttpError, rateKey, readJson, requireSameOrigin, sendJson } from '../server/site-http.js'

const validRequestId = /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(body, key, max) {
  const value = typeof body[key] === 'string' ? body[key].trim() : ''
  if (!value || value.length > max) throw new HttpError(400, `Enter a valid ${key}.`)
  return value
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  try {
    requireSameOrigin(req)
    const body = await readJson(req)
    const source = body.source
    if (source !== 'contact' && source !== 'summit') throw new HttpError(400, 'Invalid form source.')
    const name = field(body, 'name', 120)
    const email = source === 'contact' ? field(body, 'email', 254) : null
    const company = source === 'summit' ? field(body, 'company', 160) : null
    const phone = source === 'summit' ? field(body, 'phone', 32) : null
    const message = source === 'summit' ? field(body, 'interest', 600) : field(body, 'message', 4000)
    if (email && !validEmail.test(email)) throw new HttpError(400, 'Enter a valid email address.')
    if (phone && (!/^\+?[\d().\s-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, '')))) {
      throw new HttpError(400, 'Enter a valid phone number.')
    }

    const id = validRequestId.test(body.requestId ?? '') ? body.requestId : randomUUID()
    const db = await siteDb()
    const key = rateKey(req, 'lead', process.env.TURSO_AUTH_TOKEN ?? 'local-lead')
    const retryAfter = await takeQuota(db, key, 600, 12)
    if (retryAfter) {
      res.setHeader('Retry-After', String(retryAfter))
      throw new HttpError(429, 'Too many submissions. Please try again later.')
    }

    await db.execute({
      sql: `INSERT INTO leads (id,source,name,email,company,phone,message,created_at)
        VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`,
      args: [id, source, name, email, company, phone, message, new Date().toISOString()],
    })
    sendJson(res, 201, { accepted: true })
  } catch (error) {
    handleError(res, error)
  }
}
