function configuredValue(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export type ExperienceRole = {
  company: string
  title: string
  period: string
  bullets: string[]
}

export type EducationItem = {
  school: string
  program: string
  period: string
}

export type ProfileCertification = {
  title: string
  issuer: string
  issuedAt: string
  hours: string
}

const githubUrl =
  configuredValue(import.meta.env.VITE_GITHUB_URL) ??
  'https://github.com/Neto-1720'

const cvUrl = configuredValue(import.meta.env.VITE_CV_URL) ?? '/cv.pdf'

export const profile = {
  name: 'Ernesto Jahir Rodríguez Ramírez',
  role: 'Full Stack Developer',
  mark: 'ER.',
  email: configuredValue(import.meta.env.VITE_EMAIL),
  github: githubUrl,
  githubUrl,
  linkedin: configuredValue(import.meta.env.VITE_LINKEDIN_URL),
  cvUrl,
  experience: [
    {
      company: 'Teiker Envíos y Soluciones',
      title: 'Full Stack Developer',
      period: 'Octubre 2024 – Presente',
      bullets: [
        'Desarrollé de punta a punta un producto de notificaciones cobrable (email y WhatsApp): modelo de datos, planes por cliente, cupos, prorrateo de upgrades, renovaciones y cancelación programada.',
        'Integré la Meta WhatsApp Cloud API (plantillas, envío con archivos y preferencias por canal) con historial y audiencia.',
        'Diseñé una API REST protegida por token para un microservicio de rastreo y la sincronización por lotes por paquetería, con comandos programados y diagnóstico para QA.',
        'Migré la sección de Ajustes a una SPA sin recargas e integré dentro de ella módulos operativos como transacciones, créditos, tickets, tiendas, direcciones, reportes y multiusuarios.',
        'Implementé monitoreo de errores con Sentry en integraciones de paqueterías y e-commerce, y lideré una campaña de calidad de código guiada por análisis estático.',
        'Desarrollé rastreo personalizado white-label por cliente, con branding, banners y portal de seguimiento.',
        'Agregué pruebas end-to-end con Playwright y pruebas unitarias con PHPUnit, además de documentación técnica y funcional de cada módulo.',
      ],
    },
    {
      company: 'HackerSoft / Sonne Recolección',
      title: 'Desarrollador Web y Soporte Técnico',
      period: 'Noviembre 2021 – 2024',
      bullets: [
        'Desarrollé y mantuve sitios y paneles web para operación y clientes.',
        'Brindé soporte técnico, diagnóstico de incidencias y mejoras incrementales en producción.',
      ],
    },
    {
      company: 'Dairy Queen García',
      title: 'Team Manager',
      period: 'Enero 2019 – Octubre 2019',
      bullets: [
        'Coordiné al equipo de piso, turnos y atención al cliente en operación diaria.',
        'Aseguré estándares de servicio, caja y cumplimiento de procesos del local.',
      ],
    },
  ] satisfies ExperienceRole[],
  education: [
    {
      school: 'Universidad Tecnológica Santa Catarina',
      program: 'Ingeniería en Desarrollo y Gestión de Software',
      period: '2020 – 2022',
    },
    {
      school: 'Universidad Tecnológica Santa Catarina',
      program: 'TSU en Tecnologías de la Información y Comunicación',
      period: '2018 – 2020',
    },
  ] satisfies EducationItem[],
  certifications: [
    {
      title: 'AI-powered QA',
      issuer: 'Udemy',
      issuedAt: 'Octubre 2026',
      hours: '9 h',
    },
    {
      title: 'React para principiantes',
      issuer: 'Udemy',
      issuedAt: 'Septiembre 2026',
      hours: '2.5 h',
    },
    {
      title: 'Usa Laravel para consumir APIs y servicios HTTP',
      issuer: 'Udemy',
      issuedAt: 'Agosto 2026',
      hours: '6 h',
    },
    {
      title: 'Laravel de alto nivel',
      issuer: 'Udemy',
      issuedAt: 'Marzo 2026',
      hours: '17 h',
    },
  ] satisfies ProfileCertification[],
}
