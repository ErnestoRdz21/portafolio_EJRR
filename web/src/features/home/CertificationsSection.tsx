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
      <SectionHeader
        eyebrow="Cursos"
        title="Certificaciones"
        description="Formación continua con foco en calidad, frontend y Laravel."
      />
      <div className="mt-8">
        {certifications.length === 0 ? (
          <EmptyState
            title="No hay certificaciones publicadas"
            description="Cuando agregue certificaciones al perfil aparecerán aquí."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {certifications.map((item, index) => (
              <CertificationCard
                key={item.id}
                id={item.id}
                name={item.title}
                issuer={item.issuer}
                issuedAt={item.issuedAt}
                hours={item.hours}
                imageSrc={item.imageSrc}
                imageAlt={`Portada del curso ${item.title}`}
                className="animate-cert-in"
                style={{ animationDelay: `${index * 70}ms` }}
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
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
