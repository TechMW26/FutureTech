import { lazy, Suspense } from 'react'
import { SILVER_MODEL_LIGHTING_PROPS } from '../components/heroSceneLighting'
import HeroJourney from '../components/journey/HeroJourney'
import { CLOUD_OPENING_VIEWPORTS } from '../components/journey/cloudOpening'
import FuturetechSections from '../components/futuretech-sections/FuturetechSections'
import HomeJourney from '../components/HomeJourney'
import HomeMagicSearch from '../components/HomeMagicSearch'
import RouteSkeleton from '../components/RouteSkeleton'

// The 3D hero pulls in three/drei; load it after the page shell so first paint isn't blocked.
const HeroScene = lazy(() => import('../components/HeroScene'))

export default function HomePage() {
  return (
    <div className="home-page">
      <Suspense fallback={<RouteSkeleton />}>
        <HeroScene
          title="Engineering Tomorrow, In Real Time."
          tagline="Intelligent systems, adaptive design, and next-generation technology built to move business forward."
          playIntro
          cloudExitViewports={CLOUD_OPENING_VIEWPORTS}
          backgroundImage="/images/hero-backgrounds/hero-bg-home.webp"
          {...SILVER_MODEL_LIGHTING_PROPS}
        />
      </Suspense>
      <HeroJourney />
      <FuturetechSections />
      <HomeJourney />
      <HomeMagicSearch />
    </div>
  )
}

