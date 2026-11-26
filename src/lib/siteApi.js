import { createContext, useContext } from 'react'
import { defaultSiteSettings } from '../data/siteSettings.js'

export const SiteSettings = createContext(defaultSiteSettings)
export const useSiteSettings = () => useContext(SiteSettings)

export async function siteRequest(path, data, options = {}) {
  const response = await fetch(path, {
    ...options,
    ...(data === undefined ? {} : {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result || typeof result !== 'object' || Array.isArray(result)) {
    const error = new Error(result?.error || 'The request could not be completed. Please try again.')
    error.status = response.ok ? 502 : response.status
    throw error
  }
  return result
}
