export const navItems = [
  { to: '/work', label: 'Work', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/#engineering', label: 'Engineering', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const

export function contactFormEnabled(): boolean {
  return import.meta.env.VITE_CONTACT_FORM_ENABLED === 'true'
}
