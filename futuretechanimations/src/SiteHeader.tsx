import './SiteHeader.css';

export default function SiteHeader({ news = false, talk = false, about = false }: { news?: boolean; talk?: boolean; about?: boolean }) {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="MW Futuretech home">
          <img className="brand-mark" src="/futuretech-logo.svg" width="24" height="24" alt="Mushroom World" />
          <span className="brand-initials">MW</span>
          <span className="brand-name">Futuretech</span>
        </a>
        <div className="nav-links">
          <a href="/" aria-current={!news && !talk && !about ? 'page' : undefined}>Work</a>
          <a href="/news-events" aria-current={news ? 'page' : undefined}>News&amp;Events</a>
          <a href="/about" aria-current={about ? 'page' : undefined}>About</a>
        </div>
        <a className="nav-cta" href="/lets-talk" aria-current={talk ? 'page' : undefined}>Let&apos;s Talk</a>
      </nav>
    </header>
  );
}
