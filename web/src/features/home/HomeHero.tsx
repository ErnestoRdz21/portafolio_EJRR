import { useCallback } from 'react'
import { ProductPanels } from '../../assets/illustrations/ProductPanels.tsx'
import { SocialLinks } from '../../components/content/SocialLinks.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { LinkButton } from '../../components/ui/LinkButton.tsx'
import { profile } from '../../config/profile.ts'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getSiteContent } from '../../services/siteContent.ts'

export function HomeHero() {
  const load = useCallback((signal: AbortSignal) => getSiteContent(signal), [])
  const { state, retry } = useRemoteData(load)
  const content = state.status === 'ok' ? state.data : null

  return (
    <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-12 lg:gap-16">
      <div>
        <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
          {content?.hero_eyebrow ?? 'Portafolio'}
        </p>
        <h1 className="mt-3 max-w-xl text-h1 tracking-tight text-text-primary">
          {profile.name}
        </h1>
        <p className="mt-3 text-h3 text-text-primary">{profile.role}</p>
        <p className="mt-3 font-mono text-caption text-text-muted">
          Laravel · React · TypeScript · REST APIs · SaaS
        </p>
        {state.status === 'loading' ? (
          <div className="mt-6 max-w-xl space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : null}
        {state.status === 'error' ? (
          <div className="mt-6">
            <ErrorState message={state.message} onRetry={retry} />
          </div>
        ) : null}
        {content ? (
          <>
            {content.hero_body ? (
              <p className="mt-6 max-w-xl text-body text-text-secondary">
                {content.hero_body}
              </p>
            ) : null}
            {content.hero_body_secondary ? (
              <p className="mt-4 max-w-xl text-body text-text-secondary">
                {content.hero_body_secondary}
              </p>
            ) : null}
          </>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to="/work" variant="primary">
            Ver proyectos
          </LinkButton>
          {profile.cvUrl ? (
            <a
              href={profile.cvUrl}
              className="focus-ring inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-small text-text-primary shadow-sm hover:bg-surface-secondary"
            >
              Descargar CV
            </a>
          ) : null}
        </div>
        <SocialLinks className="mt-6" />
      </div>
      <ProductPanels />
    </section>
  )
}
