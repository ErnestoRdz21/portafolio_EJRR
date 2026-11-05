import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { ProjectCover } from '../../assets/covers/ProjectCover.tsx'
import { TechnologyBadge } from './TechnologyBadge.tsx'

type ProjectCardImage = {
  src: string
  alt: string
}

type ProjectCardProps = {
  title: string
  summary: string
  technologies: string[]
  href: string
  cta?: string
  coverImage?: ProjectCardImage | null
}

export function ProjectCard({
  title,
  summary,
  technologies,
  href,
  cta = 'Ver proyecto',
  coverImage = null,
}: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = coverImage && !imageFailed ? coverImage : null

  return (
    <article className="min-w-0 rounded-xl border border-border bg-surface p-3 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        to={href}
        aria-label={`Ver proyecto ${title}`}
        className="focus-ring block rounded-lg"
      >
        <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface-secondary">
          {image ? (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ProjectCover slug={slugFromHref(href)} title={title} />
          )}
        </div>
        <div className="space-y-4 px-2 pt-4 pb-2">
          <h3 className="text-h3 break-words text-text-primary">{title}</h3>
          <p className="line-clamp-3 text-small break-words text-text-secondary">
            {summary}
          </p>
          {technologies.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {technologies.map((name) => (
                <li key={name}>
                  <TechnologyBadge name={name} />
                </li>
              ))}
            </ul>
          ) : null}
          <p className="inline-flex items-center gap-1.5 text-small text-text-primary">
            {cta}
            <ArrowRight className="size-3.5 text-accent" aria-hidden="true" />
          </p>
        </div>
      </Link>
    </article>
  )
}

function slugFromHref(href: string): string | null {
  const match = href.match(/\/work\/([^/?#]+)/)
  return match?.[1] ?? null
}
