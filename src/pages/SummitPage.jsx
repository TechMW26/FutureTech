import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteRequest, useSiteSettings } from '../lib/siteApi.js'
import { projects } from '../data/workProjects.js'
import './SitePages.css'

export default function SummitPage() {
  const { summitIntro, stallProducts, phone, whatsapp, email, acceptingEnquiries } = useSiteSettings()
  const [submission, setSubmission] = useState({ pending: false, sent: false, message: '' })
  const requestId = useRef(null)
  const sending = useRef(false)
  const displayedProducts = stallProducts.map(id => projects.find(project => project.id === id)).filter(Boolean)
  const callNumber = phone.replace(/[^+\d]/g, '')
  const whatsappNumber = whatsapp.replace(/\D/g, '')

  useEffect(() => {
    document.title = 'Bengaluru Tech Summit 2026 | MW Futuretech'
  }, [])

  async function submit(event) {
    event.preventDefault()
    if (sending.current || submission.sent) return
    sending.current = true
    setSubmission({ pending: true, sent: false, message: '' })
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    requestId.current ??= globalThis.crypto.randomUUID()
    try {
      await siteRequest('/api/enquiries', { ...fields, source: 'summit', requestId: requestId.current })
      setSubmission({ pending: false, sent: true, message: 'Thanks for connecting. Our team will be in touch.' })
    } catch (error) {
      setSubmission({ pending: false, sent: false, message: error.message })
    } finally {
      sending.current = false
    }
  }

  return (
    <div className="site-page summit-page">
      <header className="summit-page__intro">
        <p className="site-page__eyebrow">17–19 November 2026 · BIEC, Bengaluru</p>
        <h1>Meet us at Bengaluru Tech Summit.</h1>
        <p>{summitIntro}</p>
        <div className="site-page__actions">
          <a className="site-button" href="#summit-connect">Connect with us</a>
          {callNumber && <a className="site-button site-button--quiet" href={`tel:${callNumber}`}>Call us</a>}
          {whatsappNumber && <a className="site-button site-button--quiet" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>}
        </div>
      </header>

      {displayedProducts.length > 0 && <section className="site-page__section" aria-labelledby="summit-products">
        <h2 id="summit-products">Explore our products</h2>
        <ul className="site-page__cards">
          {displayedProducts.map(product => (
            <li key={product.id}>
              <Link to={product.path}><h3>{product.title} <span aria-hidden="true">↗</span></h3></Link>
              <p>{product.summary}</p>
            </li>
          ))}
        </ul>
      </section>}

      <section className="summit-page__form site-page__section" id="summit-connect" aria-labelledby="summit-form-title">
        <div>
          <h2 id="summit-form-title">Let’s keep in touch.</h2>
          <p>Tell us what you’re interested in and we’ll continue the conversation.</p>
          {email && <a href={`mailto:${email}`}>{email}</a>}
        </div>
        {acceptingEnquiries === false ? (
          <p>Get in touch by email and tell us what you’d like to discuss.</p>
        ) : <form onSubmit={submit} onChange={() => { requestId.current = null }} className="site-form">
          {submission.sent ? <p role="status">{submission.message}</p> : <>
            <fieldset disabled={submission.pending}>
              <label>Name<input name="name" autoComplete="name" required maxLength={120} /></label>
              <label>Company<input name="company" autoComplete="organization" required maxLength={160} /></label>
              <label>Phone<input name="phone" type="tel" autoComplete="tel" required maxLength={32} /></label>
              <label>What are you interested in?<textarea name="interest" rows={3} required maxLength={600} /></label>
              <p className="site-form__note">We’ll use these details to follow up about your interest. <Link to="/privacy">Privacy policy</Link></p>
              <button className="site-button" type="submit">{submission.pending ? 'Sending…' : 'Send details'}</button>
            </fieldset>
            <p role="status">{submission.message}</p>
          </>}
        </form>}
      </section>
    </div>
  )
}
