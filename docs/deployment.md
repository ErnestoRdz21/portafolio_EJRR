# Deployment

El sitio corre en Vercel. Los datos están en Supabase. Railway deja de hacer falta cuando este corte está verificado.

El directorio raíz del proyecto en Vercel tiene que ser `web`. Ahí están el build de Vite, `vercel.json` y `api/contact.ts`.

## 1. SQL en Supabase

En el SQL Editor, pega y ejecuta:

`supabase/migrations/20261104120000_rls_public_read_admin_write.sql`

Hazlo **antes** de publicar el frontend con la anon key. El script:

- activa RLS en las tablas `public`
- quita privilegios de `anon` y `authenticated` y los vuelve a dar solo donde toca
- deja `users`, `sessions`, `password_reset_tokens`, `jobs` y `cache` sin acceso para la anon key
- crea `public.admins` y `public.is_admin()`
- deja el bucket `portfolio` público, con tope de 5 MB y MIME jpeg, png y webp

Laravel en Railway usa el rol `postgres`, que no pasa por RLS. Puede seguir sirviendo hasta que apagues el servicio. No corras `migrate:fresh`, `migrate:refresh`, `migrate:reset` ni `db:wipe` contra Supabase.

Comprueba con la anon key (Table Editor no vale: usa la API o el cliente):

- `projects` devuelve solo filas con `is_published = true`
- `users` no devuelve filas (permiso denegado o vacío)

## 2. Usuario admin

1. Authentication → Providers → Email: desactiva los registros públicos. El panel no tiene alta de cuentas.
2. Authentication → Users → Add user. Marca **Auto Confirm**. Anota el correo y la contraseña fuera del repo. Si el usuario queda sin confirmar, el login responde que hay que confirmarlo.
3. En el SQL Editor, con tu correo:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'tu-correo'
on conflict (user_id) do nothing;
```

Esa fila es la que autoriza escrituras. Un usuario de Auth que no esté en `public.admins` entra y, al comprobar la fila, la sesión se cierra.

La contraseña de Laravel (`users.password`) no sirve aquí. Supabase Auth es otra tabla (`auth.users`).

## 3. Variables en Vercel

En el proyecto de Vercel, entorno Production (y Preview si quieres probar el admin ahí):

| Variable | Dónde se usa | Valor |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | navegador | Project URL, `https://<ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | navegador | anon public key |
| `VITE_SUPABASE_STORAGE_BUCKET` | navegador | `portfolio` |
| `VITE_SITE_URL` | build | `https://portafolio-ejrr.vercel.app` si quieres canonical y sitemap |
| `VITE_CONTACT_FORM_ENABLED` | navegador | vacío, o `true` solo cuando el contacto deba volver |
| `SUPABASE_URL` | función `/api/contact` | la misma Project URL, **sin** prefijo `VITE_` |
| `SUPABASE_SERVICE_ROLE_KEY` | función `/api/contact` | service role. No hace falta mientras el formulario siga apagado |

No subas la service role ni la contraseña de Postgres a una variable `VITE_`. Quita `VITE_API_URL` cuando el despliegue nuevo esté bien: ya no se lee.

Vuelve a desplegar después de cambiar variables `VITE_`: Vite las incrusta en el build.

`web/vercel.json` reescribe las rutas de la SPA a `index.html` y deja `/api/*` para la función.

## 4. Probar

1. Abre `/`, `/work` y un case study publicado. Las imágenes salen de `.../storage/v1/object/public/portfolio/...`.
2. Abre una demo de soporte, logística y notificaciones. Simular un envío marca `sent`.
3. Entra en `/admin/login` con el usuario nuevo. Dashboard, un cambio de publicación, una imagen jpeg o webp de menos de 5 MB, una certificación.
4. Cierra sesión y recarga `/admin`: debe volver al login.
5. Confirma que un proyecto no publicado no aparece en `/work`.

## 5. Apagar Railway

Hazlo cuando los pasos anteriores pasen en el dominio de Vercel, no antes.

1. Borra el servicio de Laravel en Railway (o déjalo pausado un día si quieres un margen).
2. Quita `VITE_API_URL` y cualquier secreto de Laravel que solo usara ese servicio.
3. El directorio `api/` se puede borrar en un cambio posterior: rutas Sanctum, controladores, jobs de correo y el comando `portfolio:create-admin`. No lo borres en el mismo momento del corte.
4. La contraseña de la base que estaba en Railway sigue siendo la de Supabase. Rótala en Supabase si ese entorno de Railway ya no es de confianza, y no la pongas en Vercel: el navegador no la usa.

## Correo de contacto

Laravel encolaba `SendContactNotification`. La función de Vercel solo guarda el mensaje. El formulario sigue apagado. Encenderlo sin un proveedor de correo guarda el texto en el admin y no avisa por email. El límite es 5 POST por minuto e IP. El campo `website` sigue siendo el honeypot: si viene con texto, la función responde 201 y no inserta.

`npm run dev` no levanta `/api/contact`. Esa ruta existe en Vercel. En local, el resto del sitio habla directo con Supabase.
