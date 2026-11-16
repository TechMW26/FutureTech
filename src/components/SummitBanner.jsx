import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SUMMIT_END } from '../data/siteSettings.js'
import { useSiteSettings } from '../lib/siteApi.js'
import './SummitBanner.css'

export default function SummitBanner({ visible }) {
  const { bannerText, bannerEnabled } = useSiteSettings()
  const [ended, setEnded] = useState(() => Date.now() >= Date.parse(SUMMIT_END))
  useEffect(() => {
    const delay = Date.parse(SUMMIT_END) - Date.now()
    if (delay <= 0) return
    const timer = setTimeout(() => setEnded(Date.now() >= Date.parse(SUMMIT_END)), Math.min(delay, 2_147_483_647))
    return () => clearTimeout(timer)
  }, [])

  if (ended || !bannerEnabled) return null
  return (
    <div className={`summit-banner${visible ? '' : ' summit-banner--hidden'}`}>
      <Link to="/bts2026" tabIndex={visible ? undefined : -1} aria-hidden={visible ? undefined : true}>
        {bannerText} <span aria-hidden="true">↗</span>
      </Link>
    </div>
  )
}
