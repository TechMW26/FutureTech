import { lazy } from 'react'
import { SILVER_MODEL_LIGHTING_PROPS } from '../components/heroSceneLighting'
import HeroJourney from '../components/journey/HeroJourney'
import FutureScrollReveal from '../components/FutureScrollReveal'
import HomeJourney from '../components/HomeJourney'
import HomeMagicSearch from '../components/HomeMagicSearch'

// The 3D hero pulls in three/drei; load it after the page shell so first paint isn't blocked.
const HeroScene = lazy(() => import('../components/HeroScene'))

export default function HomePage({ introStartRef }) {
  return (
    <div className="home-page">
      <HeroScene
        title="Engineering Tomorrow, In Real Time."
        tagline="Intelligent systems, adaptive design, and next-generation technology built to move business forward."
        introStartRef={introStartRef}
        backgroundImage="/images/hero-backgrounds/hero-bg-home.webp"
        {...SILVER_MODEL_LIGHTING_PROPS}
      />
      <HeroJourney />
      <FutureScrollReveal />
      <HomeJourney />
      <HomeMagicSearch />
    </div>
  )
}

