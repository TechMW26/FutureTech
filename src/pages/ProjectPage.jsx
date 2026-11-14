import { useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projects } from '../animations/workProjects'
import './ProjectPage.css'

export default function ProjectPage() {
  const { projectSlug } = useParams()
  const index = projects.findIndex(({ path }) => path === `/work/${projectSlug}`)
  const project = projects[index]
  const nextProject = projects[(index + 1) % projects.length]

  useEffect(() => {
    if (!project) return
    const previousTitle = document.title
    document.title = `${project.title} | MW Futuretech`
    return () => { document.title = previousTitle }
  }, [project])

  if (!project) return <Navigate to="/work" replace />

  return (
    <article className="project-page" aria-labelledby="project-title">
      <div className="project-page__inner">
        <Link className="project-page__back" to="/work">
          <ArrowLeft size={18} aria-hidden="true" />
          All projects
        </Link>

        <header className="project-page__header">
          <div>
            <p className="project-page__category">{project.category}</p>
            <h1 id="project-title">{project.title}</h1>
          </div>
          <p className="project-page__summary">{project.summary}</p>
        </header>

        <img className="project-page__cover" src={project.src} alt={project.alt} fetchPriority="high" />

        <section className="project-page__overview" aria-labelledby="project-overview-title">
          <div>
            <h2 id="project-overview-title">About the project</h2>
            <p>{project.overview}</p>
          </div>
          <div>
            <h2>Project focus</h2>
            <ul>
              {project.focus.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <Link className="project-page__next" to={nextProject.path}>
          <div>
            <span className="project-page__category">Next project</span>
            <strong>{nextProject.title}</strong>
          </div>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
