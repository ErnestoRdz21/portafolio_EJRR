import type { User } from '@supabase/supabase-js'
import { raise } from '../../lib/rows.ts'
import { getSupabase } from '../../lib/supabase.ts'
import { ApiError } from '../api.ts'
import { FieldErrors } from './http.ts'
import type { AdminUser } from './types.ts'

export async function getCurrentUser(): Promise<AdminUser | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new ApiError('No se pudo conectar con el backend.')
  }

  if (!data.session) {
    return null
  }

  const admin = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', data.session.user.id)
    .maybeSingle()

  raise(admin.error)

  if (!admin.data) {
    return null
  }

  return toAdminUser(data.session.user)
}

export async function login(
  email: string,
  password: string,
): Promise<AdminUser> {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error || !data.user) {
    throw loginError(error?.message ?? '', error?.status ?? null)
  }

  const admin = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (admin.error || !admin.data) {
    await supabase.auth.signOut()
  }

  if (admin.error) {
    raise(admin.error)
  }

  if (!admin.data) {
    throw new ApiError('Esta cuenta no es administradora.', 403)
  }

  return toAdminUser(data.user)
}

export async function logout(): Promise<void> {
  const { error } = await getSupabase().auth.signOut()

  if (error) {
    throw new ApiError('No se pudo cerrar la sesión.')
  }
}

function toAdminUser(user: User): AdminUser {
  const metadata = user.user_metadata
  const name =
    metadataString(metadata, 'name') ?? metadataString(metadata, 'full_name')

  return {
    id: user.id,
    name: name ?? user.email ?? 'Admin',
    email: user.email ?? '',
  }
}

function metadataString(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string | null {
  const value = metadata?.[key]

  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  return value.trim()
}

function loginError(message: string, status: number | null): ApiError {
  if (/invalid login credentials/i.test(message)) {
    return new FieldErrors({ email: 'Correo o contraseña incorrectos.' })
  }

  if (/email not confirmed/i.test(message)) {
    return new ApiError(
      'Confirma el usuario en Supabase Auth antes de entrar.',
      status,
    )
  }

  if (status === 429) {
    return new ApiError('Demasiados intentos. Espera un momento.', 429)
  }

  return new ApiError('No se pudo iniciar sesión.', status)
}
