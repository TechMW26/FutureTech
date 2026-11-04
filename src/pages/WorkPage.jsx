import { lazy, Suspense } from 'react'
import OffMenuGallery from '../components/OffMenuGallery'

const WorkHero = lazy(() => import('../components/WorkHero'))

export default function WorkPage() {
  return (
    <>
      <Suspense fallback={null}>
        <WorkHero />
      </Suspense>
      <OffMenuGallery
        introEyebrow="Selected Work"
        introTitle="Work that ships, scales, and sticks."
        introLead="A focused look at recent engagements across fintech, infrastructure, AI products, and high-performance digital experiences."
      />
    </>
  )
}