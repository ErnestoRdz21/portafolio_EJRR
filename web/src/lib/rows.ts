import type { PostgrestError } from '@supabase/supabase-js'
import { ApiError } from '../services/api.ts'
import { FieldErrors } from '../services/admin/http.ts'

export function raise(
  error: PostgrestError | null,
  signal?: AbortSignal,
): void {
  if (signal?.aborted || isAbort(error)) {
    throw new DOMException('The operation was aborted.', 'AbortError')
  }

  if (!error) {
    return
  }

  if (error.code === 'PGRST116') {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  if (error.code === 'PGRST301' || /jwt/i.test(error.message)) {
    throw new ApiError('La sesión expiró.', 401)
  }

  if (error.code === '42501') {
    throw new ApiError(
      'No tienes permiso para esta acción. Revisa que tu usuario esté en public.admins.',
      403,
    )
  }

  if (
    error.code === '23505' &&
    /slug/i.test(`${error.message} ${error.details ?? ''}`)
  ) {
    throw new FieldErrors({ slug: 'Ese slug ya existe.' })
  }

  if (isNetwork(error.message)) {
    throw new ApiError('No se pudo conectar con el backend.')
  }

  throw new ApiError('El backend respondió con un error.')
}

export function asId(value: unknown): number {
  const number =
    typeof value === 'string' && /^-?\d+$/.test(value) ? Number(value) : value

  if (typeof number !== 'number' || !Number.isSafeInteger(number)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return number
}

export function asString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}

export function asNullableString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  return asString(value)
}

export function asBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}

export function asDateOnly(value: unknown): string | null {
  const raw = asNullableString(value)

  if (raw === null) {
    return null
  }

  const match = /^(\d{4}-\d{2}-\d{2})/.exec(raw)

  if (!match) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return match[1]
}

export function asTimestamp(value: unknown): string | null {
  const raw = asNullableString(value)

  if (raw === null) {
    return null
  }

  if (/[zZ]$/.test(raw) || /[+-]\d{2}:?\d{2}$/.test(raw)) {
    return raw
  }

  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T')

  return `${normalized}Z`
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}

export function asRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value.map(asRecord)
}

export function storagePublicUrl(
  path: string | null,
  baseUrl: string | null | undefined,
  bucket: string,
): string | null {
  if (!path) {
    return null
  }

  if (path.startsWith('https://') || path.startsWith('http://')) {
    return path
  }

  if (path.startsWith('/')) {
    return null
  }

  const base = baseUrl?.trim().replace(/\/$/, '')

  if (!base) {
    return null
  }

  const encoded = path
    .split('/')
    .filter((segment) => segment !== '')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encoded}`
}

export function pickCover<T extends { is_cover: boolean }>(
  images: T[],
): T | null {
  return images.find((image) => image.is_cover) ?? images[0] ?? null
}

export function bySortThenId(
  left: { sort_order: number; id: number },
  right: { sort_order: number; id: number },
): number {
  return left.sort_order - right.sort_order || left.id - right.id
}

function isAbort(error: PostgrestError | null): boolean {
  if (!error) {
    return false
  }

  return /abort/i.test(error.message) || error.code === '20'
}

function isNetwork(message: string): boolean {
  return /failed to fetch|networkerror|load failed|network request failed/i.test(
    message,
  )
}
