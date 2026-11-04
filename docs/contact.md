# Contacto

El formulario público está apagado (`VITE_CONTACT_FORM_ENABLED` distinto de `true`). `/contact` muestra el aviso y el enlace de LinkedIn. No hace POST.

Si se vuelve a encender, el navegador envía `POST /api/contact` a la función de Vercel (`web/api/contact.ts`).

## Flujo

1. La función valida. Si falla, responde 422 y no guarda nada.
2. Si `website` trae texto, responde 201 y no guarda nada.
3. Como máximo 5 inserciones por minuto para la misma IP (`x-forwarded-for`). El sexto responde 429.
4. Inserta en `contact_messages` con la service role (`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`). El cliente no puede elegir `status`, `ip_address` ni `user_agent`.
5. Responde 201: `{ "message": "Mensaje recibido correctamente." }`.

La anon key no tiene `insert` en `contact_messages`. Sin las variables de servidor la función responde 503.

## Campos

| Campo | Regla |
|---|---|
| `name` | Obligatorio, texto, máximo 120, sin HTML |
| `email` | Obligatorio, correo, máximo 180 |
| `subject` | Opcional, texto, máximo 160, sin HTML |
| `message` | Obligatorio, texto, entre 10 y 5000 caracteres, sin HTML |

## Correo

Laravel enviaba el aviso con `SendContactNotification` y `PORTFOLIO_CONTACT_EMAIL`. Esa cola se va con Railway. La función de Vercel no manda email: el mensaje queda en el admin (`/admin/messages`). Hace falta otro proveedor si el aviso por correo vuelve a ser necesario.

`npm run dev` no ejecuta `web/api`. El POST del formulario solo está en un deploy de Vercel.

## Admin

`/admin/messages` lista nombre, correo, asunto, estado y fecha. Al abrir uno se ve el texto, sin HTML.

Estados: `new`, `read`, `archived`. No se responde desde el portafolio y no hay borrado. La lectura y el cambio de estado exigen sesión de admin.
