import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../services/api.ts'
import { CertificationsSection } from './CertificationsSection.tsx'

const getCertifications = vi.hoisted(() => vi.fn())

vi.mock('../../services/certifications.ts', () => ({
  getCertifications,
}))

describe('CertificationsSection', () => {
  beforeEach(() => {
    getCertifications.mockReset()
  })

  it('shows a controlled error when the backend is unreachable', async () => {
    getCertifications.mockRejectedValue(
      new ApiError('No se pudo conectar con el backend.'),
    )

    render(<CertificationsSection />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el backend.',
    )
    expect(
      screen.getByRole('heading', { name: 'Certificaciones' }),
    ).toBeVisible()
  })
})
