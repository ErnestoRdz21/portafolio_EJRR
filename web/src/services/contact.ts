import { ApiError } from './api.ts'
import { FieldErrors } from './admin/http.ts'
import { isRecord } from '../lib/rows.ts'

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

export type ContactInput = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  website: string
}

export async function sendContact(input: ContactInput): Promise<void> {
  // Honeypot: bots rellenan "website". No llamamos a la API.
  if (input.website.trim() !== '') {
    return
  }

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()

  if (!accessKey) {
    throw new ApiError(
      'Falta VITE_WEB3FORMS_ACCESS_KEY. Configura la clave de Web3Forms.',
    )
  }

  const name = input.name.trim()
  const email = input.email.trim()
  const topic =
    input.subject.trim() === '' ? 'Nuevo mensaje' : input.subject.trim()
  const whatsapp = whatsAppLink(input.phone)

  let response: Response

  try {
    response = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portafolio · ${name} — ${topic}`,
        from_name: 'Ernesto Rodríguez — Portafolio',
        replyto: email,
        botcheck: false,
        name,
        email,
        Nombre: name,
        Correo: email,
        WhatsApp: `${input.phone.trim()} · ${whatsapp}`,
        'Uso del número':
          'El visitante lo dejó solo para que le respondas por WhatsApp. No compartirlo ni usarlo para otra cosa.',
        Asunto: topic,
        message: input.message.trim(),
      }),
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servicio de contacto.')
  }

  const payload = await readPayload(response)

  if (response.ok && isSuccess(payload)) {
    return
  }

  if (response.status === 422) {
    throw new FieldErrors(readFieldErrors(payload))
  }

  if (response.status === 429) {
    throw new ApiError(
      'Has enviado varios mensajes. Espera un momento e inténtalo de nuevo.',
      429,
    )
  }

  const message =
    isRecord(payload) && typeof payload.message === 'string' && payload.message
      ? payload.message
      : 'No se pudo enviar el mensaje. Inténtalo de nuevo.'

  throw new ApiError(message, response.status)
}

export function whatsAppLink(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.length === 10) {
    digits = `52${digits}`
  }

  return `https://wa.me/${digits}`
}

function isSuccess(payload: unknown): boolean {
  return isRecord(payload) && payload.success === true
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
    } else if (typeof value === 'string') {
      fields[key] = value
    }
  }

  return fields
}
