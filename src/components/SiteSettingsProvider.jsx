import { useEffect, useState } from 'react'
import { defaultSiteSettings } from '../data/siteSettings.js'
import { SiteSettings, siteRequest } from '../lib/siteApi.js'

export default function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings)
  useEffect(() => {
    const controller = new AbortController()
    siteRequest('/api/site-settings', undefined, { signal: controller.signal })
      .then(value => setSettings({ ...defaultSiteSettings, ...value }))
      .catch(() => {})
    return () => controller.abort()
  }, [])
  return <SiteSettings.Provider value={settings}>{children}</SiteSettings.Provider>
}
