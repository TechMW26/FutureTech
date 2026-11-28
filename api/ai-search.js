// Vercel serverless function: POST /api/ai-search
// Body: { query: string }
// Response: { answer: string } or { error: string }
//
// Published website answers only. Paid AI calls are disabled.

import { siteFaqAnswer } from '../server/faq-answer.js'

const MAX_QUERY_LENGTH = 200

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length) {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  return await new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      if (!raw) return resolve({})
      try { resolve(JSON.parse(raw)) } catch { resolve({}) }
    })
    req.on('error', () => resolve({}))
  })
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'POST')
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const body = await readJsonBody(req)
  const rawQuery = typeof body?.query === 'string' ? body.query.trim() : ''

  if (!rawQuery) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Please type a question first.' }))
  }

  if (rawQuery.length > MAX_QUERY_LENGTH) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: `Question is too long (max ${MAX_QUERY_LENGTH} characters).` }))
  }

  // Emergency spending cutoff: published answers only. No provider is called.
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ answer: siteFaqAnswer(rawQuery), source: 'site' }))
}
