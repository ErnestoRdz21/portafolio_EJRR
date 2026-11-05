import { LinkButton } from '../components/ui/LinkButton.tsx'
import { useNoIndex, usePageMeta } from '../seo/usePageMeta.ts'

export function NotFoundPage() {
  useNoIndex()
  usePageMeta({
    title: 'Página no encontrada — Ernesto Rodríguez',
    description: 'Esta dirección no corresponde a una página del portafolio.',
    path: '/404',
  })

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-h1 tracking-tight text-text-primary">
        Esta página no existe.
      </h1>
      <div className="mt-8">
        <LinkButton to="/" variant="primary">
          Volver al inicio
        </LinkButton>
      </div>
    </div>
  )
}
