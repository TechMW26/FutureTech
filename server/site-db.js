import process from 'node:process'
import { createClient } from '@libsql/client'

let database
let setup

export function siteDbConfigured() {
  const url = process.env.TURSO_DATABASE_URL
  return Boolean(url && (!process.env.VERCEL || (process.env.TURSO_AUTH_TOKEN && /^(libsql|https):\/\//.test(url))))
}

export async function siteDb() {
  if (!siteDbConfigured()) throw new Error('Database is not configured')
  database ??= createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  setup ??= database.batch([
    `CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY, source TEXT NOT NULL, name TEXT NOT NULL, email TEXT,
      company TEXT, phone TEXT, message TEXT NOT NULL, created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new'
    )`,
    'CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at DESC, id DESC)',
    'CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires INTEGER NOT NULL)',
    'CREATE INDEX IF NOT EXISTS limits_expiry ON limits (expires)',
    'CREATE TABLE IF NOT EXISTS admin_sessions (id TEXT PRIMARY KEY, expires INTEGER NOT NULL)',
  ], 'write').catch(error => {
    setup = undefined
    throw error
  })
  await setup
  return database
}

export async function takeQuota(db, id, seconds, limit) {
  const now = Math.floor(Date.now() / 1000)
  const [result] = await db.batch([
    {
      sql: `INSERT INTO limits (id, attempts, expires) VALUES (?, 1, ?)
        ON CONFLICT(id) DO UPDATE SET
          attempts = CASE WHEN expires <= ? THEN 1 ELSE attempts + 1 END,
          expires = CASE WHEN expires <= ? THEN excluded.expires ELSE expires END
        RETURNING attempts, expires`,
      args: [id, now + seconds, now, now],
    },
    { sql: 'DELETE FROM limits WHERE expires <= ?', args: [now] },
  ], 'write')
  const { attempts, expires } = result.rows[0]
  return attempts > limit ? expires - now : 0
}
