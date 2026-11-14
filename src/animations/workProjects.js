import algae from '../assets/project-covers/algae.webp'
import canact from '../assets/project-covers/canact.webp'
import dtps from '../assets/project-covers/dtps.webp'
import mayalogy from '../assets/project-covers/mayalogy.webp'
import mira from '../assets/project-covers/mira.webp'
import talio from '../assets/project-covers/talio.webp'
import { MAX_PROJECTS, projects as projectDetails } from '../data/workProjects.js'

const images = { mira, algae, canact, dtps, mayalogy, talio }

export const projects = projectDetails.map((project) => ({ ...project, src: images[project.id] }))

/** The ribbon renders at most eight cards; this keeps that contract explicit. */
export { MAX_PROJECTS }

export const workProjects = projects.slice(0, MAX_PROJECTS)
