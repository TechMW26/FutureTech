import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import SummitBanner from './components/SummitBanner'
import SiteSettingsProvider from './components/SiteSettingsProvider'
import LiquidGlassDefs from './components/LiquidGlassDefs'
import RouteSkeleton from './components/RouteSkeleton'
import { useDesktopScaleCompensation } from './hooks/useDesktopScaleCompensation'
import { useLenisScroll } from './hooks/useLenisScroll'
import './styles/liquid-glass.css'
import './App.css'
import './animations/animations.css'

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

// These pages use native scroll to keep their sticky timelines aligned.
const ANIMATION_ROUTES = new Set(['/work', '/news-events', '/about', '/contact'])

export default function App() {
  useDesktopScaleCompensation()
  const location = useLocation()
  const normalizedPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '')
  const isSpadeClone = normalizedPath === '/spade'
  const isAdmin = normalizedPath === '/admin'
  const isLightweight = isAdmin || normalizedPath === '/bts2026'
  const showsPublicChrome = !isSpadeClone && !isAdmin
  const usesAnimationPage = ANIMATION_ROUTES.has(normalizedPath)
  const lenisRef = useLenisScroll({ disabled: isSpadeClone || isLightweight || usesAnimationPage })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  // Reset scroll before the incoming shell paints.
  useLayoutEffect(() => {
    const lenis = lenisRef.current
    lenis?.stop()
    window.scrollTo({ top: 0, behavior: 'instant' })
    lenis?.start()
  }, [lenisRef, location.pathname])

  return (
    <SiteSettingsProvider>
      {showsPublicChrome && <LiquidGlassDefs />}
      {showsPublicChrome && <Header staticPosition={usesAnimationPage} />}

      <main key={location.pathname} className="page-live">
        <Suspense fallback={<RouteSkeleton pathname={normalizedPath} />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
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
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>

      {showsPublicChrome && <Footer />}
      {showsPublicChrome && <SummitBanner />}
    </SiteSettingsProvider>
  )
}
