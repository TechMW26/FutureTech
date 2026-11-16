import { Buffer } from 'node:buffer'
import process from 'node:process'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'mwft_faq_session'
const WINDOW_SECONDS = 10 * 60
const SESSION_LIMIT = 10
const localWindows = new Map()
let nextSweep = 0

function getSession(req, res, secret) {
  const cookie = req.headers?.cookie?.split(';').map(value => value.trim())
    .find(value => value.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1)
  const match = cookie?.match(/^([a-f0-9-]{36})\.([a-f0-9]{64})$/)
  const sign = id => createHmac('sha256', secret).update(`faq:${id}`).digest('hex')

  if (match && timingSafeEqual(Buffer.from(match[2], 'hex'), Buffer.from(sign(match[1]), 'hex'))) {
    return match[1]
  }

  const id = randomUUID()
  const secure = process.env.VERCEL || req.socket?.encrypted ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${id}.${sign(id)}; Path=/api/ai-search; HttpOnly; SameSite=Lax${secure}`)
  return id
}

function countLocally(id, now) {
  if (now >= nextSweep) {
    for (const [session, window] of localWindows) {
      if (window.expires <= now) localWindows.delete(session)
    }
    nextSweep = now + WINDOW_SECONDS
  }

  let window = localWindows.get(id)
  if (!window || window.expires <= now) {
    window = { count: 0, expires: now + WINDOW_SECONDS }
    localWindows.set(id, window)
  }
  window.count++
  return [window.count, window.expires - now]
}

async function countWithRedis(id, url, token) {
  // Increment and set expiry atomically so parallel serverless invocations share one quota.
  const script = [
    'local count = redis.call("INCR", KEYS[1])',
    'if count == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end',
    'return {count, redis.call("TTL", KEYS[1])}',
  ].join('\n')
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', script, 1, `mwft:faq:${id}`, WINDOW_SECONDS]),
    signal: AbortSignal.timeout(3000),
  })
  if (!response.ok) throw new Error('FAQ rate limit store unavailable')
  const { result } = await response.json()
  if (!Array.isArray(result) || result.length !== 2 || !result.every(Number.isInteger)) {
    throw new Error('Invalid FAQ rate limit response')
  }
  return result
}

export async function getFaqRetryAfter(req, res, secret) {
  const id = getSession(req, res, secret)
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env
  if (Boolean(url) !== Boolean(token)) throw new Error('Incomplete FAQ rate limit configuration')

  const [count, ttl] = url
    ? await countWithRedis(id, url, token)
    : countLocally(id, Math.floor(Date.now() / 1000))
  return count > SESSION_LIMIT ? Math.max(1, ttl) : 0
}
