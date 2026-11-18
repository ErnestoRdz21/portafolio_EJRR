import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const outSettings = join(root, '../../public/projects/settings-spa')
mkdirSync(outSettings, { recursive: true })

const shots = [
  {
    file: 'settings-01-perfil.html',
    out: join(outSettings, '06-perfil-demo.png'),
    cover: join(outSettings, 'cover.png'),
  },
  {
    file: 'settings-02-seguridad.html',
    out: join(outSettings, '07-seguridad-demo.png'),
  },
  {
    file: 'settings-03-direcciones.html',
    out: join(outSettings, '08-direcciones-demo.png'),
  },
]

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
})

for (const shot of shots) {
  const url = pathToFileURL(join(root, shot.file)).href
  await page.goto(url)
  const frame = page.locator('.frame, .stage').first()
  await frame.waitFor({ state: 'visible' })
  await frame.screenshot({ path: shot.out, type: 'png' })
  if (shot.cover) {
    await frame.screenshot({ path: shot.cover, type: 'png' })
  }
  console.log('captured', shot.out)
}

await browser.close()
