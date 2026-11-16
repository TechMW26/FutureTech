import { defaultSiteSettings, portraitNames } from '../src/data/siteSettings.js'
import { projects } from '../src/data/workProjects.js'
import { siteDbConfigured, siteDb } from './site-db.js'
import { HttpError } from './site-http.js'

const fields = { phone: 32, email: 254, whatsapp: 32, linkedin: 300, instagram: 300, officeAddress: 280, bannerText: 140, summitIntro: 650 }
const photoPath = /^\/(?:images\/about|directors|team)\/[\w %.-]+\.(?:webp|jpe?g|png)$/i

function link(value, host) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password &&
      (url.hostname === host || url.hostname.endsWith(`.${host}`)) && url.pathname.length > 1
  } catch {
    return false
  }
}

export function validateSettings(input) {
  const settings = {}
  for (const [key, max] of Object.entries(fields)) {
    if (typeof input[key] !== 'string' || input[key].length > max) throw new HttpError(400, `Check the ${key} field.`)
    settings[key] = input[key].trim()
  }
  if (!settings.officeAddress || !settings.bannerText || !settings.summitIntro ||
      (settings.phone && !/^\+[\d ()-]{7,30}$/.test(settings.phone)) ||
      (settings.whatsapp && !/^\+?[\d ()-]{7,30}$/.test(settings.whatsapp)) ||
      (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) ||
      !link(settings.linkedin, 'linkedin.com') || !link(settings.instagram, 'instagram.com')) {
    throw new HttpError(400, 'Check the address, banner, summit intro and contact details.')
  }
  settings.bannerEnabled = input.bannerEnabled === true
  settings.stallProducts = [...new Set(Array.isArray(input.stallProducts) ? input.stallProducts : [])]
  if (settings.stallProducts.some(id => !projects.some(project => project.id === id))) {
    throw new HttpError(400, 'Choose products from the site portfolio.')
  }
  settings.photos = {}
  for (const [name, value] of Object.entries(input.photos ?? {})) {
    if (!portraitNames.includes(name) || typeof value !== 'string' || !photoPath.test(value) || /\.{2}|%2e|%2f/i.test(value)) {
      throw new HttpError(400, 'Use a site photo path from /team, /directors or /images/about.')
    }
    settings.photos[name] = value
  }
  return settings
}

export async function getSiteSettings() {
  if (!siteDbConfigured()) return defaultSiteSettings
  const db = await siteDb()
  const result = await db.execute('SELECT data FROM site_settings WHERE id = 1')
  return result.rows[0] ? { ...defaultSiteSettings, ...JSON.parse(result.rows[0].data) } : defaultSiteSettings
}

export async function updateSiteSettings(db, input) {
  const settings = validateSettings(input)
  await db.execute({
    sql: 'INSERT INTO site_settings (id,data) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
    args: [JSON.stringify(settings)],
  })
  return settings
}
