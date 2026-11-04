import type { CertificationInput } from './certifications.ts'
import { FieldErrors } from './http.ts'
import type { ProjectInput } from './projects.ts'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function validateProject(
  input: Partial<ProjectInput>,
  creating: boolean,
): void {
  const fields: Record<string, string> = {}

  if (creating || input.title !== undefined) {
    checkText(fields, 'title', input.title, {
      required: creating,
      max: 160,
      requiredMessage: 'El título es obligatorio.',
      longMessage: 'El título es demasiado largo.',
    })
  }

  if (creating || input.slug !== undefined) {
    const slug = input.slug?.trim() ?? ''

    if (slug === '') {
      if (creating || input.slug !== undefined) {
        fields.slug = 'El slug es obligatorio.'
      }
    } else if (slug.length > 160) {
      fields.slug = 'El slug es demasiado largo.'
    } else if (!slugPattern.test(slug)) {
      fields.slug = 'El slug solo puede usar minúsculas, números y guiones.'
    }
  }

  if (creating || input.summary !== undefined) {
    checkText(fields, 'summary', input.summary, {
      required: creating || input.summary !== undefined,
      max: 2000,
      requiredMessage: 'El resumen es obligatorio.',
      longMessage: 'El resumen es demasiado largo.',
    })
  }

  checkOptional(
    fields,
    'subtitle',
    input.subtitle,
    180,
    'El subtítulo es demasiado largo.',
  )
  checkOptional(
    fields,
    'context',
    input.context,
    5000,
    'El contexto es demasiado largo.',
  )
  checkOptional(
    fields,
    'problem',
    input.problem,
    5000,
    'El problema es demasiado largo.',
  )
  checkOptional(
    fields,
    'solution',
    input.solution,
    5000,
    'La solución es demasiado larga.',
  )
  checkOptional(
    fields,
    'responsibilities',
    input.responsibilities,
    5000,
    'Las responsabilidades son demasiado largas.',
  )
  checkOptional(
    fields,
    'technical_decisions',
    input.technical_decisions,
    5000,
    'Las decisiones técnicas son demasiado largas.',
  )
  checkOptional(
    fields,
    'challenges',
    input.challenges,
    5000,
    'Los retos son demasiado largos.',
  )
  checkOptional(
    fields,
    'results',
    input.results,
    5000,
    'Los resultados son demasiado largos.',
  )
  checkOptional(
    fields,
    'learnings',
    input.learnings,
    5000,
    'Los aprendizajes son demasiado largos.',
  )
  checkOptional(fields, 'role', input.role, 120, 'El rol es demasiado largo.')
  checkOptional(
    fields,
    'period',
    input.period,
    80,
    'El periodo es demasiado largo.',
  )

  if (input.sort_order !== undefined && !validOrder(input.sort_order)) {
    fields.sort_order = 'El orden debe ser un entero entre 0 y 10000.'
  }

  if (input.technology_ids !== undefined) {
    if (
      !Array.isArray(input.technology_ids) ||
      input.technology_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
    ) {
      fields.technology_ids = 'Hay una tecnología que no existe.'
    }
  }

  if (Object.keys(fields).length > 0) {
    throw new FieldErrors(fields)
  }
}

export function validateCertification(input: CertificationInput): void {
  const fields: Record<string, string> = {}

  checkText(fields, 'name', input.name, {
    required: true,
    max: 180,
    requiredMessage: 'El nombre es obligatorio.',
    longMessage: 'El nombre es demasiado largo.',
  })
  checkOptional(
    fields,
    'issuer',
    input.issuer,
    180,
    'El emisor es demasiado largo.',
  )
  checkOptional(
    fields,
    'credential_url',
    input.credential_url,
    500,
    'La URL de la credencial es demasiado larga.',
  )
  checkOptional(
    fields,
    'image_path',
    input.image_path,
    500,
    'La ruta de la imagen es demasiado larga.',
  )

  if (input.issued_at) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(input.issued_at) ||
      Number.isNaN(Date.parse(input.issued_at))
    ) {
      fields.issued_at = 'La fecha no es válida.'
    }
  }

  if (input.credential_url && !isHttpUrl(input.credential_url)) {
    fields.credential_url = 'La URL de la credencial no es válida.'
  }

  if (!validOrder(input.sort_order)) {
    fields.sort_order = 'El orden debe ser un entero entre 0 y 10000.'
  }

  if (Object.keys(fields).length > 0) {
    throw new FieldErrors(fields)
  }
}

export function validateImageMeta(input: {
  alt_text: string | null
  caption: string | null
  sort_order: number
}): void {
  const fields: Record<string, string> = {}

  if (input.alt_text && input.alt_text.length > 180) {
    fields.alt_text = 'El texto alternativo es demasiado largo.'
  }

  if (input.caption && input.caption.length > 300) {
    fields.caption = 'La leyenda es demasiado larga.'
  }

  if (!validOrder(input.sort_order)) {
    fields.sort_order = 'El orden debe ser un entero entre 0 y 10000.'
  }

  if (Object.keys(fields).length > 0) {
    throw new FieldErrors(fields)
  }
}

function checkText(
  fields: Record<string, string>,
  key: string,
  value: string | null | undefined,
  options: {
    required: boolean
    max: number
    requiredMessage: string
    longMessage: string
  },
): void {
  const text = value?.trim() ?? ''

  if (text === '') {
    if (options.required) {
      fields[key] = options.requiredMessage
    }
    return
  }

  if (text.length > options.max) {
    fields[key] = options.longMessage
  }
}

function checkOptional(
  fields: Record<string, string>,
  key: string,
  value: string | null | undefined,
  max: number,
  message: string,
): void {
  if (value && value.length > max) {
    fields[key] = message
  }
}

function validOrder(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 10000
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
