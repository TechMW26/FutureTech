import { DIRECTOR_PROFILES } from './directors.js'
import { TEAM } from './team.js'

export const GROUP_URL = 'https://mushroomworldgroup.com/'
export const SUMMIT_END = '2026-11-20T00:00:00+05:30'
export const OFFICE_ADDRESS = 'H210, Hustlehub Tech Park, Ground Floor, Sector 2, HSR Layout, Bengaluru, Karnataka 560102'

export const portraitNames = [...Object.values(DIRECTOR_PROFILES), ...TEAM].map(({ name }) => name)

export const defaultSiteSettings = {
  phone: '+91 76919 11484',
  email: 'info@mwfuturetech.com',
  whatsapp: '',
  linkedin: '',
  instagram: '',
  officeAddress: OFFICE_ADDRESS,
  bannerText: 'Meet us at Bengaluru Tech Summit.',
  bannerEnabled: true,
  summitIntro: 'We build software, AI systems, and connected products that solve problems in the real world.',
  stallProducts: ['algae', 'talio', 'mira'],
  photos: {},
  acceptingEnquiries: false,
}
