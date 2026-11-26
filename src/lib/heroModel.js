import { registerModel } from './modelCache'

// The version gives the simplified mesh a new Cache Storage key.
export const HERO_MODEL_URL = '/models/mwft-hero-optimized.glb?v=2'

const entry = registerModel(HERO_MODEL_URL)

export const heroModelPromise = entry.promise
export const getHeroModelReady = entry.isReady
export const getHeroModelUrl = entry.getUrl
