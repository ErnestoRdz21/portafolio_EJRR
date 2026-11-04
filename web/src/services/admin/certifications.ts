import {
  asBoolean,
  asDateOnly,
  asId,
  asNullableString,
  asRecord,
  asRecords,
  asString,
  raise,
} from '../../lib/rows.ts'
import { getSupabase } from '../../lib/supabase.ts'
import { ApiError } from '../api.ts'
import type { AdminCertification } from './types.ts'
import { validateCertification } from './validate.ts'

export type CertificationInput = {
  name: string
  issuer: string | null
  issued_at: string | null
  credential_url: string | null
  image_path: string | null
  sort_order: number
  is_published: boolean
}

const COLUMNS =
  'id,name,issuer,issued_at,credential_url,image_path,sort_order,is_published'

export async function getAdminCertifications(): Promise<AdminCertification[]> {
  const { data, error } = await getSupabase()
    .from('certifications')
    .select(COLUMNS)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  raise(error)

  return asRecords(data).map(readCertification)
}

export async function createAdminCertification(
  input: CertificationInput,
): Promise<AdminCertification> {
  validateCertification(input)
  const now = new Date().toISOString()
  const { data, error } = await getSupabase()
    .from('certifications')
    .insert({ ...input, created_at: now, updated_at: now })
    .select(COLUMNS)
    .single()

  raise(error)

  return readCertification(asRecord(data))
}

export async function updateAdminCertification(
  id: number,
  input: CertificationInput,
): Promise<AdminCertification> {
  validateCertification(input)
  const { data, error } = await getSupabase()
    .from('certifications')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readCertification(asRecord(data))
}

export async function deleteAdminCertification(id: number): Promise<void> {
  const { error } = await getSupabase()
    .from('certifications')
    .delete()
    .eq('id', id)
  raise(error)
}

function readCertification(row: Record<string, unknown>): AdminCertification {
  return {
    id: asId(row.id),
    name: asString(row.name),
    issuer: asNullableString(row.issuer),
    issued_at: asDateOnly(row.issued_at),
    credential_url: asNullableString(row.credential_url),
    image_path: asNullableString(row.image_path),
    sort_order: asId(row.sort_order),
    is_published: asBoolean(row.is_published),
  }
}
