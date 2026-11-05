import { usePageMeta } from '../seo/usePageMeta.ts'
import { AboutSection } from '../features/home/AboutSection.tsx'
import { CertificationsSection } from '../features/home/CertificationsSection.tsx'
import { ContactCta } from '../features/home/ContactCta.tsx'
import { EngineeringSection } from '../features/home/EngineeringSection.tsx'
import { ExperienceSection } from '../features/home/ExperienceSection.tsx'
import { HomeHero } from '../features/home/HomeHero.tsx'
import { SelectedWork } from '../features/home/SelectedWork.tsx'

export function HomePage() {
  usePageMeta({
    title: 'Ernesto Rodríguez — Full Stack Developer',
    description:
      'Full Stack Developer especializado en Laravel, React y TypeScript, con experiencia en SaaS, APIs REST, integraciones y productos web.',
    path: '/',
    image: '/og.png',
  })

  return (
    <>
      <HomeHero />
      <SelectedWork />
      <AboutSection />
      <EngineeringSection />
      <ExperienceSection />
      <CertificationsSection />
      <ContactCta />
    </>
  )
}
