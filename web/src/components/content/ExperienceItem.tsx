import { Briefcase } from 'lucide-react'

type ExperienceItemProps = {
  period?: string | null
  title: string
  company: string
  summary?: string | null
  bullets?: string[]
}

export function ExperienceItem({
  period,
  title,
  company,
  summary,
  bullets = [],
}: ExperienceItemProps) {
  return (
    <article className="relative border-l border-border py-5 pl-6">
      <span
        aria-hidden="true"
        className="absolute top-7 -left-[5px] size-2.5 rounded-full border-2 border-accent bg-surface"
      />
      {period ? (
        <p className="font-mono text-caption text-text-muted">{period}</p>
      ) : null}
      <h3 className="mt-1 flex items-start gap-2 text-h3 break-words text-text-primary">
        <Briefcase
          className="mt-1 size-4 shrink-0 text-accent"
          aria-hidden="true"
        />
        {title}
      </h3>
      <p className="mt-1 text-small text-text-secondary">{company}</p>
      {summary ? (
        <p className="mt-2 text-small break-words text-text-secondary">
          {summary}
        </p>
      ) : null}
      {bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-small text-text-secondary">
          {bullets.map((bullet) => (
            <li key={bullet} className="break-words">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
