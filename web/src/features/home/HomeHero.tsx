import { ProductPanels } from '../../assets/illustrations/ProductPanels.tsx'
import { LinkButton } from '../../components/ui/LinkButton.tsx'
import { profile } from '../../config/profile.ts'

export function HomeHero() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-12 lg:gap-16">
      <div>
        <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
          Portafolio
        </p>
        <h1 className="mt-3 max-w-xl text-h1 tracking-tight text-text-primary">
          {profile.name}
        </h1>
        <p className="mt-3 text-h3 text-text-primary">{profile.role}</p>
        <p className="mt-3 font-mono text-caption text-text-muted">
          Laravel · React · TypeScript · REST APIs · SaaS
        </p>
        <p className="mt-6 max-w-xl text-body text-text-secondary">
          Desarrollo productos web de punta a punta, desde arquitectura backend
          y bases de datos hasta interfaces modernas e integraciones con
          servicios externos.
        </p>
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
        <div className="mt-6 flex flex-wrap gap-4">
          {profile.github ? (
            <a
              href={profile.github}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          ) : null}
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
      <ProductPanels />
    </section>
  )
}
