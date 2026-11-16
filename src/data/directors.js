export const DIRECTOR_PROFILES = {
  'aviraj-sharma': {
    slug: 'aviraj-sharma',
    name: 'Aviraj Sharma',
    firstName: 'Aviraj',
    lastName: 'Sharma',
    role: 'Director',
    organization: 'MW Futuretech',
    image: '/directors/aviraj-sharma-profile.webp',
    ghostHeadline: 'About The Director',
    statementLead:
      'A future-facing director shaping direction with clarity, discipline, and a bias for execution.',
    statementBody:
      'Aviraj Sharma brings together research, design thinking, and technical delivery so ambitious ideas can move from concept to product with intent.',
    narrative:
      'At MW Futuretech, the focus stays on building systems that can adapt as the market changes: tighter feedback loops, sharper product decisions, and digital experiences that feel considered at every layer.',
  },
  'shakeel-jamadar': {
    slug: 'shakeel-jamadar',
    name: 'Shakeel Jamadar',
    firstName: 'Shakeel',
    lastName: 'Jamadar',
    role: 'Director',
    organization: 'MW Futuretech',
    image: '/directors/shakeel-jamadar-profile.webp',
    ghostHeadline: 'About The Director',
    statementLead: 'Technology should make new ideas possible.',
    statementBody: 'Shakeel Jamadar is a director at MW Futuretech, a Mushroom World Group company.',
    narrative: 'MW Futuretech brings software, design and emerging technology together to build practical products.',
  },
}

export function getDirectorProfile(slug = '') {
  return DIRECTOR_PROFILES[slug.trim().toLowerCase()] ?? null
}