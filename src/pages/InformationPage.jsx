import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { EXPERTISE_CARDS } from '../data/expertise.js'
import { useSiteSettings } from '../lib/siteApi.js'
import './SitePages.css'

const titles = { services: 'Services', privacy: 'Privacy policy', terms: 'Terms of use' }

export default function InformationPage({ page }) {
  const { email } = useSiteSettings()
  const title = titles[page]
  useEffect(() => { document.title = `${title} | MW Futuretech` }, [title])

  return (
    <div className="site-page">
      <p className="site-page__eyebrow">MW Futuretech</p>
      <h1>{title}</h1>
      {page === 'services' && <>
        <p>We design and build software, websites and intelligent systems for teams with ambitious ideas.</p>
        <ul className="site-page__cards site-page__section">
          {EXPERTISE_CARDS.map(service => <li key={service.title}><h2>{service.title}</h2><p>{service.description}</p></li>)}
        </ul>
        <Link className="site-button" to="/contact">Discuss your project</Link>
      </>}
      {page === 'privacy' && <div className="site-page__prose">
        <p>This notice explains how Mushroom World FutureTech Private Limited uses information you share on the MW Futuretech website.</p>
        <h2>Enquiries and event follow-ups</h2>
        <p>The contact form asks for your name, email and message. The summit form asks for your name, company, phone number and what interests you. We store these details so our team can review your submission and respond.</p>
        <h2>FAQ and third-party services</h2>
        <p>When the AI service is available, questions submitted to the homepage FAQ are sent to DeepSeek to generate an answer. Share general questions and keep private information out of the FAQ. The office map uses OpenStreetMap. External links take you to services with their own privacy practices.</p>
        <h2>Cookies and access</h2>
        <p>The site uses cookies to limit FAQ requests and support administrator sign-in. Hosting and database services process the information needed to operate the site. Authorised staff use the admin inbox to handle submissions.</p>
        <h2>Questions about your data</h2>
        <p>Contact us to ask about your information or request a correction or deletion. {email && <a href={`mailto:${email}`}>{email}</a>}</p>
      </div>}
      {page === 'terms' && <div className="site-page__prose">
        <p>These terms apply to the MW Futuretech website operated by Mushroom World FutureTech Private Limited.</p>
        <h2>Using this website</h2>
        <p>You may browse our services and products, use the FAQ and contact us. Provide accurate details when you submit a form, and use the site lawfully without disrupting its operation.</p>
        <h2>Information and enquiries</h2>
        <p>Website content and automated FAQ answers are for general information. Product capabilities and availability can change. Contact our team for current details, proposals or support.</p>
        <h2>External services</h2>
        <p>Links to external services are provided for convenience. Their terms apply when you use those services. See our <Link to="/privacy">privacy policy</Link> for information about website submissions.</p>
      </div>}
    </div>
  )
}
