import type { IncomingMessage, ServerResponse } from 'node:http'
import { createClient } from '@supabase/supabase-js'

type RequestWithBody = IncomingMessage & { body?: unknown }

const LIMIT = 5
const WINDOW_MS = 60_000

export default async function handler(
  request: RequestWithBody,
  response: ServerResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    send(response, 405, { message: 'Método no permitido.' })
    return
  }

  let payload: unknown

  try {
    payload = await readJson(request)
  } catch {
    send(response, 422, { errors: { message: ['El mensaje no es válido.'] } })
    return
  }

  if (!isRecord(payload)) {
    send(response, 422, { errors: { message: ['El mensaje no es válido.'] } })
    return
  }

  const errors = validate(payload)

  if (Object.keys(errors).length > 0) {
    send(response, 422, { errors })
    return
  }

  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    send(response, 201, { message: 'Mensaje recibido correctamente.' })
    return
  }

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    send(response, 503, { message: 'El formulario no está configurado.' })
    return
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const ip = clientIp(request)
  const since = new Date(Date.now() - WINDOW_MS).toISOString()

  if (ip) {
    const recent = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', since)

    if (recent.error) {
      send(response, 500, { message: 'No se pudo enviar el mensaje.' })
      return
    }

    if ((recent.count ?? 0) >= LIMIT) {
      send(response, 429, { message: 'Demasiados mensajes.' })
      return
    }
  }

  const now = new Date().toISOString()
  const inserted = await supabase.from('contact_messages').insert({
    name: text(payload.name).trim(),
    email: text(payload.email).trim(),
    subject: optionalText(payload.subject, 160),
    message: text(payload.message).trim(),
    status: 'new',
    ip_address: ip,
    user_agent: userAgent(request),
    created_at: now,
    updated_at: now,
  })

  if (inserted.error) {
    send(response, 500, { message: 'No se pudo enviar el mensaje.' })
    return
  }

  send(response, 201, { message: 'Mensaje recibido correctamente.' })
}

function validate(payload: Record<string, unknown>): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  const name = text(payload.name).trim()
  const email = text(payload.email).trim()
  const subject = payload.subject
  const message = text(payload.message).trim()

  if (name === '') {
    errors.name = ['El nombre es obligatorio.']
  } else if (name.length > 120) {
    errors.name = ['El nombre es demasiado largo.']
  } else if (hasHtml(name)) {
    errors.name = ['No se puede incluir HTML.']
  }

  if (email === '') {
    errors.email = ['El correo es obligatorio.']
  } else if (email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = [
      email.length > 180
        ? 'El correo es demasiado largo.'
        : 'El correo no es válido.',
    ]
  }

  if (subject !== null && subject !== undefined) {
    const value = text(subject).trim()

    if (value.length > 160) {
      errors.subject = ['El asunto es demasiado largo.']
    } else if (hasHtml(value)) {
      errors.subject = ['No se puede incluir HTML.']
    }
  }

  if (message === '') {
    errors.message = ['El mensaje es obligatorio.']
  } else if (message.length < 10) {
    errors.message = ['El mensaje es demasiado corto.']
  } else if (message.length > 5000) {
    errors.message = ['El mensaje es demasiado largo.']
  } else if (hasHtml(message)) {
    errors.message = ['No se puede incluir HTML.']
  }

  return errors
}

function optionalText(value: unknown, max: number): string | null {
  if (value === null || value === undefined) {
    return null
  }

  const trimmed = text(value).trim()

  if (trimmed === '' || trimmed.length > max) {
    return null
  }

  return trimmed
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function hasHtml(value: string): boolean {
  return value !== value.replace(/<[^>]*>/g, '')
}

function clientIp(request: IncomingMessage): string | null {
  const forwarded = request.headers['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  const ip = raw?.split(',')[0]?.trim() ?? ''

  if (ip === '' || ip.length > 45) {
    return null
  }

  return ip
}

function userAgent(request: IncomingMessage): string | null {
  const value = request.headers['user-agent']
  const agent = Array.isArray(value) ? value[0] : value

  if (!agent) {
    return null
  }

  return agent.slice(0, 2000)
}

async function readJson(request: RequestWithBody): Promise<unknown> {
  if (request.body !== undefined) {
    return typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body
  }

  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const raw = Buffer.concat(chunks).toString('utf8')

  if (raw.trim() === '') {
    return {}
  }

  return JSON.parse(raw) as unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function send(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}
