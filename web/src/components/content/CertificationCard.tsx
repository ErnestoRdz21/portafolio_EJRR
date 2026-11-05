import { Award, Clock3 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { CourseCover } from '../../assets/covers/CourseCover.tsx'
import { cn } from '../../utils/cn.ts'
import { LinkButton } from '../ui/LinkButton.tsx'

type CertificationCardProps = {
  id?: string
  name: string
  issuer?: string | null
  issuedAt?: string | null
  hours?: string | null
  href?: string | null
  imageSrc?: string | null
  imageAlt?: string
  className?: string
  style?: CSSProperties
}

export function CertificationCard({
  id = '',
  name,
  issuer = null,
  issuedAt = null,
  hours = null,
  href = null,
  imageSrc = null,
  imageAlt = '',
  className,
  style,
}: CertificationCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = imageSrc && !imageFailed

  return (
    <article
      style={style}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-secondary">
        {showImage ? (
          <img
            src={imageSrc}
            alt={imageAlt || name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="h-full w-full transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <CourseCover id={id} title={name} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/80 to-transparent" />
        {issuer ? (
          <span className="absolute top-3 left-3 rounded-full border border-border bg-surface/95 px-2.5 py-1 font-mono text-caption text-text-secondary shadow-sm backdrop-blur-sm">
            {issuer}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
            <Award className="size-3.5" aria-hidden="true" />
          </span>
          <h3 className="text-h3 break-words text-text-primary">{name}</h3>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {issuedAt ? (
            <span className="rounded-full border border-border bg-surface-secondary px-2.5 py-1 font-mono text-caption text-text-muted">
              {issuedAt}
            </span>
          ) : null}
          {hours ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-accent-soft px-2.5 py-1 font-mono text-caption text-accent">
              <Clock3 className="size-3" aria-hidden="true" />
              {hours}
            </span>
          ) : null}
        </div>

        {href ? (
          <LinkButton
            to={href}
            variant="ghost"
            className="mt-auto w-fit px-3 pt-5"
          >
            Ver detalle
          </LinkButton>
        ) : null}
      </div>
    </article>
  )
}
