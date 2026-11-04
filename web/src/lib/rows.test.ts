import { describe, expect, it } from 'vitest'
import { asDateOnly, asTimestamp, pickCover, storagePublicUrl } from './rows.ts'

describe('storagePublicUrl', () => {
  it('builds a public object url and leaves absolute or site paths alone', () => {
    expect(
      storagePublicUrl(
        'projects/desk/cover.webp',
        'https://demo.supabase.co/',
        'portfolio',
      ),
    ).toBe(
      'https://demo.supabase.co/storage/v1/object/public/portfolio/projects/desk/cover.webp',
    )
    expect(
      storagePublicUrl(
        'https://cdn.example/a.png',
        'https://demo.supabase.co',
        'portfolio',
      ),
    ).toBe('https://cdn.example/a.png')
    expect(
      storagePublicUrl(
        '/covers/local.png',
        'https://demo.supabase.co',
        'portfolio',
      ),
    ).toBeNull()
    expect(
      storagePublicUrl(null, 'https://demo.supabase.co', 'portfolio'),
    ).toBeNull()
  })
})

describe('pickCover', () => {
  it('prefers the cover and otherwise the first ordered image', () => {
    const images = [
      { id: 2, is_cover: false },
      { id: 1, is_cover: true },
    ]

    expect(pickCover(images)?.id).toBe(1)
    expect(pickCover([{ id: 4, is_cover: false }])?.id).toBe(4)
    expect(pickCover([])).toBeNull()
  })
})

describe('dates from Postgres', () => {
  it('keeps a calendar date and marks a naive timestamp as UTC', () => {
    expect(asDateOnly('2024-05-01')).toBe('2024-05-01')
    expect(asDateOnly('2024-05-01T00:00:00')).toBe('2024-05-01')
    expect(asDateOnly(null)).toBeNull()
    expect(asTimestamp('2026-11-04 21:56:00')).toBe('2026-11-04T21:56:00Z')
    expect(asTimestamp('2026-11-04T21:56:00+00:00')).toBe(
      '2026-11-04T21:56:00+00:00',
    )
    expect(asTimestamp(null)).toBeNull()
  })
})
