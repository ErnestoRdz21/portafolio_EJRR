# Ernesto Rodríguez — Portfolio

Portafolio de Ernesto Jahir Rodríguez Ramírez, Full Stack Developer. Una SPA en React que lee y escribe Supabase (PostgreSQL, Storage y Auth). El hosting del sitio es Vercel.

**Live Portfolio:** [portafolio-ejrr.vercel.app](https://portafolio-ejrr.vercel.app)

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, en Vercel
- **Datos:** Supabase PostgreSQL, con RLS
- **Auth del admin:** Supabase Auth
- **Imágenes:** Supabase Storage, bucket `portfolio`
- **Contacto:** función serverless en `web/api/contact.ts` (solo si se vuelve a encender el formulario)
- **API Laravel:** queda en `api/` hasta apagar Railway. El navegador ya no la usa.

## Arquitectura

```
portfolio/
  web/        React + funciones /api de Vercel
  supabase/   SQL de RLS para correr en el SQL Editor
  api/        Laravel (legado, no lo llama el frontend)
  docs/       Documentación
```

El navegador usa `@supabase/supabase-js` con la anon key. La anon key solo puede lo que permiten las políticas. La service role key no entra al build: vive solo en Vercel, para `POST /api/contact`.

## Funcionalidades

- Portafolio público: Home, Work y About.
- Case studies de proyectos con galería de capturas.
- Mini demos interactivas con datos ficticios.
- Panel de administración: proyectos, imágenes, certificaciones y mensajes.
- Imágenes servidas desde Supabase Storage.
- Modo oscuro y diseño responsive.

## Deployment

| Capa | Servicio |
| --- | --- |
| Frontend y `/api/contact` | Vercel |
| Base de datos | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| Backend Laravel | Railway, apagarlo después del corte |

El corte está en [docs/deployment.md](docs/deployment.md). El SQL está en [supabase/migrations/20261104120000_rls_public_read_admin_write.sql](supabase/migrations/20261104120000_rls_public_read_admin_write.sql).

## Desarrollo local

Requisitos: Node.js 22+ y npm. PHP solo hace falta si vas a tocar el Laravel que queda en el repo.

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `web/.env`. Sin eso, las pantallas que leen datos muestran el error de configuración.

Pruebas: `npm run test` y `npm run build` en `web/`.

Más detalle en [docs/](docs/): [arquitectura](docs/arquitectura.md), [deployment](docs/deployment.md), [admin](docs/admin.md), [supabase](docs/supabase-setup.md), [case studies](docs/case-studies.md) y [demos](docs/demos.md).

## Autor

**Ernesto Jahir Rodríguez Ramírez**\
Full Stack Developer\
[portafolio-ejrr.vercel.app](https://portafolio-ejrr.vercel.app)
