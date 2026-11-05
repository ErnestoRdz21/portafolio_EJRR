import { useCallback } from 'react'
import { ProjectCard } from '../../components/content/ProjectCard.tsx'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getFeaturedProjects } from '../../services/projects.ts'
import { imageUrl } from '../../utils/publicUrl.ts'

export function SelectedWork() {
  const load = useCallback(
    (signal: AbortSignal) => getFeaturedProjects(signal),
    [],
  )
  const { state, retry } = useRemoteData(load)

  return (
    <Section>
      <SectionHeader
        eyebrow="Trabajo"
        title="Proyectos destacados"
        description="Casos seleccionados del portafolio."
      />
      <div className="mt-8">
        {state.status === 'loading' ? (
          <LoadingState label="Cargando proyectos" />
        ) : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status === 'ok' && state.data.length === 0 ? (
          <EmptyState
            title="No hay proyectos destacados"
            description="Cuando haya casos publicados, aparecerán aquí."
          />
        ) : null}
        {state.status === 'ok' && state.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.data.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                summary={project.summary}
                technologies={project.technologies.map((item) => item.name)}
                href={`/work/${project.slug}`}
                cta="Ver caso"
                coverImage={coverImage(project.cover_image)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}

function coverImage(
  image: { url?: string | null; path: string; alt_text: string | null } | null,
) {
  const src = imageUrl(image)

  if (!src || !image) {
    return null
  }

  return { src, alt: image.alt_text ?? '' }
}
