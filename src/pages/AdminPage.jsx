import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { portraitNames } from '../data/siteSettings.js'
import { projects } from '../data/workProjects.js'
import { siteRequest } from '../lib/siteApi.js'
import './SitePages.css'
import './AdminPage.css'

const leadStatuses = { new: 'New', 'in-progress': 'In progress', closed: 'Closed' }
const contentFields = {
  email: 'Contact email', phone: 'Call number', whatsapp: 'WhatsApp number',
  linkedin: 'LinkedIn profile URL', instagram: 'Instagram profile URL',
  officeAddress: 'Bengaluru address', bannerText: 'Banner text', summitIntro: 'Summit introduction',
}

function ContentEditor({ initial, save, pending }) {
  const [settings, setSettings] = useState(initial)
  const update = (key, value) => setSettings(previous => ({ ...previous, [key]: value }))

  return (
    <form className="site-form admin-content" onSubmit={event => { event.preventDefault(); save(settings) }}>
      <fieldset disabled={pending}>
        <div className="admin-content__grid">
          {Object.entries(contentFields).map(([key, label]) => <label key={key}>{label}
            {['officeAddress', 'summitIntro'].includes(key)
              ? <textarea rows={3} value={settings[key]} onChange={event => update(key, event.target.value)} />
              : <input value={settings[key]} onChange={event => update(key, event.target.value)} />}
          </label>)}
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={settings.bannerEnabled} onChange={event => update('bannerEnabled', event.target.checked)} /> Show summit banner until the event ends
        </label>
        <fieldset className="admin-product-options">
          <legend>Summit products</legend>
          {projects.map(({ id, title }) => <label className="admin-checkbox" key={id}>
            <input type="checkbox" checked={settings.stallProducts.includes(id)} onChange={event => {
              update('stallProducts', event.target.checked ? [...settings.stallProducts, id] : settings.stallProducts.filter(item => item !== id))
            }} /> {title}
          </label>)}
        </fieldset>
        <details>
          <summary>Director and team photos</summary>
          <p>Set an image path already published under /team, /directors or /images/about. Clear a field to use the existing photo.</p>
          <div className="admin-content__grid">
            {portraitNames.map(name => <label key={name}>{name}
              <input value={settings.photos[name] ?? ''} onChange={event => {
                const updated = { ...settings.photos, [name]: event.target.value }
                if (!updated[name]) delete updated[name]
                update('photos', updated)
              }} />
            </label>)}
          </div>
        </details>
        <button className="site-button" type="submit">{pending ? 'Saving…' : 'Save website settings'}</button>
      </fieldset>
    </form>
  )
}

export default function AdminPage() {
  const [phase, setPhase] = useState('loading')
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('inbox')
  const [filters, setFilters] = useState({ source: '', status: '', page: 0 })
  const [refresh, setRefresh] = useState(0)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { document.title = 'Website admin | MW Futuretech' }, [])

  useEffect(() => {
    const controller = new AbortController()
    const query = new URLSearchParams(filters)
    siteRequest(`/api/admin?${query}`, undefined, { signal: controller.signal }).then(result => {
      setData(result)
      setPhase('ready')
    }).catch(error => {
      if (controller.signal.aborted) return
      setData(null)
      setPhase(error.status === 401 ? 'sign-in' : 'unavailable')
      if (error.status !== 401) setMessage(error.message)
    })
    return () => controller.abort()
  }, [filters, refresh])

  async function action(payload, success) {
    setPending(true)
    setMessage('')
    try {
      const result = await siteRequest('/api/admin', payload)
      if (payload.action === 'logout') {
        setData(null)
        setPhase('sign-in')
      } else if (payload.action === 'login') {
        setPhase('loading')
      }
      if (result.settings) setData(previous => ({ ...previous, settings: result.settings }))
      if (payload.action !== 'settings') setRefresh(value => value + 1)
      if (success) setMessage(success)
    } catch (error) {
      if (error.status === 401 && payload.action !== 'login') {
        setData(null)
        setPhase('sign-in')
      }
      setMessage(error.message)
    } finally {
      setPending(false)
    }
  }

  const filter = (key, value) => setFilters(previous => ({ ...previous, page: 0, [key]: value }))

  return (
    <div className="site-page admin-page">
      <div className="admin-page__header">
        <div><Link to="/">MW Futuretech</Link><h1>Website admin</h1></div>
        {phase === 'ready' && <button type="button" className="site-button site-button--quiet" disabled={pending} onClick={() => action({ action: 'logout' })}>Sign out</button>}
      </div>
      {phase === 'loading' && <p role="status">Loading admin…</p>}
      <p role="status">{message}</p>
      {phase === 'sign-in' && <form className="site-form admin-login" onSubmit={event => {
        event.preventDefault()
        const password = new FormData(event.currentTarget).get('password')
        action({ action: 'login', password })
      }}>
        <fieldset disabled={pending}>
          <label>Admin password<input name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
          <button className="site-button" type="submit">{pending ? 'Signing in…' : 'Sign in'}</button>
        </fieldset>
      </form>}

      {phase === 'ready' && data && <>
        <nav className="admin-tabs" aria-label="Admin sections">
          <button type="button" aria-pressed={tab === 'inbox'} onClick={() => setTab('inbox')}>Inbox</button>
          <button type="button" aria-pressed={tab === 'content'} onClick={() => setTab('content')}>Website settings</button>
        </nav>
        {tab === 'content'
          ? <ContentEditor initial={data.settings} pending={pending} save={settings => action({ action: 'settings', settings }, 'Website settings saved.')} />
          : <section aria-label="Lead inbox">
            <div className="site-form admin-filters">
              <label>Source<select value={filters.source} onChange={event => filter('source', event.target.value)}><option value="">All sources</option><option value="contact">Contact</option><option value="summit">Summit</option></select></label>
              <label>Status<select value={filters.status} onChange={event => filter('status', event.target.value)}><option value="">All statuses</option>{Object.entries(leadStatuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
              <button type="button" className="site-button site-button--quiet" onClick={() => setRefresh(value => value + 1)}>Refresh</button>
            </div>
            {!data.leads.length && <p>No submissions match these filters.</p>}
            <ul className="admin-leads">
              {data.leads.map(lead => <li key={lead.id}>
                <div className="admin-lead__top">
                  <div>
                    <h2>{lead.name}</h2>
                    <p>{lead.source === 'summit' ? 'Summit lead' : 'Contact enquiry'} · <time dateTime={lead.created_at}>{new Date(lead.created_at).toLocaleString('en-IN')}</time></p>
                  </div>
                  <label className="site-form admin-status">Status for {lead.name}
                    <select value={lead.status} disabled={pending} onChange={event => action({ action: 'status', id: lead.id, status: event.target.value }, 'Status updated.')}>
                      {Object.entries(leadStatuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                  </label>
                </div>
                {lead.company && <p>{lead.company}</p>}
                {lead.email && <p><a href={`mailto:${lead.email}`}>{lead.email}</a></p>}
                {lead.phone && <p><a href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`}>{lead.phone}</a></p>}
                <p className="admin-lead__message">{lead.message}</p>
              </li>)}
            </ul>
            <div className="site-page__actions">
              {filters.page > 0 && <button type="button" className="site-button site-button--quiet" onClick={() => setFilters(value => ({ ...value, page: value.page - 1 }))}>Previous page</button>}
              {data.more && <button type="button" className="site-button site-button--quiet" onClick={() => setFilters(value => ({ ...value, page: value.page + 1 }))}>Next page</button>}
            </div>
          </section>}
      </>}
    </div>
  )
}
