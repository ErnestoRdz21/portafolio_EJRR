import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContactForm } from './ContactForm.tsx'

describe('ContactForm', () => {
  it('shows validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Escribe un WhatsApp válido, con lada si estás fuera de México.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument()
    expect(
      screen.getByText(/Solo para responderte por WhatsApp/),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        'Mensaje enviado correctamente. Gracias por contactarme.',
      ),
    ).not.toBeInTheDocument()
  })

  it('rejects an invalid email', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Correo'), 'ana')
    await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero conversar.')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('El correo no es válido.')).toBeInTheDocument()
  })
})
