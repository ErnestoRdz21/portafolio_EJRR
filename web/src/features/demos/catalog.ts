export const demos = [
  {
    id: 'logistics',
    path: '/demo/logistics',
    projectSlug: 'saas-logistics-platform',
    title: 'Panel de logística',
    summary:
      'Vista de conteos y tabla filtrable sobre envíos ficticios. Sirve para mostrar cómo se consulta el ciclo de un envío sin conectar paqueterías reales.',
  },
  {
    id: 'notifications',
    path: '/demo/notifications',
    projectSlug: 'multichannel-notifications',
    title: 'Mesa de notificaciones',
    summary:
      'Lista de avisos ficticios por canal. “Simular envío” solo marca el registro como enviado: no sale correo ni WhatsApp de verdad. El case study cuenta el producto completo.',
  },
  {
    id: 'tracking',
    path: '/demo/tracking',
    projectSlug: 'white-label-tracking',
    title: 'Rastreo white-label',
    summary:
      'Un solo layout de seguimiento. Cambias marca, acento y mensaje desde configuración local para ver cómo se reutiliza la misma pantalla con distinta identidad.',
  },
  {
    id: 'support',
    path: '/demo/support',
    projectSlug: 'customer-support-desk',
    title: 'Mesa de atención',
    summary:
      'Elige una conversación ficticia, lee el hilo y cambia el estado del caso. Es el recorte de la bandeja: lista + conversación, sin WhatsApp en vivo.',
  },
  {
    id: 'legacy',
    path: '/demo/legacy',
    projectSlug: 'legacy-modernization',
    title: 'Legacy y moderno',
    summary:
      'La misma lista de pantallas en vista clásica (tabla) y en vista de componentes. Ilustra una migración por partes sin apagar lo que sigue en producción.',
  },
  {
    id: 'tours',
    path: '/demo/tours',
    projectSlug: 'guided-product-tours',
    title: 'Tour guiado en vivo',
    summary:
      'Mini SPA de ajustes con un recorrido driver.js. Muestra el patrón de onboarding que armé en producto: anclas, pasos y cierre sin backend real.',
  },
  {
    id: 'emails',
    path: '/demo/emails',
    projectSlug: 'email-template-gallery',
    title: 'Galería de correos',
    summary:
      'Plantillas HTML anonimizadas con preview escritorio/móvil. Misma estructura, distinto branding: avisos de envío, cupo, white-label y renovación.',
  },
  {
    id: 'plans',
    path: '/demo/plans',
    projectSlug: 'notification-billing-plans',
    title: 'Planes y cupos',
    summary:
      'Demo de planes ficticios con cupo del ciclo y upgrade a mitad de periodo. Explica prorrateo/residual sin números de clientes reales.',
  },
] as const

export type DemoEntry = (typeof demos)[number]

export function demoForProject(slug: string): DemoEntry | null {
  return demos.find((demo) => demo.projectSlug === slug) ?? null
}
