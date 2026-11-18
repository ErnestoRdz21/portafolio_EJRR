import { Mail } from 'lucide-react'
import { useCallback } from 'react'
import { SocialLinks } from '../../components/content/SocialLinks.tsx'
import { LinkButton } from '../../components/ui/LinkButton.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getSiteContent } from '../../services/siteContent.ts'

export function ContactCta() {
  const load = useCallback((signal: AbortSignal) => getSiteContent(signal), [])
  const { state } = useRemoteData(load)
  const description =
    state.status === 'ok' ? state.data.contact_description : null

  return (
    <Section>
      <div className="rounded-xl border border-border bg-surface px-6 py-8 shadow-sm md:px-8">
        <span className="mb-4 grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
          <Mail className="size-4" aria-hidden="true" />
        </span>
        <h2 className="max-w-xl text-h2 tracking-tight text-text-primary">
          ¿Quieres hablar sobre una oportunidad o un proyecto?
        </h2>
        {description ? (
          <p className="mt-3 max-w-xl text-body text-text-secondary">
            {description}
          </p>
        ) : null}
        <div className="mt-6">
          <LinkButton to="/contact" variant="primary">
            Ir a contacto
          </LinkButton>
        </div>
        <SocialLinks className="mt-6" showEmail />
      </div>
    </Section>
  )
}
