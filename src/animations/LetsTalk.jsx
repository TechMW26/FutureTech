import { useEffect, useRef, useState } from 'react'
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
  const [saved, setSaved] = useState(false)
  const input = useRef(null)

  useEffect(() => { document.title = 'Contacts — MW Futuretech' }, [])

  function next(event) {
    event.preventDefault()
    if (step < 2) { setStep(step + 1); requestAnimationFrame(() => input.current?.focus()); return }
    const text = `Name: ${values[0].trim()}\nEmail: ${values[1].trim()}\n\n${values[2].trim()}\n\nEnquiry — saved locally, not sent.`
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'futuretech-enquiry.txt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setSaved(true)
  }

  function update(value) {
    setValues(previous => previous.map((item, index) => index === step ? value : item))
    setSaved(false)
  }

  return (
    <main className="contact-page">
      <div className="contact-map">
        <iframe title="Office location in Bhopal, India" src="https://www.openstreetmap.org/export/embed.html?bbox=77.354%2C23.215%2C77.449%2C23.269&layer=mapnik&marker=23.241%2C77.401" loading="eager" referrerPolicy="no-referrer" />
      </div>
      <section className="contact-content" aria-labelledby="contact-title">
        <header className="contact-heading">
          <p>Let’s talk</p>
          <h1 id="contact-title">Contacts<span>.</span></h1>
        </header>
        <div className="contact-details">
          <div><h2><ContactIcon kind="pin" />Address</h2><p>Bhopal, India</p></div>
          <div><h2><ContactIcon kind="phone" />Phone</h2><p>+91 00000 00000</p></div>
          <div><h2><ContactIcon kind="mail" />Email</h2><p>hello@futuretech.example</p></div>
        </div>
        <section className="contact-form-area" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">Get in touch</h2>
          <form onSubmit={next}>
            <div className="contact-entry">
              <label className="contact-input-label">
                <span className="contact-sr-only">{fields[step].label}</span>
                {step === 2
                  ? <textarea ref={element => { input.current = element }} key="message" required rows={2} maxLength={4000} placeholder={fields[step].placeholder} value={values[step]} onChange={event => update(event.target.value)} />
                  : <input ref={element => { input.current = element }} key={step} type={fields[step].type} autoComplete={fields[step].autocomplete} required maxLength={step === 0 ? 120 : 254} placeholder={fields[step].placeholder} value={values[step]} onChange={event => update(event.target.value)} />}
              </label>
              <button className="contact-next" type="submit">
                <span>{step === 2 ? 'Save' : 'Next'}</span>
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
                    onClick={() => { setStep(index); setSaved(false) }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
              <p role="status">{saved ? 'Saved.' : ''}</p>
            </div>
          </form>
        </section>
      </section>
      <a className="contact-map-link" href="https://www.openstreetmap.org/?mlat=23.241&mlon=77.401#map=15/23.241/77.401" target="_blank" rel="noreferrer">Explore the map <span aria-hidden="true">↗</span></a>
      <a className="contact-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
    </main>
  )
}
