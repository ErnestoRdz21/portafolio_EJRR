# Mini demos

Cinco pruebas cortas. El case study cuenta la decisión. La demo enseña un recorte funcional. El enlace sale de `web/src/features/demos/catalog.ts`, un solo mapa entre proyecto y ruta.

Las cuatro demos que antes llamaban a Laravel leen las mismas tablas `demo_*` con la anon key. Simular una notificación y cambiar el estado de una conversación siguen siendo updates públicos y acotados por RLS. Tracking y la comparación legacy no tocan la base.

Los datos son ficticios. No hay clientes, transportistas, mensajes ni entregas reales.

## Rutas

| Ruta | Proyecto | Qué demuestra | Qué es funcional | Qué está simulado |
|---|---|---|---|---|
| `/demo/logistics` | `saas-logistics-platform` | React, TypeScript, filtros y conteos | `demo_shipments` con `status`, `carrier` y `search` | No hay mapas, gráficas ni edición |
| `/demo/notifications` | `multichannel-notifications` | Reglas de estado sobre un registro | lectura de `demo_notifications` y update a `sent` | No hay Job, cola, correo ni WhatsApp. Simulate solo marca `sent` y `sent_at` |
| `/demo/tracking` | `white-label-tracking` | Una vista y configuración visual | Selector de marca y de estado en el cliente | No hay API de rastreo. La guía `ABC123456` es fija |
| `/demo/support` | `customer-support-desk` | Lista, hilo y estado | `demo_conversations`, sus mensajes y el `status` | No hay tiempo real, notas ni varios agentes |
| `/demo/legacy` | `legacy-modernization` | La misma información en dos presentaciones | Filtros locales y el cambio Legacy / Modern | No hay backend. La vista anterior es una comparación, no una página Blade real |

## Decisiones

Las demos no cambian proyectos ni certificaciones. El envío simulado es un update directo: un Job no aportaba nada sin un worker. Tracking y la comparación legacy no llaman a la base porque su punto es la interfaz.

Los conteos de logística salen del resultado filtrado. Una ruta de Storage o un estado desconocido no se inventan en la UI: el estado se lee y se etiqueta en texto, no solo con color.
