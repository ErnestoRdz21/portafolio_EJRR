import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../services/api.ts'
import { SelectedWork } from './SelectedWork.tsx'

const getFeaturedProjects = vi.hoisted(() => vi.fn())

vi.mock('../../services/projects.ts', () => ({
  getFeaturedProjects,
}))

describe('SelectedWork', () => {
  beforeEach(() => {
    getFeaturedProjects.mockReset()
  })

  it('keeps showing a loading state while the request is pending', () => {
    getFeaturedProjects.mockReturnValue(new Promise(() => undefined))

    render(<SelectedWork />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando proyectos')
    expect(
      screen.getByRole('heading', { name: 'Proyectos destacados' }),
    ).toBeVisible()
  })

  it('shows a controlled error when the backend is unreachable', async () => {
    getFeaturedProjects.mockRejectedValue(
      new ApiError('No se pudo conectar con el backend.'),
    )

    render(<SelectedWork />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el backend.',
    )
    expect(
      screen.getByRole('heading', { name: 'Proyectos destacados' }),
    ).toBeVisible()
  })

  it('shows an empty state when there are no featured projects', async () => {
    getFeaturedProjects.mockResolvedValue([])

    render(<SelectedWork />)

    expect(
      await screen.findByText('No hay proyectos destacados'),
    ).toBeInTheDocument()
  })
})
