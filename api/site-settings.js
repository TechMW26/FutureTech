import { siteDbConfigured } from '../server/site-db.js'
import { getSiteSettings } from '../server/site-settings.js'
import { handleError, sendJson } from '../server/site-http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }
  try {
    return sendJson(res, 200, { ...await getSiteSettings(), acceptingEnquiries: siteDbConfigured() })
  } catch (error) {
    return handleError(res, error)
  }
}
