# Administrador

Un solo administrador. No hay registro público ni roles. La cuenta vive en Supabase Auth y su `id` está en `public.admins`.

## Autenticación

`/admin/login` llama a `signInWithPassword`. Si el correo no está en `public.admins`, el cliente cierra la sesión y muestra que la cuenta no es administradora.

La sesión persiste en el navegador. Al recargar, el panel lee `auth.getSession()` y comprueba la fila de `admins`. Sin sesión, el resto de `/admin` vuelve a `/admin/login`.

No hay cookie de Sanctum ni `GET /sanctum/csrf-cookie`. Esas rutas eran de Laravel.

## Crear el administrador

En el dashboard de Supabase, Authentication → Users → Add user, con Auto Confirm. Luego:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'tu-correo'
on conflict (user_id) do nothing;
```

Desactiva el registro público en el proveedor Email. `php artisan portfolio:create-admin` solo crea un usuario de Laravel; el panel nuevo no lo usa.

El nombre que se guarda en el cliente sale de `user_metadata.name` o `full_name`. Si no hay, usa el correo. La pantalla de login no lo muestra.

## Rutas del frontend

| Ruta | Acceso |
|---|---|
| `/admin/login` | Pública |
| `/admin` | Sesión de admin |
| `/admin/projects` | Sesión de admin |
| `/admin/projects/new` | Sesión de admin |
| `/admin/projects/:id` | Sesión de admin |
| `/admin/certifications` | Sesión de admin |
| `/admin/messages` | Sesión de admin |

## Datos

El panel usa el cliente de Supabase, no `/api/admin`. RLS rechaza a quien no esté en `public.admins`.

- Proyectos: listar, ver, crear, actualizar, eliminar. Borrar un proyecto borra la fila (cascade de imágenes y tecnologías) y los objetos del bucket cuyo `path` no sea una URL ni un path del sitio.
- Imágenes: jpeg, png o webp, máximo 5 MB. El cliente valida el tipo y el tamaño; el bucket repite el límite. Solo una imagen por proyecto queda como portada.
- Certificaciones: listar, crear, actualizar, eliminar.
- Mensajes: listar, ver y cambiar `status` a `new`, `read` o `archived`. No se borra el mensaje.

Los errores de validación siguen mostrándose junto al campo. Eliminar un proyecto pide confirmación. Lo habitual es despublicar.

## Imágenes

La subida escribe en el bucket `portfolio` con la sesión del admin y guarda `project_images.path`. `url` se arma en el cliente con la URL pública del bucket. Si el path empieza por `/` o el archivo no está, la ficha sigue mostrando el placeholder.
