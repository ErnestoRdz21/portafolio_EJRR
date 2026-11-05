import { Bot, Code2, Database, Layers3, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

const covers: Record<string, () => ReactNode> = {
  'ai-powered-qa': AiQaCover,
  'react-beginners': ReactCover,
  'laravel-apis': LaravelApisCover,
  'laravel-advanced': LaravelAdvancedCover,
}

export function CourseCover({ id, title }: { id: string; title: string }) {
  const Cover = covers[id]

  return (
    <div className="h-full w-full" aria-hidden="true">
      {Cover ? <Cover /> : <GenericCourseCover title={title} />}
    </div>
  )
}

function Shell({ badge, children }: { badge: string; children: ReactNode }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-surface-secondary via-surface to-accent-soft/40 p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 42%), radial-gradient(circle at 88% 12%, color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 36%)',
        }}
      />
      <span className="relative w-fit rounded-full border border-border bg-surface/90 px-2.5 py-1 font-mono text-caption text-text-secondary backdrop-blur-sm">
        {badge}
      </span>
      <div className="relative">{children}</div>
    </div>
  )
}

function AiQaCover() {
  return (
    <Shell badge="QA · IA">
      <div className="rounded-lg border border-border bg-surface/95 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-accent-soft text-accent">
            <Bot className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption text-text-primary">
              Suite de pruebas
            </p>
            <p className="font-mono text-caption text-text-muted">
              assertions · 94%
            </p>
          </div>
          <Sparkles className="size-4 text-accent" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {['unit', 'e2e', 'ai'].map((label) => (
            <span
              key={label}
              className="rounded-md bg-surface-secondary px-2 py-1.5 text-center font-mono text-caption text-text-secondary"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  )
}

function ReactCover() {
  return (
    <Shell badge="React">
      <div className="space-y-2">
        <div className="rounded-lg border border-border bg-surface/95 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Code2 className="size-4 text-accent" />
            <span className="font-mono text-caption text-text-secondary">
              App.tsx
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="block h-2 w-4/5 rounded-full bg-accent/70" />
            <span className="block h-2 w-3/5 rounded-full bg-border" />
            <span className="block h-2 w-2/3 rounded-full bg-border" />
          </div>
        </div>
        <div className="ml-4 rounded-lg border border-border bg-accent-soft px-3 py-2 text-caption text-text-primary">
          componente · estado · props
        </div>
      </div>
    </Shell>
  )
}

function LaravelApisCover() {
  return (
    <Shell badge="Laravel · API">
      <div className="rounded-lg border border-border bg-surface/95 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 font-mono text-caption text-accent">
            GET
          </span>
          <span className="truncate font-mono text-caption text-text-secondary">
            /api/projects
          </span>
          <span className="font-mono text-caption text-success">200</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface-secondary px-2 py-2">
          <Database className="size-3.5 text-accent" />
          <span className="font-mono text-caption text-text-secondary">
            JSON · auth · resources
          </span>
        </div>
      </div>
    </Shell>
  )
}

function LaravelAdvancedCover() {
  return (
    <Shell badge="Laravel">
      <div className="grid grid-cols-2 gap-2">
        {['Services', 'Jobs', 'Policies', 'Events'].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-surface/95 px-2.5 py-3 shadow-sm"
          >
            <Layers3 className="size-3.5 text-accent" />
            <p className="mt-2 font-mono text-caption text-text-secondary">
              {label}
            </p>
          </div>
        ))}
      </div>
    </Shell>
  )
}

function GenericCourseCover({ title }: { title: string }) {
  return (
    <Shell badge="Curso">
      <div className="rounded-lg border border-border bg-surface/95 p-3 shadow-sm">
        <p className="line-clamp-2 text-small text-text-primary">{title}</p>
      </div>
    </Shell>
  )
}
