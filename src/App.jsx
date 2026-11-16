import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Header from './components/Header'
import Footer from './components/Footer'
import SiteSettingsProvider from './components/SiteSettingsProvider'
import LiquidGlassDefs from './components/LiquidGlassDefs'
import { useDesktopScaleCompensation } from './hooks/useDesktopScaleCompensation'
import { useLenisScroll } from './hooks/useLenisScroll'
import './styles/liquid-glass.css'
import './App.css'
import './animations/animations.css'

const Loader = lazy(() => import('./components/Loader'))
const SummitPage = lazy(() => import('./pages/SummitPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const InformationPage = lazy(() => import('./pages/InformationPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const OurWorks = lazy(() => import('./animations/OurWorks'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const NewsEventsPage = lazy(() => import('./animations/NewsEvents'))
const AboutPage = lazy(() => import('./animations/About'))
const LetsTalkPage = lazy(() => import('./animations/LetsTalk'))
const DirectorPage = lazy(() => import('./pages/DirectorPage'))
const SpadeClonePage = lazy(() => import('./pages/SpadeClonePage'))

const PAGE_FADE_DURATION = 0.42
const MODEL_INTRO_ARM_DELAY = 500
const MODEL_INTRO_PATHS = new Set(['/'])

// Routes that render the animation pages. Those pages own their header and
// opt out of Lenis so the position: sticky scroll tracks stay exact.
const ANIMATION_ROUTES = new Set(['/work', '/news-events', '/about', '/contact'])
// Routes that render the site header outside the page-transition wrapper.
const STATIC_HEADER_PATHS = new Set(['/work', '/news-events', '/about', '/contact'])

const isAnimationRoute = (pathname) => ANIMATION_ROUTES.has(pathname)

// Hero background images for routes that still use HeroScene.
const HERO_IMAGE_PRELOADS = [
  '/images/hero-backgrounds/hero-bg-home.webp',
  '/images/hero-backgrounds/hero-bg-services.webp',
  '/images/hero-backgrounds/hero-bg-about.webp',
]

function injectImagePreload(href) {
  if (typeof document === 'undefined') return
  if (!document.querySelector(`link[data-preload-image="${href}"]`)) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = href
    link.fetchPriority = 'high'
    link.dataset.preloadImage = href
    document.head.appendChild(link)
  }
  // Also kick off an Image() fetch + decode so the bitmap is fully
  // decoded and sitting in the memory cache before any route mounts it.
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = href
    if (typeof img.decode === 'function') {
      img.decode().catch(() => { })
    }
  } catch {
    /* ignore */
  }
}

function getModelIntroPath(pathname) {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  return MODEL_INTRO_PATHS.has(normalized) ? normalized : null
}

export default function App() {
  useDesktopScaleCompensation()
  const location = useLocation()
  const normalizedPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '')
  const isSpadeClone = normalizedPath === '/spade'
  const isAdmin = normalizedPath === '/admin'
  const isLightweight = isAdmin || normalizedPath === '/bts2026'
  const showsPublicChrome = !isSpadeClone && !isAdmin
  const usesAnimationPage = isAnimationRoute(normalizedPath)
  const showsStaticHeader = STATIC_HEADER_PATHS.has(normalizedPath)
  const lenisRef = useLenisScroll({ disabled: isSpadeClone || isLightweight || usesAnimationPage })
  const [theme] = useState('light')
  // Stable ref-like objects per model-route path. useMemo avoids accessing
  // .current during render (react-hooks/refs) while still giving children
  // mutable objects the useLayoutEffect below can write into.
  const introStartRefs = useMemo(
    () => Object.fromEntries([...MODEL_INTRO_PATHS].map((path) => [path, { current: null }])),
    [],
  )
  const [loaderComplete, setLoaderComplete] = useState(false)
  const modelIntroPath = isSpadeClone ? null : getModelIntroPath(normalizedPath)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Warm the browser image cache for every hero background as soon as
  // the app mounts. We fire <link rel="preload"> + new Image() + decode()
  // immediately so the bitmaps are already decoded and sitting in memory
  // by the time a user clicks through to another route — no network
  // round-trip, no decode delay, no layout shift on route mount.
  useEffect(() => {
    if (isLightweight || typeof window === 'undefined') return
    HERO_IMAGE_PRELOADS.forEach(injectImagePreload)
  }, [isLightweight])

  // Scroll to top whenever the route changes.
  useEffect(() => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [lenisRef, location.pathname])

  useLayoutEffect(() => {
    if (!modelIntroPath) return undefined

    const introStartRef = introStartRefs[modelIntroPath]
    introStartRef.current = null

    if (!loaderComplete) return undefined

    const timer = window.setTimeout(() => {
      introStartRef.current = performance.now()
    }, MODEL_INTRO_ARM_DELAY)

    return () => window.clearTimeout(timer)
  }, [loaderComplete, modelIntroPath, introStartRefs])

  const getIntroRef = (path) => (
    modelIntroPath === path ? introStartRefs[path] : null
  )

  return (
    <SiteSettingsProvider>
      {!isSpadeClone && !isLightweight && (
        <Suspense fallback={null}>
          <Loader onComplete={() => setLoaderComplete(true)} />
        </Suspense>
      )}
      {showsPublicChrome && <LiquidGlassDefs />}
      {showsPublicChrome && <Header staticPosition={showsStaticHeader} />}

      {/* Cross-fade between routes. mode="wait" lets the outgoing page
          finish fading out before the new one fades in, so the two
          never visually overlap. The animation pages skip the fade so their
          scroll-linked tracks mount at their final geometry. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="page-live"
          initial={usesAnimationPage ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={usesAnimationPage ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={usesAnimationPage
            ? { duration: 0 }
            : { duration: PAGE_FADE_DURATION, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={null}>
            <Routes location={location}>
              <Route path="/" element={<HomePage introStartRef={getIntroRef('/')} />} />
              <Route path="/work" element={<OurWorks />} />
              <Route path="/work/:projectSlug" element={<ProjectPage />} />
              <Route path="/news-events" element={<NewsEventsPage />} />
              <Route path="/services" element={<InformationPage page="services" />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Director profiles live on the original director page. */}
              <Route path="/about/:directorname" element={<Navigate to={`/director${location.pathname.replace(/^\/about/, '')}`} replace />} />
              <Route path="/contact" element={<LetsTalkPage />} />
              <Route path="/lets-talk" element={<Navigate to="/contact" replace />} />
              <Route path="/bts2026" element={<SummitPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/privacy" element={<InformationPage page="privacy" />} />
              <Route path="/terms" element={<InformationPage page="terms" />} />
              <Route path="/director/:directorname" element={<DirectorPage />} />
              <Route path="/spade" element={<SpadeClonePage />} />
              <Route path="*" element={<HomePage introStartRef={getIntroRef('/')} />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      {showsPublicChrome && <Footer />}
    </SiteSettingsProvider>
  )
}
