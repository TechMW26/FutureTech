import { Buffer } from 'node:buffer'
import process from 'node:process'
import { createHmac } from 'node:crypto'

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function handleError(res, error) {
  if (error instanceof HttpError) {
    sendJson(res, error.status, { error: error.message })
    return
  }
  console.error('Site API request failed:', error?.name)
  sendJson(res, 503, { error: 'The service is temporarily unavailable. Please try again shortly.' })
}

export async function readJson(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '')) {
    throw new HttpError(415, 'Send the form as JSON.')
  }
  let body = req.body
  if (body === undefined) {
    body = ''
    for await (const chunk of req) {
      body += chunk
      if (Buffer.byteLength(body) > 24000) throw new HttpError(413, 'This request is too large.')
    }
  }
  try {
    const serialized = typeof body === 'string' ? body : JSON.stringify(body)
    if (Buffer.byteLength(serialized) > 24000) throw new HttpError(413, 'This request is too large.')
    const value = JSON.parse(serialized)
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    return value
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(400, 'Invalid form data.')
  }
}

export function requireSameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return
  const protocol = process.env.VERCEL || req.socket?.encrypted ? 'https:' : 'http:'
  if (origin !== `${protocol}//${req.headers.host}`) {
    throw new HttpError(403, 'This request must come from this site.')
  }
}

export function rateKey(req, namespace, secret) {
  const forwarded = process.env.VERCEL ? req.headers['x-vercel-forwarded-for'] : undefined
  const ip = String(forwarded ?? req.socket?.remoteAddress ?? '').split(',')[0].trim()
  return createHmac('sha256', secret).update(`${namespace}:${ip}`).digest('hex')
}
