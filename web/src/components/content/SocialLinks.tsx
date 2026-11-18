import { Mail } from 'lucide-react'
import { profile } from '../../config/profile.ts'
import { cn } from '../../utils/cn.ts'

type SocialLinksProps = {
  className?: string
  size?: 'sm' | 'md'
  showEmail?: boolean
}

const sizes = {
  sm: 'h-9 gap-2 px-3 text-caption',
  md: 'h-10 gap-2.5 px-4 text-small',
}

export function SocialLinks({
  className,
  size = 'md',
  showEmail = false,
}: SocialLinksProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      {profile.github ? (
        <a
          href={profile.github}
          className={cn(
            'focus-ring inline-flex items-center justify-center rounded-md bg-[#24292f] font-medium text-white shadow-sm transition hover:bg-[#1b1f23]',
            sizes[size],
          )}
          target="_blank"
          rel="noreferrer"
        >
          <GitHubMark className="size-3.5" />
          GitHub
        </a>
      ) : null}
      {profile.linkedin ? (
        <a
          href={profile.linkedin}
          className={cn(
            'focus-ring inline-flex items-center justify-center rounded-md bg-[#0a66c2] font-medium text-white shadow-sm transition hover:bg-[#004182]',
            sizes[size],
          )}
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInMark className="size-3.5" />
          LinkedIn
        </a>
      ) : null}
      {showEmail && profile.email ? (
        <a
          href={`mailto:${profile.email}`}
          className={cn(
            'focus-ring inline-flex items-center justify-center rounded-md border border-border bg-surface font-medium text-text-primary shadow-sm transition hover:bg-surface-secondary',
            sizes[size],
          )}
        >
          <Mail className="size-3.5 text-accent" aria-hidden="true" />
          Email
        </a>
      ) : null}
    </div>
  )
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.77-1.62-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  )
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  )
}
