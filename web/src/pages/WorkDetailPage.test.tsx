import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkDetailPage } from './WorkDetailPage.tsx'

const detailRow = {
  id: 2,
  slug: 'multichannel-notifications',
  title: 'Multichannel Notification System',
  subtitle: 'Avisos por correo y WhatsApp',
  summary: 'Sistema para registrar avisos de producto.',
  context: 'El caso modela un aviso disparado por un evento.',
  problem: 'Cada canal registraba el aviso de una forma distinta.',
  solution: 'Un registro común del evento y del estado.',
  responsibilities: 'Modelo del aviso.',
  technical_decisions: 'Laravel para el registro y React para consultarlo.',
  challenges: 'Representar el canal sin un envío real.',
  results: 'El registro del aviso queda listo.',
  learnings: 'El estado existe aunque el canal todavía no envíe.',
  role: 'Full Stack Developer',
  period: null,
  technologies: [
    {
      id: 1,
      name: 'Laravel',
      slug: 'laravel',
      category: 'backend',
      sort_order: 1,
    },
  ],
  project_images: [
    {
      id: 2,
      path: 'projects/multichannel-notifications/cover.webp',
      alt_text: 'Vista general',
      caption: 'Vista general',
      sort_order: 1,
      is_cover: true,
    },
  ],
}

describe('WorkDetailPage', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'public-anon-key')
    vi.stubEnv('VITE_SUPABASE_STORAGE_BUCKET', 'portfolio')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.signal?.aborted) {
          throw new DOMException('The operation was aborted.', 'AbortError')
        }

        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url

        if (!url.includes('/rest/v1/projects')) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        }

        return new Response(JSON.stringify([detailRow]), {
          status: 200,
          headers: {
            'content-type': 'application/json',
            'content-range': '0-0/*',
          },
        })
      }),
    )
  })

  it('shows the case study when the detail row has no is_featured', async () => {
    render(
      <MemoryRouter initialEntries={['/work/multichannel-notifications']}>
        <Routes>
          <Route path="/work/:slug" element={<WorkDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Multichannel Notification System',
      }),
    ).toBeVisible()
    expect(screen.getByText('Avisos por correo y WhatsApp')).toBeVisible()
    expect(
      screen.queryByText('No se pudo cargar este proyecto.'),
    ).not.toBeInTheDocument()
    const demos = screen.getAllByRole('link', { name: 'Open Demo' })
    expect(demos.length).toBeGreaterThan(0)
    for (const link of demos) {
      expect(link).toHaveAttribute('href', '/demo/notifications')
    }
  })
})
