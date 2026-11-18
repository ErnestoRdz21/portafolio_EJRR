import { Monitor, Smartphone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import { emailTemplates } from '../../features/demos/emailTemplates.ts'
import { cn } from '../../utils/cn.ts'

const demo = demos.find((entry) => entry.id === 'emails')!

type PreviewMode = 'desktop' | 'mobile'

export function EmailGalleryDemoPage() {
  const [selectedId, setSelectedId] = useState(emailTemplates[0].id)
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const selected =
    emailTemplates.find((item) => item.id === selectedId) ?? emailTemplates[0]

  const frameWidth = mode === 'desktop' ? '100%' : '23.5rem'

  const srcDoc = useMemo(() => selected.html, [selected.html])

  return (
    <DemoFrame demo={demo}>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside aria-label="Plantillas">
          <p className="font-mono text-caption text-text-muted uppercase">
            Galería
          </p>
          <ul className="mt-3 space-y-2">
            {emailTemplates.map((item) => {
              const active = item.id === selected.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={
                      active
                        ? 'focus-ring w-full rounded-lg border border-accent bg-accent-soft px-3 py-3 text-left'
                        : 'focus-ring w-full rounded-lg border border-border bg-surface px-3 py-3 text-left hover:bg-surface-secondary'
                    }
                    aria-current={active ? 'true' : undefined}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="block text-small text-text-primary">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-caption text-text-secondary">
                      {item.purpose}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-h3 tracking-tight text-text-primary">
                {selected.name}
              </h2>
              <p className="mt-1 text-small text-text-secondary">
                Asunto: {selected.subject}
              </p>
            </div>
            <div
              role="radiogroup"
              aria-label="Vista previa"
              className="inline-flex rounded-lg border border-border bg-surface p-1"
            >
              {(
                [
                  { id: 'desktop', label: 'Escritorio', icon: Monitor },
                  { id: 'mobile', label: 'Móvil', icon: Smartphone },
                ] as const
              ).map((item) => {
                const Icon = item.icon
                const selectedMode = item.id === mode
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedMode}
                    className={cn(
                      'focus-ring inline-flex h-9 items-center gap-2 rounded-md px-3 text-small',
                      selectedMode
                        ? 'bg-text-primary text-background'
                        : 'text-text-secondary',
                    )}
                    onClick={() => setMode(item.id)}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-surface-secondary p-4">
            <div
              className="mx-auto overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-[max-width] duration-300"
              style={{ maxWidth: frameWidth }}
            >
              <iframe
                title={`Vista previa: ${selected.name}`}
                srcDoc={srcDoc}
                className="block h-[34rem] w-full bg-white"
                sandbox=""
              />
            </div>
          </div>
        </div>
      </div>
    </DemoFrame>
  )
}
