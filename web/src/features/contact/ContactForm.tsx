import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Field } from '../admin/fields.tsx'
import { adminField } from '../admin/form.ts'
import { ApiError } from '../../services/api.ts'
import { sendContact } from '../../services/contact.ts'
import { FieldErrors } from '../../services/admin/http.ts'

type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  website: string
}

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (pending) {
      return
    }

    const nextErrors = validate(form)
    setErrors(nextErrors)
    setFormError('')
    setSuccess('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setPending(true)

    try {
      await sendContact(form)
      setForm(emptyForm)
      setSuccess('Mensaje enviado correctamente. Gracias por contactarme.')
    } catch (caught) {
      if (caught instanceof FieldErrors) {
        setErrors(caught.fields)
        setFormError(caught.message)
      } else if (caught instanceof ApiError) {
        setFormError(caught.message)
      } else {
        setFormError('No se pudo enviar el mensaje. Inténtalo de nuevo.')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      className="mt-4 max-w-xl space-y-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6"
      noValidate
      onSubmit={(event) => void onSubmit(event)}
    >
      <Field
        label="Nombre"
        htmlFor="contact-name"
        error={errors.name}
        errorId="contact-name-error"
      >
        <input
          id="contact-name"
          className={adminField}
          autoComplete="name"
          value={form.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          onChange={(event) => update('name', event.target.value)}
        />
      </Field>
      <Field
        label="Correo"
        htmlFor="contact-email"
        error={errors.email}
        errorId="contact-email-error"
      >
        <input
          id="contact-email"
          className={adminField}
          type="email"
          autoComplete="email"
          value={form.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          onChange={(event) => update('email', event.target.value)}
        />
      </Field>
      <Field
        label="WhatsApp"
        htmlFor="contact-phone"
        error={errors.phone}
        errorId="contact-phone-error"
      >
        <input
          id="contact-phone"
          className={adminField}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="81 1234 5678"
          value={form.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={
            errors.phone
              ? 'contact-phone-error contact-phone-hint'
              : 'contact-phone-hint'
          }
          onChange={(event) => update('phone', event.target.value)}
        />
        <p
          id="contact-phone-hint"
          className="mt-1.5 text-caption text-text-muted"
        >
          Solo para responderte por WhatsApp. No lo comparto, no lo uso para
          promociones y no se lo paso a nadie.
        </p>
      </Field>
      <Field
        label="Asunto"
        htmlFor="contact-subject"
        error={errors.subject}
        errorId="contact-subject-error"
      >
        <input
          id="contact-subject"
          className={adminField}
          value={form.subject}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={
            errors.subject ? 'contact-subject-error' : undefined
          }
          onChange={(event) => update('subject', event.target.value)}
        />
      </Field>
      <Field
        label="Mensaje"
        htmlFor="contact-message"
        error={errors.message}
        errorId="contact-message-error"
      >
        <textarea
          id="contact-message"
          className={adminField}
          rows={6}
          value={form.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? 'contact-message-error' : undefined
          }
          onChange={(event) => update('message', event.target.value)}
        />
      </Field>
      <div
        className="absolute -left-[9999px] h-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>
      {success ? (
        <p className="text-small text-success" role="status">
          {success}
        </p>
      ) : null}
      {formError ? (
        <p className="text-small text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? 'Enviando…' : 'Enviar mensaje'}
      </Button>
    </form>
  )
}

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {}

  if (form.name.trim() === '') {
    errors.name = 'El nombre es obligatorio.'
  }

  if (form.email.trim() === '') {
    errors.email = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'El correo no es válido.'
  }

  const digits = form.phone.replace(/\D/g, '')

  if (digits.length < 10 || digits.length > 15) {
    errors.phone =
      'Escribe un WhatsApp válido, con lada si estás fuera de México.'
  }

  if (form.message.trim() === '') {
    errors.message = 'El mensaje es obligatorio.'
  }

  return errors
}
