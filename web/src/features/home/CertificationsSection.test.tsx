import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  CertificationsSection,
  CertificationsSkeleton,
} from './CertificationsSection.tsx'

describe('CertificationsSection', () => {
  it('renders the certifications from the profile', () => {
    render(<CertificationsSection />)

    expect(
      screen.getByRole('heading', { name: 'Certificaciones' }),
    ).toBeVisible()
    expect(screen.getByText('AI-powered QA')).toBeVisible()
    expect(screen.getByText('React para principiantes')).toBeVisible()
    expect(
      screen.getByText('Usa Laravel para consumir APIs y servicios HTTP'),
    ).toBeVisible()
    expect(screen.getByText('Laravel de alto nivel')).toBeVisible()
    expect(screen.getByText('Octubre 2026')).toBeVisible()
    expect(screen.getByText('9 h')).toBeVisible()
    expect(screen.getAllByText('Udemy')).toHaveLength(4)
    expect(
      screen.queryByText('No hay certificaciones publicadas'),
    ).not.toBeInTheDocument()
  })

  it('exposes a skeleton loading state', () => {
    render(<CertificationsSkeleton />)

    expect(
      screen.getByRole('status', { name: 'Cargando certificaciones' }),
    ).toBeInTheDocument()
  })
})
