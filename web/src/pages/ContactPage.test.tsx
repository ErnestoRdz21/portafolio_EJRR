import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactPage } from './ContactPage.tsx'

describe('ContactPage', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('shows the unavailable notice instead of the form', () => {
    vi.stubEnv('VITE_CONTACT_FORM_ENABLED', '')
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(
        'Contacto temporalmente no disponible. Puedes contactarme por LinkedIn.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Mensaje')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Enviar mensaje' }),
    ).not.toBeInTheDocument()
  })
})
