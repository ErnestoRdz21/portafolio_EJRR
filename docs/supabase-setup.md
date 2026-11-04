# Supabase

El proyecto ya existe. La base es la que usaba Laravel y el bucket público se llama `portfolio`. Este archivo es el ajuste para que el navegador sea el cliente.

No inventes URL ni claves en el repo. Ninguna service role va en `VITE_*`.

## 1. SQL

Ejecuta `supabase/migrations/20261104120000_rls_public_read_admin_write.sql` en el SQL Editor. El detalle y el orden respecto al deploy están en [deployment.md](deployment.md).

## 2. Claves

Project Settings → API:

- Project URL → `VITE_SUPABASE_URL` y, si el contacto se enciende, `SUPABASE_URL`
- `anon` `public` → `VITE_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` solo en Vercel

El bucket es `portfolio`. La URL pública de una imagen es:

`{VITE_SUPABASE_URL}/storage/v1/object/public/portfolio/{path}`

`path` es el valor guardado en `project_images.path`, por ejemplo `projects/customer-support-desk/cover.webp`. Un path que empieza por `/` sigue siendo un archivo del sitio y no se reescribe.

## 3. Auth

Un solo admin. Sin registro público. El usuario se crea en Authentication → Users con Auto Confirm y se inserta en `public.admins`. La contraseña hasheada de `public.users` (Laravel) no se reutiliza.

La sesión del navegador la guarda supabase-js (localStorage). Antes vivía en una cookie httpOnly de Sanctum. RLS sigue siendo quien impide escribir.

## 4. Qué no hace falta ya en Laravel

`PORTFOLIO_MEDIA_DISK`, `SUPABASE_STORAGE_KEY`, `SUPABASE_STORAGE_SECRET` y `SUPABASE_SERVICE_ROLE_KEY` del `.env` de `api/` solo servían para que Laravel subiera archivos y leyera la base. El admin nuevo sube con la sesión y las políticas de Storage.

No corras `php artisan migrate:fresh` contra este proyecto.
