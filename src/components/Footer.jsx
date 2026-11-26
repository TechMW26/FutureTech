import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { GROUP_URL } from '../data/siteSettings.js'
import { useSiteSettings } from '../lib/siteApi.js'
import './Footer.css'

const EXPLORE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Our work', to: '/work' },
]

const LEGAL_LINKS = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of use', to: '/terms' },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
  const { linkedin, instagram } = useSiteSettings()
  const connectLinks = [
    { label: 'Contact', to: '/contact' },
    { label: 'LinkedIn', href: linkedin },
    { label: 'Instagram', href: instagram },
  ].filter(item => item.to || item.href)

  return (
    <footer className="site-footer">
      <div className="site-footer__card">
        <div className="site-footer__top">
          <div className="site-footer__content">
            <Link to="/" className="site-footer__brand" aria-label="MW Futuretech home">
              <img
                src="/favicon.png"
                alt=""
                loading="lazy"
                decoding="async"
                className="site-footer__logo"
              />
              <span className="site-footer__brand-name">MWfuturetech</span>
            </Link>

            <p className="site-footer__description">
              Thoughtful technology. Meaningful progress.
              <br />
              We turn ambitious ideas into digital experiences.
              <br />
              <a href={GROUP_URL}>A Mushroom World Group company</a>
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            <div className="site-footer__nav-group">
              <span className="site-footer__nav-label">Explore</span>
              <ul className="site-footer__nav-list">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="site-footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="site-footer__nav-group">
              <span className="site-footer__nav-label">Connect</span>
              <ul className="site-footer__nav-list">
                {connectLinks.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to} className="site-footer__link">
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="site-footer__link"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="site-footer__headline-row">
          <p className="site-footer__headline">
            Let&rsquo;s build what&rsquo;s <span className="site-footer__headline-accent">next</span>
          </p>
          <Link
            to="/contact"
            className="site-footer__headline-cta"
            aria-label="Start a project with MW Futuretech"
          >
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            {'\u00A9'} {new Date().getFullYear()} MWfuturetech. All rights reserved.
          </span>
          <div className="site-footer__bottom-links">
            {LEGAL_LINKS.map((item) => (
              <Link key={item.label} to={item.to} className="site-footer__legal-link">
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={scrollToTop}
              className="site-footer__legal-link site-footer__top-link"
            >
              Back to top {'\u2191'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}