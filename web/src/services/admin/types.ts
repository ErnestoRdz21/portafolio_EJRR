export type AdminUser = {
  id: string
  name: string
  email: string
}

export type AdminProjectListItem = {
  id: number
  title: string
  slug: string
  is_published: boolean
  is_featured: boolean
  sort_order: number
}

export type AdminProjectImage = {
  id: number
  path: string
  url: string | null
  alt_text: string | null
  caption: string | null
  sort_order: number
  is_cover: boolean
}

export type AdminProject = {
  id: number
  slug: string
  title: string
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
  images: AdminProjectImage[]
}

export type AdminCertification = {
  id: number
  name: string
  issuer: string | null
  issued_at: string | null
  credential_url: string | null
  image_path: string | null
  sort_order: number
  is_published: boolean
}

export type MessageStatus = 'new' | 'read' | 'archived'

export type AdminMessageSummary = {
  id: number
  name: string
  email: string
  subject: string | null
  status: MessageStatus
  created_at: string | null
}

export type AdminMessageDetail = AdminMessageSummary & {
  message: string
}

export type DashboardCounts = {
  projects: number
  published_projects: number
  featured_projects: number
  certifications: number
}
