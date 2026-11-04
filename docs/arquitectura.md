# Arquitectura

El navegador habla con Supabase. No pasa por Laravel.

```
React (web/)
    ↓  @supabase/supabase-js  (anon key + JWT del admin)
Supabase
    PostgreSQL   RLS: lectura pública de lo publicado, escritura solo si public.is_admin()
    Storage      bucket portfolio, lectura pública, escritura del admin
    Auth         un usuario, fila en public.admins

POST /api/contact  →  función Vercel (web/api/contact.ts)
    ↓  service role, solo en el servidor
contact_messages
```

La anon key va en `VITE_SUPABASE_ANON_KEY`. La service role key va en `SUPABASE_SERVICE_ROLE_KEY` de Vercel y no lleva prefijo `VITE_`.

`api/` es el Laravel que antes servía Railway. El frontend ya no lo llama. Se puede borrar el directorio, el servicio de Railway y las variables `VITE_API_URL` cuando el sitio en Vercel esté comprobado. Hasta entonces Railway puede seguir encendido: el rol `postgres` no queda bloqueado por RLS.

## Qué lee el sitio público

Con la sesión anónima, y además filtrando `is_published` en el cliente:

- `projects`, sus `technologies` y `project_images`
- `technologies`
- `certifications`
- tablas `demo_*` (datos ficticios)

Un proyecto no publicado no entra en la consulta pública. Si quien navega tiene sesión de admin, la consulta pública sigue pidiendo `is_published = true`, así que el portafolio no enseña borradores.

## Qué escribe el admin

La sesión de Supabase Auth autoriza, y RLS exige una fila en `public.admins`:

- proyectos, tecnologías del proyecto e imágenes (también el archivo en Storage)
- certificaciones
- estado de `contact_messages` (`new`, `read`, `archived`)

No hay registro público. El alta del admin es manual.

## Demos

Las demos leen con la anon key. Simular un envío actualiza `demo_notifications.status` y `sent_at`. Cambiar el estado de una conversación actualiza `demo_conversations.status`. No hay alta ni borrado público de esas filas. Siguen siendo datos ficticios.

## Contacto

El formulario está apagado con `VITE_CONTACT_FORM_ENABLED`. Si se enciende, el navegador hace `POST /api/contact` en el mismo origen de Vercel. La función valida, aplica el honeypot `website`, limita 5 envíos por minuto e IP e inserta con la service role. No manda correo: el aviso SMTP vivía en Laravel. El mensaje queda en `contact_messages`.

## Laravel

Rutas, modelos y migraciones de `api/` describen el esquema que ya está en Supabase. No las vuelvas a ejecutar con `migrate:fresh` contra ese proyecto. El SQL nuevo solo añade RLS, `public.admins`, el trigger de una sola portada y las políticas del bucket.
