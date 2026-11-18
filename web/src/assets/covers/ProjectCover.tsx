import {
  ArrowRight,
  Compass,
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  SlidersHorizontal,
} from 'lucide-react'
import type { ReactNode } from 'react'

const covers: Record<string, () => ReactNode> = {
  'saas-logistics-platform': LogisticsCover,
  'multichannel-notifications': NotificationsCover,
  'white-label-tracking': TrackingCover,
  'customer-support-desk': SupportCover,
  'legacy-modernization': LegacyCover,
  'settings-spa-modernization': SettingsCover,
  'guided-product-tours': ToursCover,
  'email-template-gallery': EmailsCover,
  'notification-billing-plans': PlansCover,
}

export function ProjectCover({
  slug,
  title,
}: {
  slug: string | null
  title: string
}) {
  const Cover = slug ? covers[slug] : undefined

  return (
    <div
      data-testid="project-cover"
      className="h-full w-full"
      aria-hidden="true"
    >
      {Cover ? <Cover /> : <GenericCover title={title} />}
    </div>
  )
}

function CoverShell({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden bg-surface-secondary p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <span className="relative w-fit rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-caption text-text-secondary">
        {label}
      </span>
      <div className="relative mt-3">{children}</div>
    </div>
  )
}

function LogisticsCover() {
  return (
    <CoverShell label="Logistics">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <div className="flex items-center gap-2 text-text-muted">
          <span className="size-2 rounded-full bg-accent" />
          <span className="h-px flex-1 bg-border" />
          <Package className="size-4 text-accent" />
          <span className="h-px flex-1 bg-border" />
          <span className="size-2 rounded-full bg-text-primary" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {['Quote', 'Guide', 'Track'].map((item) => (
            <span
              key={item}
              className="rounded-md bg-surface-secondary px-2 py-1.5 text-center font-mono text-caption text-text-secondary"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </CoverShell>
  )
}

function NotificationsCover() {
  const steps = ['Event', 'Service', 'Queue', 'Delivery']

  return (
    <CoverShell label="Notices">
      <div className="flex flex-wrap items-center gap-1.5">
        {steps.map((step, index) => (
          <span key={step} className="inline-flex items-center gap-1.5">
            <span className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-caption text-text-secondary">
              {step}
            </span>
            {index < steps.length - 1 ? (
              <ArrowRight className="size-3 text-text-muted" />
            ) : null}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-caption text-text-primary shadow-sm">
          <Mail className="size-3.5 text-accent" />
          Email
        </span>
        <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-caption text-text-primary shadow-sm">
          <MessageCircle className="size-3.5 text-accent" />
          WhatsApp
        </span>
      </div>
    </CoverShell>
  )
}

function TrackingCover() {
  return (
    <CoverShell label="Tracking">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-accent-soft text-accent">
            <MapPin className="size-4" />
          </span>
          <span>
            <span className="block font-mono text-caption text-text-muted uppercase">
              White label
            </span>
            <span className="block text-small text-text-primary">
              Same layout, own brand
            </span>
          </span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {['1', '2', '3', '4', '5'].map((step, index) => (
            <span
              key={step}
              className={
                index === 2
                  ? 'h-1.5 flex-1 rounded-full bg-accent'
                  : 'h-1.5 flex-1 rounded-full bg-border'
              }
            />
          ))}
        </div>
      </div>
    </CoverShell>
  )
}

function SupportCover() {
  return (
    <CoverShell label="Support">
      <div className="space-y-2">
        <div className="ml-8 rounded-lg rounded-tr-sm border border-border bg-surface px-3 py-2 text-caption text-text-secondary shadow-sm">
          Customer thread
        </div>
        <div className="mr-8 rounded-lg rounded-tl-sm bg-accent-soft px-3 py-2 text-caption text-text-primary">
          Agent reply
        </div>
      </div>
    </CoverShell>
  )
}

function LegacyCover() {
  return (
    <CoverShell label="Modernization">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-border bg-surface p-2">
          <span className="font-mono text-caption text-text-muted uppercase">
            Before
          </span>
          <span className="mt-2 block h-1.5 rounded-sm bg-border" />
          <span className="mt-1.5 block h-1.5 rounded-sm bg-border" />
          <span className="mt-1.5 block h-1.5 w-2/3 rounded-sm bg-border" />
        </div>
        <div className="rounded-lg border border-border bg-surface p-2 shadow-sm">
          <span className="font-mono text-caption text-accent uppercase">
            After
          </span>
          <span className="mt-2 block h-6 rounded-md bg-accent-soft" />
          <span className="mt-1.5 block h-4 rounded-md bg-surface-secondary" />
        </div>
      </div>
    </CoverShell>
  )
}

function SettingsCover() {
  return (
    <CoverShell label="Settings">
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
        <div className="space-y-1.5 rounded-md border border-border bg-surface p-2">
          <span className="block h-1.5 rounded-sm bg-accent" />
          <span className="block h-1.5 rounded-sm bg-border" />
          <span className="block h-1.5 rounded-sm bg-border" />
        </div>
        <div className="rounded-lg border border-border bg-surface p-2 shadow-sm">
          <span className="inline-flex items-center gap-1.5 font-mono text-caption text-text-secondary">
            <SlidersHorizontal className="size-3.5 text-accent" />
            Modules
          </span>
          <span className="mt-2 block h-5 rounded-md bg-accent-soft" />
          <span className="mt-1.5 block h-4 rounded-md bg-surface-secondary" />
        </div>
      </div>
    </CoverShell>
  )
}

function ToursCover() {
  return (
    <CoverShell label="Tours">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-accent-soft text-accent">
            <Compass className="size-4" />
          </span>
          <span>
            <span className="block font-mono text-caption text-text-muted uppercase">
              Onboarding
            </span>
            <span className="block text-small text-text-primary">
              Pasos guiados en la UI
            </span>
          </span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {['1', '2', '3', '4'].map((step, index) => (
            <span
              key={step}
              className={
                index === 1
                  ? 'grid h-6 flex-1 place-items-center rounded-md bg-accent text-caption text-background'
                  : 'grid h-6 flex-1 place-items-center rounded-md bg-surface-secondary font-mono text-caption text-text-muted'
              }
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </CoverShell>
  )
}

function EmailsCover() {
  return (
    <CoverShell label="Emails">
      <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-2">
        <div className="rounded-lg border border-border bg-surface p-2 shadow-sm">
          <span className="block h-1.5 w-16 rounded-sm bg-accent" />
          <span className="mt-2 block h-1.5 rounded-sm bg-border" />
          <span className="mt-1.5 block h-1.5 w-3/4 rounded-sm bg-border" />
          <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-1 font-mono text-caption text-text-secondary">
            <Mail className="size-3" />
            Preview
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface-secondary p-2">
          <span className="mx-auto block h-full max-h-16 w-8 rounded-md border border-border bg-surface" />
        </div>
      </div>
    </CoverShell>
  )
}

function PlansCover() {
  return (
    <CoverShell label="Billing">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <div className="flex items-center gap-2 text-small text-text-primary">
          <CreditCard className="size-4 text-accent" />
          Planes y cupos
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-secondary">
          <span className="block h-full w-2/3 rounded-full bg-accent" />
        </div>
        <div className="mt-2 flex justify-between font-mono text-caption text-text-muted">
          <span>310 / 500</span>
          <span>Upgrade</span>
        </div>
      </div>
    </CoverShell>
  )
}

function GenericCover({ title }: { title: string }) {
  return (
    <CoverShell label="Project">
      <p className="text-small text-text-primary">{title}</p>
    </CoverShell>
  )
}
