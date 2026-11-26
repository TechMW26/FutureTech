const layouts = new Map([
  ['work', 'work'], ['news-events', 'news'], ['about', 'about'],
  ['contact', 'contact'], ['lets-talk', 'contact'], ['bts2026', 'summit'],
  ['services', 'document'], ['privacy', 'document'], ['terms', 'document'],
  ['admin', 'admin'], ['spade', 'news'],
])

function layoutFor(pathname) {
  const [, page, detail] = pathname.split('/')
  if (page === 'work' && detail) return 'project'
  if (page === 'director' || (page === 'about' && detail)) return 'director'
  return layouts.get(page) ?? 'home'
}

export function SkeletonStatus({ children = 'Loading page…' }) {
  return <span className="skeleton-status" role="status">{children}</span>
}

export function FormSkeleton({ className = '', label = 'Loading form…' }) {
  return (
    <div className={`skeleton-form ${className}`}>
      <SkeletonStatus>{label}</SkeletonStatus>
      <div className="skeleton-stack" aria-hidden="true">
        <span className="skeleton-block skeleton-label" />
        <span className="skeleton-block skeleton-field" />
        <span className="skeleton-block skeleton-button" />
      </div>
    </div>
  )
}

export default function RouteSkeleton({ pathname = '/' }) {
  const layout = layoutFor(pathname)
  return (
    <div className={`route-skeleton route-skeleton--${layout}`}>
      <SkeletonStatus />
      <div className="route-skeleton__inner" aria-hidden="true">
        <div className="route-skeleton__copy skeleton-stack">
          <span className="skeleton-block skeleton-label" />
          <span className="skeleton-block skeleton-title" />
          <span className="skeleton-block skeleton-title skeleton-title--short" />
          <span className="skeleton-block skeleton-line" />
          <span className="skeleton-block skeleton-line skeleton-line--short" />
          <span className="skeleton-block skeleton-button" />
        </div>
        {layout !== 'home' && <div className="skeleton-block route-skeleton__media" />}
      </div>
    </div>
  )
}
