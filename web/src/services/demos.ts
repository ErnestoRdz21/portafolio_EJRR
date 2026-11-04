import {
  asDateOnly,
  asId,
  asNullableString,
  asRecord,
  asRecords,
  asString,
  asTimestamp,
  raise,
} from '../lib/rows.ts'
import { bindSignal, getSupabase } from '../lib/supabase.ts'
import { ApiError } from './api.ts'

export type DemoShipment = {
  id: number
  tracking_number: string
  customer: string
  origin: string
  destination: string
  carrier: string
  status: string
  estimated_delivery: string | null
}

export type ShipmentDashboard = {
  shipments: DemoShipment[]
  total: number
  inTransit: number
  delivered: number
  exceptions: number
  carriers: string[]
}

export type DemoNotification = {
  id: number
  event: string
  channel: string
  recipient: string
  status: string
  sent_at: string | null
}

export type DemoConversation = {
  id: number
  customer_name: string
  customer_identifier: string | null
  status: string
  assigned_to: string | null
  last_message_at: string | null
  preview: string | null
}

export type DemoMessage = {
  id: number
  sender_type: string
  content: string
  sent_at: string | null
}

export type DemoConversationDetail = Omit<DemoConversation, 'preview'> & {
  messages: DemoMessage[]
}

const SHIPMENT_STATUSES = [
  'created',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'exception',
] as const

const NOTIFICATION_CHANNELS = ['email', 'whatsapp'] as const
const NOTIFICATION_STATUSES = ['pending', 'sent', 'failed'] as const
const CONVERSATION_STATUSES = ['open', 'pending', 'closed'] as const

export async function getDemoShipments(
  query: string,
  signal?: AbortSignal,
): Promise<ShipmentDashboard> {
  const params = new URLSearchParams(query)
  const status = optional(params.get('status'), SHIPMENT_STATUSES, 'status')
  const carrier = bounded(params.get('carrier'), 120)
  const search = bounded(params.get('search'), 120)

  let shipmentsQuery = getSupabase()
    .from('demo_shipments')
    .select(
      'id,tracking_number,customer_name,origin,destination,carrier,status,estimated_delivery',
    )
    .order('id', { ascending: true })

  if (status) {
    shipmentsQuery = shipmentsQuery.eq('status', status)
  }

  if (carrier) {
    shipmentsQuery = shipmentsQuery.eq('carrier', carrier)
  }

  if (search) {
    shipmentsQuery = shipmentsQuery.or(
      ilikeAny(
        ['tracking_number', 'customer_name', 'origin', 'destination'],
        search,
      ),
    )
  }

  const [shipmentsResult, carriersResult] = await Promise.all([
    bindSignal(shipmentsQuery, signal),
    bindSignal(
      getSupabase()
        .from('demo_shipments')
        .select('carrier')
        .order('carrier', { ascending: true }),
      signal,
    ),
  ])

  raise(shipmentsResult.error, signal)
  raise(carriersResult.error, signal)

  const shipments = asRecords(shipmentsResult.data).map(readShipment)
  const carriers = uniqueStrings(
    asRecords(carriersResult.data).map((row) => asString(row.carrier)),
  )

  return {
    shipments,
    total: shipments.length,
    inTransit: shipments.filter((item) => item.status === 'in_transit').length,
    delivered: shipments.filter((item) => item.status === 'delivered').length,
    exceptions: shipments.filter((item) => item.status === 'exception').length,
    carriers,
  }
}

export async function getDemoNotifications(
  query: string,
  signal?: AbortSignal,
): Promise<DemoNotification[]> {
  const params = new URLSearchParams(query)
  const channel = optional(
    params.get('channel'),
    NOTIFICATION_CHANNELS,
    'channel',
  )
  const status = optional(params.get('status'), NOTIFICATION_STATUSES, 'status')

  let notifications = getSupabase()
    .from('demo_notifications')
    .select('id,event,channel,recipient,status,sent_at')
    .order('id', { ascending: true })

  if (channel) {
    notifications = notifications.eq('channel', channel)
  }

  if (status) {
    notifications = notifications.eq('status', status)
  }

  const { data, error } = await bindSignal(notifications, signal)
  raise(error, signal)

  return asRecords(data).map(readNotification)
}

export async function simulateDemoNotification(
  id: number,
  signal?: AbortSignal,
): Promise<DemoNotification> {
  let query = getSupabase()
    .from('demo_notifications')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id,event,channel,recipient,status,sent_at')

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query.maybeSingle()

  raise(error, signal)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readNotification(asRecord(data))
}

export async function getDemoConversations(
  query: string,
  signal?: AbortSignal,
): Promise<DemoConversation[]> {
  const params = new URLSearchParams(query)
  const search = bounded(params.get('search'), 120)
  let conversations = getSupabase()
    .from('demo_conversations')
    .select(
      'id,customer_name,customer_identifier,status,assigned_to,last_message_at,demo_messages(id,content,sent_at)',
    )
    .order('last_message_at', { ascending: false, nullsFirst: true })
    .order('id', { ascending: false })

  if (search) {
    conversations = conversations.or(
      ilikeAny(['customer_name', 'customer_identifier'], search),
    )
  }

  const { data, error } = await bindSignal(conversations, signal)
  raise(error, signal)

  return asRecords(data).map(readConversation)
}

export async function getDemoConversation(
  id: number,
  signal?: AbortSignal,
): Promise<DemoConversationDetail> {
  let query = getSupabase()
    .from('demo_conversations')
    .select(
      'id,customer_name,customer_identifier,status,assigned_to,last_message_at,demo_messages(id,sender_type,content,sent_at)',
    )
    .eq('id', id)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query.maybeSingle()

  raise(error, signal)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readConversationDetail(asRecord(data))
}

export async function updateDemoConversationStatus(
  id: number,
  status: string,
  signal?: AbortSignal,
): Promise<DemoConversationDetail> {
  if (
    !CONVERSATION_STATUSES.includes(
      status as (typeof CONVERSATION_STATUSES)[number],
    )
  ) {
    throw new ApiError('El estado no es válido.', 422)
  }

  let query = getSupabase()
    .from('demo_conversations')
    .update({ status })
    .eq('id', id)
    .select(
      'id,customer_name,customer_identifier,status,assigned_to,last_message_at,demo_messages(id,sender_type,content,sent_at)',
    )

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query.maybeSingle()

  raise(error, signal)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readConversationDetail(asRecord(data))
}

function readShipment(row: Record<string, unknown>): DemoShipment {
  return {
    id: asId(row.id),
    tracking_number: asString(row.tracking_number),
    customer: asString(row.customer_name),
    origin: asString(row.origin),
    destination: asString(row.destination),
    carrier: asString(row.carrier),
    status: asString(row.status),
    estimated_delivery: asDateOnly(row.estimated_delivery),
  }
}

function readNotification(row: Record<string, unknown>): DemoNotification {
  return {
    id: asId(row.id),
    event: asString(row.event),
    channel: asString(row.channel),
    recipient: asString(row.recipient),
    status: asString(row.status),
    sent_at: asTimestamp(row.sent_at),
  }
}

function readConversation(row: Record<string, unknown>): DemoConversation {
  const messages = asRecords(row.demo_messages)
  const preview = latestContent(messages)

  return {
    id: asId(row.id),
    customer_name: asString(row.customer_name),
    customer_identifier: asNullableString(row.customer_identifier),
    status: asString(row.status),
    assigned_to: asNullableString(row.assigned_to),
    last_message_at: asTimestamp(row.last_message_at),
    preview,
  }
}

function readConversationDetail(
  row: Record<string, unknown>,
): DemoConversationDetail {
  const summary = readConversation(row)

  return {
    id: summary.id,
    customer_name: summary.customer_name,
    customer_identifier: summary.customer_identifier,
    status: summary.status,
    assigned_to: summary.assigned_to,
    last_message_at: summary.last_message_at,
    messages: asRecords(row.demo_messages)
      .map(readMessage)
      .sort((left, right) => {
        const leftTime = left.sent_at ?? ''
        const rightTime = right.sent_at ?? ''

        return leftTime.localeCompare(rightTime) || left.id - right.id
      }),
  }
}

function readMessage(row: Record<string, unknown>): DemoMessage {
  return {
    id: asId(row.id),
    sender_type: asString(row.sender_type),
    content: asString(row.content),
    sent_at: asTimestamp(row.sent_at),
  }
}

function latestContent(messages: Record<string, unknown>[]): string | null {
  let best: { id: number; sent_at: string; content: string } | null = null

  for (const row of messages) {
    const candidate = {
      id: asId(row.id),
      sent_at: asTimestamp(row.sent_at) ?? '',
      content: asString(row.content),
    }

    if (
      !best ||
      candidate.sent_at > best.sent_at ||
      (candidate.sent_at === best.sent_at && candidate.id > best.id)
    ) {
      best = candidate
    }
  }

  return best?.content ?? null
}

function optional<T extends string>(
  value: string | null,
  allowed: readonly T[],
  label: string,
): T | null {
  if (!value) {
    return null
  }

  if (value.length > 120 || !allowed.includes(value as T)) {
    throw new ApiError(`El filtro ${label} no es válido.`, 422)
  }

  return value as T
}

function bounded(value: string | null, max: number): string | null {
  if (!value) {
    return null
  }

  if (value.length > max) {
    throw new ApiError('El filtro de búsqueda no es válido.', 422)
  }

  return value
}

function ilikeAny(columns: string[], raw: string): string {
  const pattern = `"*${escapeIlike(raw)}*"`

  return columns.map((column) => `${column}.ilike.${pattern}`).join(',')
}

function escapeIlike(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/[%_]/g, (char) => `\\${char}`)
    .replace(/[*"(),]/g, '')
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)]
}
