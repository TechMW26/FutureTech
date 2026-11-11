import { Link } from 'react-router-dom'
import './Footer.css'

const EXPLORE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Services', to: '/news-events' },
  { label: 'Our work', to: '/work' },
]

const CONNECT_LINKS = [
  { label: 'Contact', to: '/lets-talk' },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    rel: 'noopener noreferrer',
    target: '_blank',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    rel: 'noopener noreferrer',
    target: '_blank',
  },
]

const LEGAL_LINKS = [
  { label: 'Privacy policy', href: '#privacy-policy' },
  { label: 'Terms of use', href: '#terms-of-use' },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
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
                {CONNECT_LINKS.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to} className="site-footer__link">
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target={item.target}
                        rel={item.rel}
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
            to="/lets-talk"
            className="site-footer__headline-cta"
            aria-label="Start a project with MW Futuretech"
          >
            <span aria-hidden="true">{'\u2197'}</span>
          </Link>
        </div>

        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            {'\u00A9'} {new Date().getFullYear()} MWfuturetech. All rights reserved.
          </span>
          <div className="site-footer__bottom-links">
            {LEGAL_LINKS.map((item) => (
              <a key={item.label} href={item.href} className="site-footer__legal-link">
                {item.label}
              </a>
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