import {
  asBoolean,
  asId,
  asNullableString,
  asRecord,
  asRecords,
  asString,
  bySortThenId,
  pickCover,
  raise,
  storagePublicUrl,
} from '../lib/rows.ts'
import {
  bindSignal,
  getSupabase,
  storageBaseUrl,
  storageBucket,
} from '../lib/supabase.ts'
import type {
  ProjectDetail,
  ProjectImage,
  ProjectListItem,
} from '../types/portfolio.ts'
import { ApiError } from './api.ts'
import { sortTechnologies } from './technologies.ts'

const TECHNOLOGY_EMBED = 'technologies(id,name,slug,category,sort_order)'
const IMAGE_EMBED =
  'project_images(id,path,alt_text,caption,sort_order,is_cover)'

const LIST_COLUMNS = `id,slug,title,subtitle,summary,role,period,is_featured,${TECHNOLOGY_EMBED},${IMAGE_EMBED}`
const DETAIL_COLUMNS = `id,slug,title,subtitle,summary,context,problem,solution,responsibilities,technical_decisions,challenges,results,learnings,role,period,${TECHNOLOGY_EMBED},${IMAGE_EMBED}`

export function getFeaturedProjects(
  signal?: AbortSignal,
): Promise<ProjectListItem[]> {
  return fetchProjectList(true, signal)
}

export function getProjects(signal?: AbortSignal): Promise<ProjectListItem[]> {
  return fetchProjectList(false, signal)
}

async function fetchProjectList(
  featuredOnly: boolean,
  signal?: AbortSignal,
): Promise<ProjectListItem[]> {
  let query = getSupabase()
    .from('projects')
    .select(LIST_COLUMNS)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  if (featuredOnly) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await bindSignal(query, signal)
  raise(error, signal)

  return asRecords(data).map(readProjectListItem)
}

export async function getProject(
  slug: string,
  signal?: AbortSignal,
): Promise<ProjectDetail> {
  let query = getSupabase()
    .from('projects')
    .select(DETAIL_COLUMNS)
    .eq('slug', slug)
    .eq('is_published', true)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query.maybeSingle()

  raise(error, signal)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readProjectDetail(asRecord(data))
}

function readProjectListItem(value: unknown): ProjectListItem {
  const row = asRecord(value)
  const images = readImages(row.project_images)
  const cover = pickCover(images)

  return {
    id: asId(row.id),
    slug: asString(row.slug),
    title: asString(row.title),
    subtitle: asNullableString(row.subtitle),
    summary: asString(row.summary),
    role: asNullableString(row.role),
    period: asNullableString(row.period),
    is_featured: asBoolean(row.is_featured),
    cover_image: cover,
    technologies: sortTechnologies(asRecords(row.technologies)),
  }
}

function readProjectDetail(row: Record<string, unknown>): ProjectDetail {
  const base = readProjectListItem(row)

  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    subtitle: base.subtitle,
    summary: base.summary,
    context: asNullableString(row.context),
    problem: asNullableString(row.problem),
    solution: asNullableString(row.solution),
    responsibilities: asNullableString(row.responsibilities),
    technical_decisions: asNullableString(row.technical_decisions),
    challenges: asNullableString(row.challenges),
    results: asNullableString(row.results),
    learnings: asNullableString(row.learnings),
    role: base.role,
    period: base.period,
    technologies: base.technologies,
    images: readImages(row.project_images),
  }
}

function readImages(value: unknown): ProjectImage[] {
  return asRecords(value).map(readProjectImage).sort(bySortThenId)
}

function readProjectImage(row: Record<string, unknown>): ProjectImage {
  const path = asString(row.path)

  return {
    id: asId(row.id),
    path,
    url: storagePublicUrl(path, storageBaseUrl(), storageBucket()),
    alt_text: asNullableString(row.alt_text),
    caption: asNullableString(row.caption),
    sort_order: asId(row.sort_order),
    is_cover: asBoolean(row.is_cover),
  }
}
