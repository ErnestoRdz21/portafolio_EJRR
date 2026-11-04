import {
  asDateOnly,
  asId,
  asNullableString,
  asRecords,
  asString,
  raise,
} from '../lib/rows.ts'
import { bindSignal, getSupabase } from '../lib/supabase.ts'
import type { Certification } from '../types/portfolio.ts'

export async function getCertifications(
  signal?: AbortSignal,
): Promise<Certification[]> {
  const { data, error } = await bindSignal(
    getSupabase()
      .from('certifications')
      .select('id,name,issuer,issued_at,credential_url,image_path')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('issued_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: true }),
    signal,
  )

  raise(error, signal)

  return asRecords(data).map((row) => ({
    id: asId(row.id),
    name: asString(row.name),
    issuer: asNullableString(row.issuer),
    issued_at: asDateOnly(row.issued_at),
    credential_url: asNullableString(row.credential_url),
    image_path: asNullableString(row.image_path),
  }))
}
