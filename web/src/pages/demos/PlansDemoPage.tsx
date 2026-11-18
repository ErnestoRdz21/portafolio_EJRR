import { ArrowUpRight, Gauge, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import { StatusBadge } from '../../features/demos/StatusBadge.tsx'
import { cn } from '../../utils/cn.ts'

const demo = demos.find((entry) => entry.id === 'plans')!

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    quota: 500,
    blurb: 'Para probar el canal de avisos con un volumen bajo.',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 1299,
    quota: 2000,
    blurb: 'Operación diaria con correo y WhatsApp en el mismo cupo.',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 2999,
    quota: 5000,
    blurb: 'Alto volumen, renovación automática y margen para picos.',
  },
] as const

type PlanId = (typeof plans)[number]['id']

/** Números inventados solo para la demo — no son métricas reales de clientes. */
const CYCLE_DAYS = 30
const DAYS_USED = 12
const USED_ON_STARTER = 310

export function PlansDemoPage() {
  const [planId, setPlanId] = useState<PlanId>('starter')
  const [notice, setNotice] = useState<string | null>(null)

  const current = plans.find((plan) => plan.id === planId) ?? plans[0]
  const used = Math.min(USED_ON_STARTER, current.quota)
  const remaining = current.quota - used
  const usagePct = Math.round((used / current.quota) * 100)

  const upgradeQuote = useMemo(() => {
    const target = plans.find((plan) => plan.id === 'growth')!
    if (current.id !== 'starter') {
      return null
    }

    const daysLeft = CYCLE_DAYS - DAYS_USED
    const residual = Math.round((target.price - current.price) * (daysLeft / CYCLE_DAYS))

    return {
      target,
      daysLeft,
      residual,
      nextQuota: target.quota,
    }
  }, [current.id, current.price])

  function simulateUpgrade() {
    if (!upgradeQuote) {
      setNotice('Ya estás en un plan superior al Starter en esta demo.')
      return
    }

    setPlanId('growth')
    setNotice(
      `Upgrade simulado a Growth. Residual de ciclo: $${upgradeQuote.residual} MXN por ${upgradeQuote.daysLeft} días restantes. Cupo nuevo: ${upgradeQuote.nextQuota}. No hay cobro real.`,
    )
  }

  return (
    <DemoFrame demo={demo}>
      <p className="mb-6 max-w-2xl text-small text-text-muted">
        Precios, cupos y residuales son ficticios. Sirven para mostrar el flujo
        de planes / prorrateo, no el billing de un cliente.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const selected = plan.id === current.id
          return (
            <button
              key={plan.id}
              type="button"
              className={cn(
                'focus-ring rounded-xl border p-5 text-left transition-colors',
                selected
                  ? 'border-accent bg-accent-soft'
                  : 'border-border bg-surface hover:bg-surface-secondary',
              )}
              aria-pressed={selected}
              onClick={() => {
                setPlanId(plan.id)
                setNotice(null)
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-h3 tracking-tight text-text-primary">
                  {plan.name}
                </h2>
                {selected ? (
                  <StatusBadge tone="success">Activo</StatusBadge>
                ) : null}
              </div>
              <p className="mt-2 text-small text-text-secondary">{plan.blurb}</p>
              <p className="mt-4 font-mono text-mono-label text-text-primary">
                ${plan.price}
                <span className="text-text-muted"> / mes</span>
              </p>
              <p className="mt-1 text-caption text-text-muted">
                {plan.quota.toLocaleString('es-MX')} avisos / ciclo
              </p>
            </button>
          )
        })}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-accent" aria-hidden="true" />
            <h3 className="text-h3 tracking-tight text-text-primary">
              Cupo del ciclo
            </h3>
          </div>
          <p className="mt-2 text-small text-text-secondary">
            Día {DAYS_USED} de {CYCLE_DAYS}. Uso acumulado de ejemplo.
          </p>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-caption text-text-muted">
              <span>
                {used.toLocaleString('es-MX')} usados
              </span>
              <span>
                {remaining.toLocaleString('es-MX')} libres · {usagePct}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300"
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-small">
            <div className="rounded-lg border border-border bg-surface-secondary p-3">
              <dt className="text-caption text-text-muted">Plan</dt>
              <dd className="mt-1 text-text-primary">{current.name}</dd>
            </div>
            <div className="rounded-lg border border-border bg-surface-secondary p-3">
              <dt className="text-caption text-text-muted">Tope</dt>
              <dd className="mt-1 text-text-primary">
                {current.quota.toLocaleString('es-MX')} avisos
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" aria-hidden="true" />
            <h3 className="text-h3 tracking-tight text-text-primary">
              Upgrade a mitad de ciclo
            </h3>
          </div>
          {upgradeQuote ? (
            <>
              <p className="mt-2 text-small text-text-secondary">
                Del Starter al Growth se calcula un residual por los{' '}
                {upgradeQuote.daysLeft} días que faltan, no un mes completo otra
                vez.
              </p>
              <p className="mt-4 font-mono text-small text-text-primary">
                Residual demo: ${upgradeQuote.residual} MXN
              </p>
              <p className="mt-1 text-caption text-text-muted">
                Fórmula: (precio nuevo − precio actual) × días restantes /{' '}
                {CYCLE_DAYS}
              </p>
              <div className="mt-5">
                <Button
                  variant="primary"
                  className="gap-2"
                  onClick={simulateUpgrade}
                >
                  Simular upgrade
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-small text-text-secondary">
              Elige Starter para ver el cálculo de residual hacia Growth, o
              vuelve a Starter después de simular.
            </p>
          )}
          {current.id !== 'starter' ? (
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setPlanId('starter')
                  setNotice(null)
                }}
              >
                Volver a Starter
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {notice ? (
        <p className="mt-6 text-small text-text-secondary" role="status">
          {notice}
        </p>
      ) : null}
    </DemoFrame>
  )
}
