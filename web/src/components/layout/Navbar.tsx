import { Briefcase, Mail, UserRound, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Monogram } from '../../assets/branding/Monogram.tsx'
import { SocialLinks } from '../content/SocialLinks.tsx'
import { profile } from '../../config/profile.ts'
import { navItems } from '../../config/site.ts'
import { cn } from '../../utils/cn.ts'
import { Container } from '../ui/Container.tsx'
import { IconButton } from '../ui/IconButton.tsx'
import { ThemeSwitch } from './ThemeSwitch.tsx'

export function Navbar() {
  const location = useLocation()
  const locationKey = `${location.pathname}${location.hash}`
  const [open, setOpen] = useState(false)
  const [trackedLocation, setTrackedLocation] = useState(locationKey)

  if (trackedLocation !== locationKey) {
    setTrackedLocation(locationKey)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            aria-label="Inicio"
            className="focus-ring inline-flex rounded-lg"
          >
            <Monogram />
          </Link>
          <nav className="hidden md:block" aria-label="Principal">
            <NavList />
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden items-center gap-4 md:flex">
              <ProfileLinks />
            </div>
            <ThemeSwitch />
            <IconButton
              className="md:hidden"
              label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="navegacion-movil"
              onClick={() => setOpen((current) => !current)}
            >
              {open ? 'Cerrar' : 'Menú'}
            </IconButton>
          </div>
        </div>
        {open ? (
          <nav
            id="navegacion-movil"
            aria-label="Principal"
            className="border-t border-border py-4 md:hidden"
          >
            <NavList stacked />
            <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
              <ProfileLinks />
            </div>
          </nav>
        ) : null}
      </Container>
    </header>
  )
}

function NavList({ stacked = false }: { stacked?: boolean }) {
  return (
    <ul className={cn('flex gap-5', stacked && 'flex-col gap-3')}>
      {navItems.map((item) => (
        <li key={item.label}>
          {item.to.includes('#') ? (
            <Link
              to={item.to}
              className="focus-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-small text-text-secondary hover:bg-surface hover:text-text-primary"
            >
              <NavIcon name={item.label} />
              {item.label}
            </Link>
          ) : (
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'focus-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-small',
                  isActive
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary',
                )
              }
            >
              <NavIcon name={item.label} />
              {item.label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  )
}

const navIcons: Record<string, LucideIcon> = {
  Work: Briefcase,
  About: UserRound,
  Engineering: Wrench,
  Contact: Mail,
}

function NavIcon({ name }: { name: string }) {
  const Icon = navIcons[name]

  if (!Icon) {
    return null
  }

  return <Icon className="size-3.5" aria-hidden="true" />
}

function ProfileLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SocialLinks size="sm" />
      {profile.cvUrl ? (
        <a
          href={profile.cvUrl}
          className="focus-ring inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface px-3 text-caption text-text-primary shadow-sm hover:bg-surface-secondary"
          target="_blank"
          rel="noreferrer"
        >
          CV
        </a>
      ) : null}
    </div>
  )
}
