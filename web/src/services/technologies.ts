import type { Technology } from '../types/portfolio.ts'
import { asId, asRecords, asString, raise } from '../lib/rows.ts'
import { bindSignal, getSupabase } from '../lib/supabase.ts'

export async function getTechnologies(
  signal?: AbortSignal,
): Promise<Technology[]> {
  const { data, error } = await bindSignal(
    getSupabase()
      .from('technologies')
      .select('id,name,slug,category,sort_order')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    signal,
  )

  raise(error, signal)

  return asRecords(data).map(readTechnologyRow)
}

function readTechnologyRow(row: Record<string, unknown>): Technology {
  return {
    id: asId(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    category: asString(row.category),
  }
}

export function sortTechnologies(
  rows: Record<string, unknown>[],
): Technology[] {
  return rows
    .map((row) => ({
      technology: readTechnologyRow(row),
      sort_order: asId(row.sort_order ?? 0),
    }))
    .sort(
      (left, right) =>
        left.sort_order - right.sort_order ||
        left.technology.name.localeCompare(right.technology.name) ||
        left.technology.id - right.technology.id,
    )
    .map((item) => item.technology)
}
