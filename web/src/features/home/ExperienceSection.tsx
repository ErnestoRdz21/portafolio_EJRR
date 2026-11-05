import { GraduationCap } from 'lucide-react'
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

      <div className="mt-10 max-w-3xl">
        <h3 className="text-h3 tracking-tight text-text-primary">Educación</h3>
        <ul className="mt-4 space-y-4">
          {profile.education.map((item) => (
            <li
              key={`${item.program}-${item.period}`}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                <GraduationCap className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-small text-text-primary">{item.program}</p>
                <p className="mt-1 text-small text-text-secondary">
                  {item.school}
                </p>
                <p className="mt-1 font-mono text-caption text-text-muted">
                  {item.period}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
