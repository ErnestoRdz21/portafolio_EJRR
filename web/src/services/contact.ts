import { ApiError } from './api.ts'
import { FieldErrors } from './admin/http.ts'
import { isRecord } from '../lib/rows.ts'

export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  website: string
}

export async function sendContact(input: ContactInput): Promise<void> {
  let response: Response

  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        subject: input.subject.trim() === '' ? null : input.subject.trim(),
        message: input.message,
        website: input.website,
      }),
    })
  } catch {
    throw new ApiError('No se pudo conectar con el backend.')
  }

  if (response.status === 201) {
    return
  }

  const payload = await readPayload(response)

  if (response.status === 422) {
    throw new FieldErrors(readFieldErrors(payload))
  }

  if (response.status === 429) {
    throw new ApiError(
      'Has enviado varios mensajes. Espera un momento e inténtalo de nuevo.',
      429,
    )
  }

  throw new ApiError(
    'No se pudo enviar el mensaje. Inténtalo de nuevo.',
    response.status,
  )
}

async function readPayload(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

function readFieldErrors(payload: unknown): Record<string, string> {
  if (!isRecord(payload) || !isRecord(payload.errors)) {
    return {}
  }

  const fields: Record<string, string> = {}

  for (const [key, value] of Object.entries(payload.errors)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      fields[key] = value[0]
    }
  }

  return fields
}
