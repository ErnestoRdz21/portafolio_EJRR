import { Monogram } from '../../assets/branding/Monogram.tsx'
import { SocialLinks } from '../content/SocialLinks.tsx'
import { profile } from '../../config/profile.ts'
import { Container } from '../ui/Container.tsx'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram size={36} />
          <div>
            <p className="text-small text-text-primary">{profile.name}</p>
            <p className="mt-1 text-caption text-text-secondary">
              {profile.role} · Laravel, React y TypeScript
            </p>
          </div>
        </div>
        <SocialLinks size="sm" showEmail />
        <p className="font-mono text-caption text-text-muted">
          © {year} {profile.name}
        </p>
      </Container>
    </footer>
  )
}
