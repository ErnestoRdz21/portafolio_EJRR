import { EducationItem } from '../../components/content/EducationItem.tsx'
import { ExperienceItem } from '../../components/content/ExperienceItem.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { profile } from '../../config/profile.ts'

export function ExperienceSection() {
  return (
    <Section>
      <SectionHeader eyebrow="Trayectoria" title="Experiencia" />
      <div className="mt-6 max-w-3xl">
        {profile.experience.map((role) => (
          <ExperienceItem
            key={`${role.company}-${role.period}`}
            period={role.period}
            title={role.title}
            company={role.company}
            bullets={role.bullets}
          />
        ))}
      </div>

      <div className="mt-12 max-w-3xl">
        <SectionHeader eyebrow="Formación académica" title="Educación" />
        <div className="mt-6">
          {profile.education.map((item) => (
            <EducationItem
              key={`${item.program}-${item.period}`}
              period={item.period}
              program={item.program}
              school={item.school}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
