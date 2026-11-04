import {
  asId,
  asNullableString,
  asRecord,
  asRecords,
  asString,
  asTimestamp,
  raise,
} from '../../lib/rows.ts'
import { getSupabase } from '../../lib/supabase.ts'
import { ApiError } from '../api.ts'
import { FieldErrors } from './http.ts'
import type {
  AdminMessageDetail,
  AdminMessageSummary,
  MessageStatus,
} from './types.ts'

const SUMMARY = 'id,name,email,subject,status,created_at'
const DETAIL = 'id,name,email,subject,message,status,created_at'

export async function getAdminMessages(): Promise<AdminMessageSummary[]> {
  const { data, error } = await getSupabase()
    .from('contact_messages')
    .select(SUMMARY)
    .order('id', { ascending: false })

  raise(error)

  return asRecords(data).map(readSummary)
}

export async function getAdminMessage(id: number): Promise<AdminMessageDetail> {
  const { data, error } = await getSupabase()
    .from('contact_messages')
    .select(DETAIL)
    .eq('id', id)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readDetail(asRecord(data))
}

export async function updateAdminMessageStatus(
  id: number,
  status: MessageStatus,
): Promise<AdminMessageDetail> {
  if (status !== 'new' && status !== 'read' && status !== 'archived') {
    throw new FieldErrors({ status: 'El estado no es válido.' })
  }

  const { data, error } = await getSupabase()
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select(DETAIL)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readDetail(asRecord(data))
}

function readSummary(row: Record<string, unknown>): AdminMessageSummary {
  return {
    id: asId(row.id),
    name: asString(row.name),
    email: asString(row.email),
    subject: asNullableString(row.subject),
    status: readStatus(row.status),
    created_at: asTimestamp(row.created_at),
  }
}

function readDetail(row: Record<string, unknown>): AdminMessageDetail {
  return {
    ...readSummary(row),
    message: asString(row.message),
  }
}

function readStatus(value: unknown): MessageStatus {
  if (value === 'new' || value === 'read' || value === 'archived') {
    return value
  }

  throw new ApiError('La respuesta del backend no tiene el formato esperado.')
}
