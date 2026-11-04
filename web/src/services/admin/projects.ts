import {
  asBoolean,
  asId,
  asNullableString,
  asRecord,
  asRecords,
  asString,
  bySortThenId,
  raise,
  storagePublicUrl,
} from '../../lib/rows.ts'
import {
  getSupabase,
  storageBaseUrl,
  storageBucket,
} from '../../lib/supabase.ts'
import { ApiError } from '../api.ts'
import { sortTechnologies } from '../technologies.ts'
import { FieldErrors } from './http.ts'
import type {
  AdminProject,
  AdminProjectImage,
  AdminProjectListItem,
  DashboardCounts,
} from './types.ts'
import { validateImageMeta, validateProject } from './validate.ts'

export type ProjectInput = {
  title: string
  slug: string
  subtitle: string | null
  summary: string
  context: string | null
  problem: string | null
  solution: string | null
  responsibilities: string | null
  technical_decisions: string | null
  challenges: string | null
  results: string | null
  learnings: string | null
  role: string | null
  period: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  technology_ids: number[]
}

const ADMIN_PROJECT = `id,slug,title,subtitle,summary,context,problem,solution,responsibilities,technical_decisions,challenges,results,learnings,role,period,is_featured,is_published,sort_order,technologies(id,name,slug,category,sort_order),project_images(id,path,alt_text,caption,sort_order,is_cover)`
const IMAGE_COLUMNS = 'id,path,alt_text,caption,sort_order,is_cover'

export async function getAdminProjects(): Promise<AdminProjectListItem[]> {
  const { data, error } = await getSupabase()
    .from('projects')
    .select('id,title,slug,is_published,is_featured,sort_order')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  raise(error)

  return asRecords(data).map(readProjectListItem)
}

export async function getAdminProject(id: number): Promise<AdminProject> {
  return readProject(await loadProject(id))
}

export async function createAdminProject(
  input: ProjectInput,
): Promise<AdminProject> {
  validateProject(input, true)
  const now = new Date().toISOString()
  const { data, error } = await getSupabase()
    .from('projects')
    .insert({ ...projectRow(input), created_at: now, updated_at: now })
    .select('id')
    .single()

  raise(error)
  const id = asId(asRecord(data).id)
  await syncTechnologies(id, input.technology_ids)

  return readProject(await loadProject(id))
}

export async function updateAdminProject(
  id: number,
  input: Partial<ProjectInput>,
): Promise<AdminProject> {
  validateProject(input, false)
  await writeProject(id, input)

  return readProject(await loadProject(id))
}

export async function patchAdminProject(
  id: number,
  input: Partial<ProjectInput>,
): Promise<AdminProjectListItem> {
  validateProject(input, false)
  await writeProject(id, input)
  const { data, error } = await getSupabase()
    .from('projects')
    .select('id,title,slug,is_published,is_featured,sort_order')
    .eq('id', id)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readProjectListItem(asRecord(data))
}

export async function deleteAdminProject(id: number): Promise<void> {
  const images = await getSupabase()
    .from('project_images')
    .select('path')
    .eq('project_id', id)

  raise(images.error)
  await removeStoredPaths(
    asRecords(images.data ?? []).map((row) => asString(row.path)),
  )

  const { error } = await getSupabase().from('projects').delete().eq('id', id)
  raise(error)
}

export async function uploadProjectImage(
  projectId: number,
  form: FormData,
): Promise<AdminProjectImage> {
  const file = form.get('image')

  if (!(file instanceof File) || file.size === 0) {
    throw new FieldErrors({ image: 'Selecciona una imagen.' })
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new FieldErrors({ image: 'La imagen no puede pasar de 5 MB.' })
  }

  const { ext, contentType } = imageKind(file)
  const sortOrder = Number(form.get('sort_order') ?? 0)
  const altText = formText(form.get('alt_text'))
  const caption = formText(form.get('caption'))
  validateImageMeta({
    alt_text: altText,
    caption,
    sort_order: Number.isInteger(sortOrder) ? sortOrder : -1,
  })

  const project = await getSupabase()
    .from('projects')
    .select('slug')
    .eq('id', projectId)
    .maybeSingle()

  raise(project.error)

  if (!project.data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  const existing = await getSupabase()
    .from('project_images')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)

  raise(existing.error)

  const makeCover =
    wantsCover(form.get('is_cover')) || (existing.count ?? 0) === 0
  const path = `projects/${asString(asRecord(project.data).slug)}/${crypto.randomUUID()}.${ext}`
  const bucket = storageBucket()
  const uploaded = await getSupabase()
    .storage.from(bucket)
    .upload(path, file, { contentType, upsert: false })

  if (uploaded.error) {
    throw new ApiError('No se pudo guardar la imagen.')
  }

  try {
    if (makeCover) {
      const cleared = await getSupabase()
        .from('project_images')
        .update({ is_cover: false })
        .eq('project_id', projectId)

      raise(cleared.error)
    }

    const now = new Date().toISOString()
    const inserted = await getSupabase()
      .from('project_images')
      .insert({
        project_id: projectId,
        path,
        alt_text: altText,
        caption,
        sort_order: sortOrder,
        is_cover: makeCover,
        created_at: now,
        updated_at: now,
      })
      .select(IMAGE_COLUMNS)
      .single()

    raise(inserted.error)

    return readImage(asRecord(inserted.data))
  } catch (error) {
    await getSupabase().storage.from(bucket).remove([path])
    throw error
  }
}

export async function updateProjectImage(
  projectId: number,
  imageId: number,
  input: {
    alt_text: string | null
    caption: string | null
    sort_order: number
    is_cover: boolean
  },
): Promise<AdminProjectImage> {
  validateImageMeta(input)

  if (input.is_cover) {
    const cleared = await getSupabase()
      .from('project_images')
      .update({ is_cover: false })
      .eq('project_id', projectId)
      .neq('id', imageId)

    raise(cleared.error)
  }

  const { data, error } = await getSupabase()
    .from('project_images')
    .update({
      alt_text: input.alt_text,
      caption: input.caption,
      sort_order: input.sort_order,
      is_cover: input.is_cover,
      updated_at: new Date().toISOString(),
    })
    .eq('id', imageId)
    .eq('project_id', projectId)
    .select(IMAGE_COLUMNS)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readImage(asRecord(data))
}

export async function deleteProjectImage(
  projectId: number,
  imageId: number,
): Promise<void> {
  const current = await getSupabase()
    .from('project_images')
    .select('path')
    .eq('id', imageId)
    .eq('project_id', projectId)
    .maybeSingle()

  raise(current.error)

  if (!current.data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  const { error } = await getSupabase()
    .from('project_images')
    .delete()
    .eq('id', imageId)
    .eq('project_id', projectId)

  raise(error)
  await removeStoredPaths([asString(asRecord(current.data).path)])
}

export async function getDashboard(): Promise<DashboardCounts> {
  const supabase = getSupabase()
  const [projects, published, featured, certifications] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true),
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('is_featured', true),
    supabase
      .from('certifications')
      .select('id', { count: 'exact', head: true }),
  ])

  raise(projects.error)
  raise(published.error)
  raise(featured.error)
  raise(certifications.error)

  return {
    projects: projects.count ?? 0,
    published_projects: published.count ?? 0,
    featured_projects: featured.count ?? 0,
    certifications: certifications.count ?? 0,
  }
}

async function writeProject(
  id: number,
  input: Partial<ProjectInput>,
): Promise<void> {
  const row = projectRow(input)

  if (Object.keys(row).length > 0) {
    const { error } = await getSupabase()
      .from('projects')
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq('id', id)

    raise(error)
  }

  if (input.technology_ids !== undefined) {
    await syncTechnologies(id, input.technology_ids)
  }
}

async function loadProject(id: number): Promise<Record<string, unknown>> {
  const { data, error } = await getSupabase()
    .from('projects')
    .select(ADMIN_PROJECT)
    .eq('id', id)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return asRecord(data)
}

async function syncTechnologies(
  projectId: number,
  ids: number[],
): Promise<void> {
  const deleted = await getSupabase()
    .from('project_technology')
    .delete()
    .eq('project_id', projectId)

  raise(deleted.error)

  if (ids.length === 0) {
    return
  }

  const inserted = await getSupabase()
    .from('project_technology')
    .insert(
      ids.map((technologyId) => ({
        project_id: projectId,
        technology_id: technologyId,
      })),
    )

  if (inserted.error?.code === '23503') {
    throw new FieldErrors({
      technology_ids: 'Hay una tecnología que no existe.',
    })
  }

  raise(inserted.error)
}

function projectRow(input: Partial<ProjectInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  const textKeys = [
    'title',
    'slug',
    'subtitle',
    'summary',
    'context',
    'problem',
    'solution',
    'responsibilities',
    'technical_decisions',
    'challenges',
    'results',
    'learnings',
    'role',
    'period',
  ] as const

  for (const key of textKeys) {
    if (input[key] !== undefined) {
      row[key] =
        typeof input[key] === 'string' ? input[key].trim() || null : input[key]
    }
  }

  if (typeof row.title === 'string') {
    row.title = row.title.trim()
  }

  if (typeof row.slug === 'string') {
    row.slug = row.slug.trim()
  }

  if (typeof row.summary === 'string') {
    row.summary = row.summary.trim()
  }

  for (const key of ['is_featured', 'is_published', 'sort_order'] as const) {
    if (input[key] !== undefined) {
      row[key] = input[key]
    }
  }

  return row
}

function readProjectListItem(
  row: Record<string, unknown>,
): AdminProjectListItem {
  return {
    id: asId(row.id),
    title: asString(row.title),
    slug: asString(row.slug),
    is_published: asBoolean(row.is_published),
    is_featured: asBoolean(row.is_featured),
    sort_order: asId(row.sort_order),
  }
}

function readProject(row: Record<string, unknown>): AdminProject {
  const technologies = sortTechnologies(asRecords(row.technologies))

  return {
    ...readProjectListItem(row),
    subtitle: asNullableString(row.subtitle),
    summary: asString(row.summary),
    context: asNullableString(row.context),
    problem: asNullableString(row.problem),
    solution: asNullableString(row.solution),
    responsibilities: asNullableString(row.responsibilities),
    technical_decisions: asNullableString(row.technical_decisions),
    challenges: asNullableString(row.challenges),
    results: asNullableString(row.results),
    learnings: asNullableString(row.learnings),
    role: asNullableString(row.role),
    period: asNullableString(row.period),
    technology_ids: technologies.map((technology) => technology.id),
    images: asRecords(row.project_images).map(readImage).sort(bySortThenId),
  }
}

function readImage(row: Record<string, unknown>): AdminProjectImage {
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

async function removeStoredPaths(paths: string[]): Promise<void> {
  const keys = paths.filter(
    (path) =>
      path !== '' && !path.startsWith('/') && !/^https?:\/\//.test(path),
  )

  if (keys.length === 0) {
    return
  }

  const { error } = await getSupabase()
    .storage.from(storageBucket())
    .remove(keys)

  if (error) {
    throw new ApiError('No se pudo eliminar la imagen.')
  }
}

function imageKind(file: File): { ext: string; contentType: string } {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  const contentType =
    type === 'image/jpeg' || type === 'image/png' || type === 'image/webp'
      ? type
      : name.endsWith('.png')
        ? 'image/png'
        : name.endsWith('.webp')
          ? 'image/webp'
          : name.endsWith('.jpg') || name.endsWith('.jpeg')
            ? 'image/jpeg'
            : null

  if (!contentType) {
    throw new FieldErrors({ image: 'La imagen debe ser JPG, PNG o WebP.' })
  }

  const ext =
    contentType === 'image/png'
      ? 'png'
      : contentType === 'image/webp'
        ? 'webp'
        : 'jpg'

  return { ext, contentType }
}

function formText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  return value.trim()
}

function wantsCover(value: FormDataEntryValue | null): boolean {
  return value === '1' || value === 'true' || value === 'on'
}
