import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteRequest, useSiteSettings } from '../lib/siteApi.js'
import RouteSkeleton from '../components/RouteSkeleton'
import './LetsTalk.css'

const fields = [
  { label: 'Your name', placeholder: 'Enter your name', type: 'text', autocomplete: 'name' },
  { label: 'Your email', placeholder: 'Enter your email', type: 'email', autocomplete: 'email' },
  { label: 'Your message', placeholder: 'Tell us what’s on your mind', type: 'text', autocomplete: 'off' },
]

function ContactIcon({ kind }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {kind === 'pin'
        ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>
        : kind === 'phone'
          ? <path d="m5 3 4 1 1 5-3 2a16 16 0 0 0 6 6l2-3 5 1 1 4c-1 5-9 1-13-3S0 4 5 3Z" />
          : <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>}
    </svg>
  )
}

export default function LetsTalk() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(['', '', ''])
  const [submit, setSubmit] = useState({ pending: false, message: '', sent: false })
  const [mapReady, setMapReady] = useState(false)
  const input = useRef(null)
  const requestId = useRef(null)
  const sending = useRef(false)
  const { phone, email, officeAddress, acceptingEnquiries, isSettingsLoading } = useSiteSettings()
  const directions = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(officeAddress)

  useEffect(() => { document.title = 'Contacts — MW Futuretech' }, [])

  async function next(event) {
    event.preventDefault()
    if (sending.current || submit.sent) return
    if (!values[step].trim()) {
      setSubmit({ pending: false, sent: false, message: 'Please fill in this field.' })
      return
    }
    if (step < 2) {
      setStep(step + 1)
      setSubmit({ pending: false, sent: false, message: '' })
      requestAnimationFrame(() => input.current?.focus())
      return
    }
    sending.current = true
    setSubmit({ pending: true, sent: false, message: '' })
    requestId.current ??= globalThis.crypto.randomUUID()
    try {
      await siteRequest('/api/enquiries', {
        source: 'contact', name: values[0], email: values[1], message: values[2], requestId: requestId.current,
      })
      setSubmit({ pending: false, sent: true, message: 'Thank you. Your enquiry has been received.' })
    } catch (error) {
      setSubmit({ pending: false, sent: false, message: error.message })
    } finally {
      sending.current = false
    }
  }

  function update(value) {
    requestId.current = null
    setValues(previous => previous.map((item, index) => index === step ? value : item))
  }

  if (isSettingsLoading) return <RouteSkeleton pathname="/contact" />

  return (
    <main className="contact-page">
      <div className="contact-map">
        {!mapReady && <div className="skeleton-block contact-map__skeleton" aria-hidden="true" />}
        <iframe title="Hustlehub Tech Park, Bengaluru" src="https://www.openstreetmap.org/export/embed.html?bbox=77.626%2C12.888%2C77.676%2C12.914&layer=mapnik&marker=12.901158%2C77.651153" loading="lazy" referrerPolicy="no-referrer" onLoad={() => setMapReady(true)} />
      </div>
      <section className="contact-content" aria-labelledby="contact-title">
        <header className="contact-heading">
          <p>Let’s talk</p>
          <h1 id="contact-title">Contacts<span>.</span></h1>
        </header>
        <div className="contact-details">
          <div><h2><ContactIcon kind="pin" />Address</h2><p><a href={directions} target="_blank" rel="noreferrer">{officeAddress}</a></p><p>Bhopal, Madhya Pradesh, India</p></div>
          {phone && <div><h2><ContactIcon kind="phone" />Phone</h2><p><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></p></div>}
          {email && <div><h2><ContactIcon kind="mail" />Email</h2><p><a href={`mailto:${email}`}>{email}</a></p></div>}
        </div>
        <section className="contact-form-area" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">Get in touch</h2>
          {acceptingEnquiries === false ? (
            <p className="contact-feedback">For enquiries, email <a href={`mailto:${email}`}>{email}</a>.</p>
          ) : <form onSubmit={next}>
            <fieldset disabled={submit.pending || submit.sent}>
            <div className="contact-entry">
              <label className="contact-input-label">
                <span className="contact-sr-only">{fields[step].label}</span>
                {step === 2
                  ? <textarea ref={element => { input.current = element }} key="message" required rows={2} maxLength={4000} placeholder={fields[step].placeholder} value={values[step]} onChange={event => update(event.target.value)} />
                  : <input ref={element => { input.current = element }} key={step} type={fields[step].type} autoComplete={fields[step].autocomplete} required maxLength={step === 0 ? 120 : 254} placeholder={fields[step].placeholder} value={values[step]} onChange={event => update(event.target.value)} />}
              </label>
              <button className="contact-next" type="submit">
                <span>{step === 2 ? (submit.pending ? 'Sending…' : 'Send enquiry') : 'Next'}</span>
                <span className="contact-next-icon" aria-hidden="true">→</span>
              </button>
            </div>
            <div className="contact-form-meta">
              <div className="contact-steps" aria-label={`Step ${step + 1} of 3`}>
                {fields.map((field, index) => (
                  <button
                    key={field.label}
                    type="button"
                    aria-label={`Step ${index + 1}: ${field.label}`}
                    aria-current={step === index ? 'step' : undefined}
                    disabled={index > step}
                    onClick={() => { setStep(index); setSubmit({ pending: false, message: '', sent: false }) }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
            </fieldset>
            <p className="contact-feedback" role="status">{submit.message}</p>
            <p className="contact-privacy">We use your details to respond to your enquiry. <Link to="/privacy">Privacy policy</Link></p>
          </form>}
        </section>
      </section>
      <a className="contact-map-link" href={directions} target="_blank" rel="noreferrer">Bengaluru directions <span aria-hidden="true">↗</span></a>
      <a className="contact-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
    </main>
  )
}
