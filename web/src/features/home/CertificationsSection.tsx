import { CertificationCard } from '../../components/content/CertificationCard.tsx'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { profile } from '../../config/profile.ts'

export function CertificationsSection() {
  const certifications = profile.certifications

  return (
    <Section>
      <SectionHeader eyebrow="Formación" title="Certificaciones" />
      <div className="mt-8">
        {certifications.length === 0 ? (
          <EmptyState
            title="No hay certificaciones publicadas"
            description="Cuando agregue certificaciones al perfil aparecerán aquí."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((item) => (
              <CertificationCard
                key={`${item.title}-${item.issuedAt}`}
                name={item.title}
                issuer={item.issuer}
                issuedAt={`${item.issuedAt} · ${item.hours}`}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

export function CertificationsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando certificaciones"
      className="grid gap-4 md:grid-cols-2"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-3 h-3 w-1/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
