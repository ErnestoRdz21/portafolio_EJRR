import { asNullableString, asRecord, raise } from '../lib/rows.ts'
import { getSupabase } from '../lib/supabase.ts'
import { aboutCopy as fallbackAbout } from '../features/home/engineering.ts'
import type { EducationItem, ExperienceRole } from '../config/profile.ts'
import { profile } from '../config/profile.ts'

export type SiteContent = {
  hero_eyebrow: string | null
  hero_body: string | null
  hero_body_secondary: string | null
  about_title: string | null
  about_description: string | null
  about_paragraphs: string[]
  work_description: string | null
  contact_description: string | null
  experience: ExperienceRole[]
  education: EducationItem[]
}

const COLUMNS =
  'id,hero_eyebrow,hero_body,hero_body_secondary,about_title,about_description,about_paragraphs,work_description,contact_description,experience,education'

export async function getSiteContent(
  signal?: AbortSignal,
): Promise<SiteContent> {
  let query = getSupabase()
    .from('site_content')
    .select(COLUMNS)
    .eq('id', 1)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query.maybeSingle()

  raise(error, signal)

  if (!data) {
    return defaults()
  }

  return readSiteContent(asRecord(data))
}

export function defaults(): SiteContent {
  return {
    hero_eyebrow: 'Portafolio',
    hero_body:
      'Construyo productos web de punta a punta: arquitectura backend, bases de datos, interfaces modernas e integraciones con servicios externos. En producción he trabajado módulos de notificaciones, rastreo white-label, mesas de atención y modernización de ajustes a SPA — siempre con foco en que el flujo se entienda y se pueda mantener.',
    hero_body_secondary:
      'Aquí documenté casos reales (anonimizados): qué problema había, qué decidí, cómo lo resolví y qué quedó operando. Si buscas a alguien que cierre el ciclo de Laravel a React, este portafolio es el resumen.',
    about_title: 'Cómo enfoco el trabajo',
    about_description:
      'Ingeniería, producto y operación: que la solución se use, se entienda y se pueda evolucionar.',
    about_paragraphs: [...fallbackAbout],
    work_description:
      'Casos publicados con historia completa: problema, decisión, solución y resultado. Entra a cada uno para ver capturas, el detalle técnico y, cuando existe, una demo con datos ficticios.',
    contact_description:
      'Si buscas a alguien que tome un módulo de punta a punta —API, UI, integraciones y documentación— escríbeme. Puedes dejar WhatsApp en el formulario para que te responda por ahí.',
    experience: profile.experience,
    education: profile.education,
  }
}

function readSiteContent(row: Record<string, unknown>): SiteContent {
  const fallback = defaults()

  return {
    hero_eyebrow: asNullableString(row.hero_eyebrow) ?? fallback.hero_eyebrow,
    hero_body: asNullableString(row.hero_body) ?? fallback.hero_body,
    hero_body_secondary:
      asNullableString(row.hero_body_secondary) ?? fallback.hero_body_secondary,
    about_title: asNullableString(row.about_title) ?? fallback.about_title,
    about_description:
      asNullableString(row.about_description) ?? fallback.about_description,
    about_paragraphs: readStringList(
      row.about_paragraphs,
      fallback.about_paragraphs,
    ),
    work_description:
      asNullableString(row.work_description) ?? fallback.work_description,
    contact_description:
      asNullableString(row.contact_description) ?? fallback.contact_description,
    experience: readExperience(row.experience, fallback.experience),
    education: readEducation(row.education, fallback.education),
  }
}

function readStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const items = value.filter((item): item is string => typeof item === 'string')

  return items.length > 0 ? items : fallback
}

function readExperience(
  value: unknown,
  fallback: ExperienceRole[],
): ExperienceRole[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const items: ExperienceRole[] = []

  for (const entry of value) {
    if (!entry || typeof entry !== 'object') {
      continue
    }

    const row = entry as Record<string, unknown>
    const company = typeof row.company === 'string' ? row.company : ''
    const title = typeof row.title === 'string' ? row.title : ''
    const period = typeof row.period === 'string' ? row.period : ''
    const bullets = Array.isArray(row.bullets)
      ? row.bullets.filter((item): item is string => typeof item === 'string')
      : []

    if (company && title && period) {
      items.push({ company, title, period, bullets })
    }
  }

  return items.length > 0 ? items : fallback
}

function readEducation(
  value: unknown,
  fallback: EducationItem[],
): EducationItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const items: EducationItem[] = []

  for (const entry of value) {
    if (!entry || typeof entry !== 'object') {
      continue
    }

    const row = entry as Record<string, unknown>
    const school = typeof row.school === 'string' ? row.school : ''
    const program = typeof row.program === 'string' ? row.program : ''
    const period = typeof row.period === 'string' ? row.period : ''

    if (school && program && period) {
      items.push({ school, program, period })
    }
  }

  return items.length > 0 ? items : fallback
}
