import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const publicPaths = [
  '/',
  '/work',
  '/about',
  '/contact',
  '/work/multichannel-notifications',
  '/work/white-label-tracking',
  '/work/customer-support-desk',
  '/work/settings-spa-modernization',
]

function sitemapPlugin(siteUrl: string | undefined): Plugin {
  return {
    name: 'portfolio-sitemap',
    apply: 'build',
    closeBundle() {
      const site = siteUrl?.trim().replace(/\/$/, '')

      if (!site || !/^https?:\/\//.test(site)) {
        return
      }

      const urls = publicPaths
        .map((path) => `  <url><loc>${site}${path}</loc></url>`)
        .join('\n')

      writeFileSync(
        'dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), sitemapPlugin(env.VITE_SITE_URL)],
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    },
  }
})
