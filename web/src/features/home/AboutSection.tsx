import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { aboutCopy } from './engineering.ts'

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeader eyebrow="Acerca de" title="Enfoque" />
      <div className="mt-6 max-w-2xl space-y-4">
        {aboutCopy.map((paragraph) => (
          <p key={paragraph} className="text-body text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  )
}
