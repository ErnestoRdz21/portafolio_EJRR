import { Mail } from 'lucide-react'
import { SocialLinks } from '../components/content/SocialLinks.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { LinkButton } from '../components/ui/LinkButton.tsx'
import { profile } from '../config/profile.ts'
import { contactFormEnabled } from '../config/site.ts'
import { ContactForm } from '../features/contact/ContactForm.tsx'
import { usePageMeta } from '../seo/usePageMeta.ts'

export function ContactPage() {
  usePageMeta({
    title: 'Contact — Ernesto Rodríguez',
    description:
      'Escríbeme sobre una oportunidad o un proyecto. Full Stack Developer con foco en Laravel, React y TypeScript.',
    path: '/contact',
  })

  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="Contacto"
        title="Escríbeme"
        description="Cuéntame de la oportunidad o del proyecto: contexto, stack y qué necesitas. Si dejas tu WhatsApp, te respondo por ahí; el número es solo para eso, no lo comparto ni lo uso para otra cosa."
      />
      <span className="mt-8 grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
        <Mail className="size-4" aria-hidden="true" />
      </span>
      {contactFormEnabled() ? (
        <ContactForm />
      ) : (
        <div className="mt-4 max-w-xl space-y-4">
          <p className="text-body text-text-secondary">
            Contacto temporalmente no disponible. Puedes contactarme por
            LinkedIn.
          </p>
          {profile.linkedin ? (
            <LinkButton to={profile.linkedin} variant="primary">
              Contactar por LinkedIn
            </LinkButton>
          ) : null}
        </div>
      )}
      <SocialLinks className="mt-8" showEmail />
    </Section>
  )
}
