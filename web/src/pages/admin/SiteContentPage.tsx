import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Field } from '../../features/admin/fields.tsx'
import { adminField, emptyToNull } from '../../features/admin/form.ts'
import { useAuth } from '../../features/admin/useAuth.ts'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { ApiError } from '../../services/api.ts'
import { FieldErrors } from '../../services/admin/http.ts'
import {
  getAdminSiteContent,
  saveAdminSiteContent,
  seedSiteContentInput,
  type SiteContentInput,
} from '../../services/admin/siteContent.ts'
import type { SiteContent } from '../../services/siteContent.ts'

function toDraft(content: SiteContent): SiteContentInput {
  const seeded = seedSiteContentInput()
  const experience =
    content.experience.length > 0
      ? content.experience
      : JSON.parse(seeded.experience_json)
  const education =
    content.education.length > 0
      ? content.education
      : JSON.parse(seeded.education_json)

  return {
    hero_eyebrow: content.hero_eyebrow ?? seeded.hero_eyebrow,
    hero_body: content.hero_body ?? seeded.hero_body,
    hero_body_secondary:
      content.hero_body_secondary ?? seeded.hero_body_secondary,
    about_title: content.about_title ?? seeded.about_title,
    about_description: content.about_description ?? seeded.about_description,
    about_paragraphs:
      content.about_paragraphs.length > 0
        ? content.about_paragraphs
        : seeded.about_paragraphs,
    work_description: content.work_description ?? seeded.work_description,
    contact_description:
      content.contact_description ?? seeded.contact_description,
    experience_json: JSON.stringify(experience, null, 2),
    education_json: JSON.stringify(education, null, 2),
  }
}

export function SiteContentPage() {
  const { clear } = useAuth()
  const load = useCallback((signal: AbortSignal) => {
    signal.throwIfAborted()
    return getAdminSiteContent()
  }, [])
  const { state, retry } = useRemoteData(load)
  const [draft, setDraft] = useState<SiteContentInput | null>(null)
  const [aboutText, setAboutText] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Contenido del sitio — Admin'
  }, [])

  if (state.status === 'ok' && draft === null) {
    const next = toDraft(state.data)
    setDraft(next)
    setAboutText(next.about_paragraphs.join('\n\n'))
  }

  if (state.status === 'loading' || draft === null) {
    return <LoadingState label="Cargando contenido" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!draft) {
      return
    }

    const current = draft
    setFields({})
    setNotice('')
    setError('')

    try {
      const paragraphs = aboutText
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean)

      const saved = await saveAdminSiteContent({
        experience_json: current.experience_json,
        education_json: current.education_json,
        hero_eyebrow: emptyToNull(current.hero_eyebrow ?? ''),
        hero_body: emptyToNull(current.hero_body ?? ''),
        hero_body_secondary: emptyToNull(current.hero_body_secondary ?? ''),
        about_title: emptyToNull(current.about_title ?? ''),
        about_description: emptyToNull(current.about_description ?? ''),
        about_paragraphs: paragraphs,
        work_description: emptyToNull(current.work_description ?? ''),
        contact_description: emptyToNull(current.contact_description ?? ''),
      })
      const next = toDraft(saved)
      setDraft(next)
      setAboutText(next.about_paragraphs.join('\n\n'))
      setNotice('Contenido guardado. Ya se refleja en el sitio público.')
    } catch (caught) {
      if (caught instanceof FieldErrors) {
        setFields(caught.fields)
        setError(caught.message)
      } else if (caught instanceof ApiError && caught.status === 401) {
        clear()
      } else {
        setError(
          caught instanceof ApiError ? caught.message : 'No se pudo guardar.',
        )
      }
    }
  }

  function loadDefaults() {
    const seeded = seedSiteContentInput()
    setDraft(seeded)
    setAboutText(seeded.about_paragraphs.join('\n\n'))
    setNotice('Se cargaron los textos por defecto. Guarda para aplicarlos.')
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-h2">Contenido del sitio</h1>
      <p className="mt-2 text-body text-text-secondary">
        Textos del Home, About, experiencia y educación. Los case studies se
        editan en Proyectos; las fotos de cursos, en Certificaciones.
      </p>
      {notice ? (
        <p className="mt-4 text-small text-success" role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <form
        className="mt-6 space-y-6"
        onSubmit={(event) => void onSubmit(event)}
      >
        <section className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-h3">Hero</h2>
          <Field label="Eyebrow" htmlFor="hero-eyebrow">
            <input
              id="hero-eyebrow"
              className={adminField}
              value={draft.hero_eyebrow ?? ''}
              onChange={(event) =>
                setDraft({ ...draft, hero_eyebrow: event.target.value })
              }
            />
          </Field>
          <Field label="Párrafo principal" htmlFor="hero-body">
            <textarea
              id="hero-body"
              className={adminField}
              rows={5}
              value={draft.hero_body ?? ''}
              onChange={(event) =>
                setDraft({ ...draft, hero_body: event.target.value })
              }
            />
          </Field>
          <Field label="Párrafo secundario" htmlFor="hero-body-2">
            <textarea
              id="hero-body-2"
              className={adminField}
              rows={4}
              value={draft.hero_body_secondary ?? ''}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  hero_body_secondary: event.target.value,
                })
              }
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-h3">Acerca de</h2>
          <Field label="Título" htmlFor="about-title">
            <input
              id="about-title"
              className={adminField}
              value={draft.about_title ?? ''}
              onChange={(event) =>
                setDraft({ ...draft, about_title: event.target.value })
              }
            />
          </Field>
          <Field label="Descripción corta" htmlFor="about-description">
            <textarea
              id="about-description"
              className={adminField}
              rows={2}
              value={draft.about_description ?? ''}
              onChange={(event) =>
                setDraft({ ...draft, about_description: event.target.value })
              }
            />
          </Field>
          <Field
            label="Párrafos (separados por una línea en blanco)"
            htmlFor="about-paragraphs"
          >
            <textarea
              id="about-paragraphs"
              className={adminField}
              rows={10}
              value={aboutText}
              onChange={(event) => setAboutText(event.target.value)}
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-h3">Otras secciones</h2>
          <Field
            label="Descripción de proyectos destacados"
            htmlFor="work-desc"
          >
            <textarea
              id="work-desc"
              className={adminField}
              rows={3}
              value={draft.work_description ?? ''}
              onChange={(event) =>
                setDraft({ ...draft, work_description: event.target.value })
              }
            />
          </Field>
          <Field label="Texto del CTA de contacto" htmlFor="contact-desc">
            <textarea
              id="contact-desc"
              className={adminField}
              rows={3}
              value={draft.contact_description ?? ''}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  contact_description: event.target.value,
                })
              }
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-h3">Experiencia y educación (JSON)</h2>
          <p className="text-caption text-text-muted">
            Arreglo de objetos. Experiencia: company, title, period, bullets[].
            Educación: school, program, period.
          </p>
          <Field
            label="Experiencia"
            htmlFor="experience-json"
            error={fields.experience_json}
          >
            <textarea
              id="experience-json"
              className={`${adminField} font-mono text-caption`}
              rows={14}
              value={draft.experience_json}
              onChange={(event) =>
                setDraft({ ...draft, experience_json: event.target.value })
              }
            />
          </Field>
          <Field
            label="Educación"
            htmlFor="education-json"
            error={fields.education_json}
          >
            <textarea
              id="education-json"
              className={`${adminField} font-mono text-caption`}
              rows={8}
              value={draft.education_json}
              onChange={(event) =>
                setDraft({ ...draft, education_json: event.target.value })
              }
            />
          </Field>
        </section>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">Guardar contenido</Button>
          <Button type="button" variant="secondary" onClick={loadDefaults}>
            Cargar textos por defecto
          </Button>
        </div>
      </form>
    </div>
  )
}
