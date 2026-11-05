import algae from '../carousel/algae.jpg'
import canact from '../carousel/canact.jpg'
import dtps from '../carousel/dtps.jpg'
import mayalogy from '../carousel/mayalogy.jpg'
import mira from '../carousel/mira.jpg'
import talioscreen from '../carousel/talioscreen.jpg'

export const projects = [
  {
    id: 'mira',
    title: 'MIRA AI',
    category: 'Intelligent assistant · Product design',
    description: 'An intelligent AI assistant that makes work smarter, faster and more efficient. A calm visual language for chat, code, organisation and automation.',
    src: mira,
    alt: 'MIRA AI intelligent assistant shown on a desktop monitor',
  },
  {
    id: 'algae',
    title: 'Algae Tree',
    category: 'Carbon capture · Sustainable technology',
    description: 'A living solution for cleaner air. A next-gen, algae-powered system that captures carbon dioxide from the air, releases clean oxygen and helps restore a healthier planet.',
    src: algae,
    alt: 'Algae Tree carbon capture device in a glass dome surrounded by greenery',
  },
  {
    id: 'canact',
    title: 'Canact',
    category: 'Social app · Digital identity',
    description: 'A social digital personality app that helps people build a trustworthy identity reflecting who they are in real life through reputation, verified actions and authentic presence.',
    src: canact,
    alt: 'Canact social identity app displayed on a phone',
  },
  {
    id: 'dtps',
    title: 'DTPS',
    category: 'Weight loss & nutrition · Web experience',
    description: 'A trusted weight loss and nutrition partner. A warm, personal site connecting sustainable weight loss, PCOS management and holistic health.',
    src: dtps,
    alt: 'DTPS dietitian website shown on a laptop surrounded by fresh produce',
  },
  {
    id: 'mayalogy',
    title: 'Mayalogy',
    category: 'Astrology · Personal guidance',
    description: 'A personal astrology companion. Discover, understand and align through readings, AI-powered guidance and cosmic remedies.',
    src: mayalogy,
    alt: 'Mayalogy astrology platform shown on a laptop with zodiac imagery',
  },
  {
    id: 'talio',
    title: 'Talio',
    category: 'HRMS & productivity · Product design',
    description: 'Streamline work and empower teams. An HRMS and productivity platform for attendance, leave, payroll and employee management.',
    src: talioscreen,
    alt: 'Talio HRMS platform shown on a desktop monitor',
  },
]

/** The ribbon renders at most eight cards; this keeps that contract explicit. */
export const MAX_PROJECTS = 8

export const workProjects = projects.slice(0, MAX_PROJECTS)
