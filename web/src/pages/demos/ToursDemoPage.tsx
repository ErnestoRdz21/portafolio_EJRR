import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import {
  Bell,
  Compass,
  CreditCard,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'

const demo = demos.find((entry) => entry.id === 'tours')!

const navItems = [
  { id: 'overview', label: 'Resumen', icon: Compass },
  { id: 'team', label: 'Equipo', icon: Users },
  { id: 'billing', label: 'Facturación', icon: CreditCard },
  { id: 'alerts', label: 'Alertas', icon: Bell },
] as const

export function ToursDemoPage() {
  const [active, setActive] =
    useState<(typeof navItems)[number]['id']>('overview')
  const [tourDone, setTourDone] = useState(false)

  function startTour() {
    setTourDone(false)

    const tour = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Atrás',
      doneBtnText: 'Listo',
      overlayColor: 'rgba(15, 18, 22, 0.72)',
      stagePadding: 8,
      stageRadius: 10,
      popoverClass: 'portfolio-tour-popover',
      steps: [
        {
          element: '#tour-demo-search',
          popover: {
            title: 'Buscar módulos',
            description:
              'En el producto real el tour apunta a controles con persistencia por usuario. Aquí el buscador es el primer ancla.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-demo-nav',
          popover: {
            title: 'Navegación de ajustes',
            description:
              'El sistema de tours se reutiliza en varias pantallas: whitelist por config y API común, sin clonar el recorrido.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#tour-demo-panel',
          popover: {
            title: 'Contexto de la pantalla',
            description:
              'Cada paso explica la pieza operativa. Al cerrar, el producto marca el tour como visto para ese usuario.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#tour-demo-cta',
          popover: {
            title: 'Repetir cuando haga falta',
            description:
              'Soporte o un admin puede reactivar el tour. En esta demo solo corre en el navegador: no hay backend.',
            side: 'top',
            align: 'start',
          },
        },
      ],
      onDestroyStarted: () => {
        setTourDone(true)
        tour.destroy()
      },
    })

    tour.drive()
  }

  const ActiveIcon =
    navItems.find((item) => item.id === active)?.icon ?? Settings

  return (
    <DemoFrame demo={demo}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button id="tour-demo-cta" variant="primary" onClick={startTour}>
          Iniciar tour guiado
        </Button>
        {tourDone ? (
          <p className="text-small text-text-secondary" role="status">
            Tour cerrado. En el producto real quedaría marcado como visto.
          </p>
        ) : (
          <p className="text-small text-text-muted">
            Mini SPA de ajustes ficticia. driver.js destaca cada ancla.
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <span className="inline-flex items-center gap-2 font-mono text-caption text-text-muted uppercase">
            <Settings className="size-3.5 text-accent" aria-hidden="true" />
            Ajustes demo
          </span>
          <label className="relative ml-auto block min-w-[12rem] flex-1 sm:max-w-xs">
            <span className="sr-only">Buscar módulos</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              id="tour-demo-search"
              type="search"
              placeholder="Buscar módulo…"
              className="focus-ring h-10 w-full rounded-md border border-border bg-surface-secondary pr-3 pl-9 text-small text-text-primary"
            />
          </label>
        </div>

        <div className="grid gap-0 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <nav
            id="tour-demo-nav"
            aria-label="Módulos de ajustes"
            className="border-b border-border p-3 lg:border-r lg:border-b-0"
          >
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const selected = item.id === active
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={
                        selected
                          ? 'focus-ring flex w-full items-center gap-2 rounded-md bg-accent-soft px-3 py-2 text-left text-small text-text-primary'
                          : 'focus-ring flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-small text-text-secondary hover:bg-surface-secondary'
                      }
                      aria-current={selected ? 'page' : undefined}
                      onClick={() => setActive(item.id)}
                    >
                      <Icon className="size-3.5 text-accent" aria-hidden="true" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <section
            id="tour-demo-panel"
            className="space-y-4 p-5"
            aria-label="Panel activo"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg border border-border bg-surface-secondary">
                <ActiveIcon className="size-4 text-accent" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-h3 tracking-tight text-text-primary">
                  {navItems.find((item) => item.id === active)?.label}
                </h2>
                <p className="text-small text-text-secondary">
                  Contenido ficticio para anclar el tour. No hay datos de
                  clientes.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Preferencias', 'Permisos', 'Historial', 'Integraciones'].map(
                (card) => (
                  <div
                    key={card}
                    className="rounded-lg border border-border bg-surface-secondary p-4"
                  >
                    <p className="font-mono text-caption text-text-muted uppercase">
                      {card}
                    </p>
                    <p className="mt-2 text-small text-text-secondary">
                      Bloque de ejemplo para mostrar el contexto de la pantalla
                      durante el recorrido.
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>
      </div>
    </DemoFrame>
  )
}
