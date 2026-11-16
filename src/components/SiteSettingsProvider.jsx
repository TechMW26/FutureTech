import { useEffect, useState } from 'react'
import { defaultSiteSettings } from '../data/siteSettings.js'
import { SiteSettings, siteRequest } from '../lib/siteApi.js'

const initialSettings = { ...defaultSiteSettings, isSettingsLoading: true }

export default function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings)
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = window.setTimeout(() => controller.abort(), 4000)
    siteRequest('/api/site-settings', undefined, { signal: controller.signal })
      .then(value => { if (active) setSettings({ ...defaultSiteSettings, ...value }) })
      .catch(() => { if (active) setSettings(defaultSiteSettings) })
      .finally(() => window.clearTimeout(timeout))
    return () => {
      active = false
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])
  return <SiteSettings.Provider value={settings}>{children}</SiteSettings.Provider>
}
