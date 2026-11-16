// Site context fed into the Magic AI Search LLM as ground-truth.
// Projects, team, leadership, and expertise data are imported live from the same
// modules the website uses, so any content edit there flows through
// automatically — no duplicate copy to maintain here.

import { DIRECTOR_PROFILES } from '../src/data/directors.js'
import { TEAM } from '../src/data/team.js'
import { EXPERTISE_CARDS } from '../src/data/expertise.js'
import { MAX_PROJECTS, projects } from '../src/data/workProjects.js'

const PAGES = [
  {
    path: '/',
    name: 'Home',
    summary:
      'Hero tagline: "Engineering Tomorrow, In Real Time." The "Our Journey So Far" section features selected projects. Home also includes the interactive FAQ.',
  },
  {
    path: '/about',
    name: 'About',
    summary:
      'A studio engineering tomorrow, today. MW Futuretech is a small team of engineers, designers, and researchers building intelligent software for ambitious teams. Meet the team here.',
  },
  {
    path: '/news-events',
    name: 'News & Events',
    summary:
      'Services engineered for scale. From research to production we architect software that ships, operates, and adapts. Covers the six expertise areas (Web Development, UI/UX Design, Branding & Identity, Performance Marketing, Automation & AI, Growth Strategy).',
  },
  {
    path: '/work',
    name: 'Work',
    summary:
      'A portfolio of selected products across AI, sustainable technology, social identity, wellness, astrology, and HR.',
  },
  {
    path: '/contact',
    name: 'Contact',
    summary:
      'Get Started. Reach out to start a project, partnership, or conversation with MW Futuretech.',
  },
]

const PRODUCT_POSITIONING = [
  'MW Futuretech turns live data into intelligent workflows, adaptive interfaces, and automated decisions.',
  'The MW Futuretech Agent OS enriches transaction data in real time, adding structure, accuracy, and intelligence at every layer.',
  'The interactive FAQ answers questions about MW Futuretech and its work.',
]

function buildDirectorsBlock() {
  return Object.values(DIRECTOR_PROFILES)
    .map((profile) => (
      `- ${profile.name} — ${profile.role} at ${profile.organization} (profile page: /director/${profile.slug}). ${profile.statementLead} ${profile.statementBody} ${profile.narrative}`
    ))
    .join('\n')
}

function buildTeamBlock() {
  return TEAM
    .map((member) => (
      `- ${member.name} — ${member.role}. ${member.bio} Skills: ${member.skills.join(', ')}.`
    ))
    .join('\n')
}

function buildExpertiseBlock() {
  return EXPERTISE_CARDS
    .map((card) => `- ${card.title}: ${card.description}`)
    .join('\n')
}

export function buildSiteContext() {
  const pagesBlock = PAGES.map((page) => `- ${page.name} (${page.path}): ${page.summary}`).join('\n')
  const positioningBlock = PRODUCT_POSITIONING.map((line) => `- ${line}`).join('\n')

  return [
    'COMPANY: MW Futuretech — a studio building intelligent systems, adaptive design, and next-generation technology for ambitious teams.',
    '',
    'PAGES (always recommend the relevant page by name and path):',
    pagesBlock,
    '',
    'PRODUCT POSITIONING:',
    positioningBlock,
    '',
    'EXPERTISE AREAS (covered on the Services page /news-events):',
    buildExpertiseBlock(),
    '',
    'SELECTED PROJECTS (shown in Our Journey So Far on / and on /work):',
    projects.slice(0, MAX_PROJECTS).map(({ title, path, category, description }) =>
      `- ${title} (${category}, project page: ${path}): ${description}`,
    ).join('\n'),
    '',
    'LEADERSHIP (covered on the About page /about, individual profiles at /director/<slug>):',
    buildDirectorsBlock(),
    '',
    'TEAM (shown on the About page /about):',
    buildTeamBlock(),
  ].join('\n')
}
