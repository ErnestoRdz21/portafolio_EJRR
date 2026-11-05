import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ProjectCard } from './ProjectCard.tsx'

function renderCard(coverImage: { src: string; alt: string } | null = null) {
  render(
    <MemoryRouter>
      <ProjectCard
        title="SaaS Logistics Platform"
        summary="Un panel de envíos."
        technologies={['Laravel', 'React']}
        href="/work/saas-logistics-platform"
        coverImage={coverImage}
      />
    </MemoryRouter>,
  )
}

describe('ProjectCard', () => {
  it('links to the case study and lists the stack', () => {
    renderCard()

    expect(
      screen.getByRole('link', {
        name: 'Ver proyecto SaaS Logistics Platform',
      }),
    ).toHaveAttribute('href', '/work/saas-logistics-platform')
    expect(screen.getByText('Un panel de envíos.')).toBeInTheDocument()
    expect(screen.getByText('Laravel')).toBeInTheDocument()
    expect(screen.getByTestId('project-cover')).toBeInTheDocument()
    expect(screen.queryByText('Sin imagen')).not.toBeInTheDocument()
  })

  it('renders a cover with lazy loading', () => {
    renderCard({ src: '/storage/cover.webp', alt: 'Tablero de envíos' })

    const image = screen.getByRole('img', { name: 'Tablero de envíos' })
    expect(image).toHaveAttribute('src', '/storage/cover.webp')
    expect(image).toHaveAttribute('loading', 'lazy')
  })
})
