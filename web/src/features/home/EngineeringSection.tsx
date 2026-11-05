import {
  BadgeCheck,
  ChartColumn,
  Database,
  LayoutTemplate,
  Server,
  Webhook,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback } from 'react'
import { TechnologyBadge } from '../../components/content/TechnologyBadge.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getTechnologies } from '../../services/technologies.ts'
import { engineeringGroups } from './engineering.ts'

export function EngineeringSection() {
  const load = useCallback((signal: AbortSignal) => getTechnologies(signal), [])
  const { state, retry } = useRemoteData(load)
  const catalog = state.status === 'ok' ? state.data : []

  return (
    <Section id="engineering" className="scroll-mt-20">
      <SectionHeader
        eyebrow="Ingeniería"
        title="Cómo trabajo"
        description="Áreas de práctica. Sin barras ni porcentajes."
      />
      <div className="mt-8 space-y-6">
        {state.status === 'loading' ? (
          <LoadingState label="Cargando tecnologías" />
        ) : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status !== 'loading' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {engineeringGroups.map((group) => {
              const Icon = groupIcons[group.title]
              return (
                <Card key={group.title}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <h3 className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
                      {group.title}
                    </h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <TechnologyBadge
                          name={labelFromCatalog(item, catalog)}
                        />
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>
        ) : null}
      </div>
    </Section>
  )
}

const groupIcons: Record<
  (typeof engineeringGroups)[number]['title'],
  LucideIcon
> = {
  Backend: Server,
  Frontend: LayoutTemplate,
  'APIs & Integrations': Webhook,
  Data: Database,
  Quality: BadgeCheck,
  'Data & Business': ChartColumn,
}

function labelFromCatalog(
  item: string,
  catalog: Array<{ name: string }>,
): string {
  const match = catalog.find(
    (technology) => technology.name.toLowerCase() === item.toLowerCase(),
  )

  return match?.name ?? item
}
