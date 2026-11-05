import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './api.ts'
import { sendContact } from './contact.ts'

const input = {
  name: 'Ana Pérez',
  email: 'ana@example.test',
  phone: '81 1234 5678',
  subject: 'Hola',
  message: 'Quiero platicar del portafolio.',
  website: '',
}

describe('sendContact', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'test-access-key')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('posts to Web3Forms with replyto and botcheck false', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    )

    await sendContact(input)

    expect(fetch).toHaveBeenCalledWith(
      'https://api.web3forms.com/submit',
      expect.objectContaining({ method: 'POST' }),
    )

    const body = JSON.parse(
      String(vi.mocked(fetch).mock.calls[0]?.[1]?.body),
    ) as Record<string, string>

    expect(body.access_key).toBe('test-access-key')
    expect(body.subject).toBe('Portafolio · Ana Pérez — Hola')
    expect(body.from_name).toBe('Ernesto Rodríguez — Portafolio')
    expect(body.replyto).toBe('ana@example.test')
    expect(body.WhatsApp).toBe('81 1234 5678 · https://wa.me/528112345678')
    expect(body.message).toBe('Quiero platicar del portafolio.')
    expect(body.botcheck).toBe(false)
  })

  it('uses the default subject when empty', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    )

    await sendContact({ ...input, subject: '   ' })

    const body = JSON.parse(
      String(vi.mocked(fetch).mock.calls[0]?.[1]?.body),
    ) as { subject: string }
    expect(body.subject).toBe('Portafolio · Ana Pérez — Nuevo mensaje')
  })

  it('silently succeeds for honeypot bots without calling the API', async () => {
    await sendContact({ ...input, website: 'https://spam.test' })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('throws when the access key is missing', async () => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '')

    await expect(sendContact(input)).rejects.toBeInstanceOf(ApiError)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('throws when Web3Forms reports failure', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: 'Invalid key' }), {
        status: 200,
      }),
    )

    await expect(sendContact(input)).rejects.toMatchObject({
      message: 'Invalid key',
    })
  })
})
