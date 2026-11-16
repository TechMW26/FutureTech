import { projects } from '../src/data/workProjects.js'

export function siteFaqAnswer(query) {
  const question = query.toLowerCase()
  const project = projects.find(item => new RegExp(`\\b(?:${item.id}|${item.title.toLowerCase()})\\b`, 'i').test(question))
  if (project) return `${project.overview} Learn more about [${project.title}](${project.path}).`
  if (/summit|stall|bts2026/.test(question)) return 'Find our event details, featured products and follow-up form on the [Bengaluru Tech Summit page](/bts2026).'
  if (/contact|office|located|bangalore|bengaluru|bhopal|start a project|together|hire|email|phone|number/.test(question)) {
    return 'We have a Bengaluru office in HSR Layout and a presence in Bhopal. Visit [Contact](/contact) for the office address, phone, email and enquiry form.'
  }
  if (/team|director|leadership|who (are|is)|about/.test(question)) return 'MW Futuretech is a Mushroom World Group company. Meet the directors and team on the [About page](/about).'
  if (/build|service|offer|develop|what do you do|automation|design/.test(question)) {
    return 'MW Futuretech builds websites, software products and AI systems. We also work on interface design, branding, and growth. See [Services](/services) or browse [our work](/work).'
  }
  if (/portfolio|projects|products|examples|work/.test(question)) return 'From MIRA AI and Talio to Algae Tree, explore the products we build on the [Work page](/work).'
  return 'I can share published information about MW Futuretech’s [services](/services) and [products](/work). If you’re looking for a specific detail, our team can help.'
}
