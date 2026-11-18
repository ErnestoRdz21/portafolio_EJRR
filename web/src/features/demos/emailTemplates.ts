export type EmailTemplate = {
  id: string
  name: string
  purpose: string
  subject: string
  html: string
}

const shell = (body: string, accent: string, brand: string) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${brand}</title>
</head>
<body style="margin:0;padding:0;background:#f3f1ec;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f1ec;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e2d9;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #e7e2d9;">
              <span style="display:inline-block;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">${brand}</span>
              <div style="margin-top:8px;height:3px;width:48px;background:${accent};border-radius:999px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#faf8f5;border-top:1px solid #e7e2d9;font-size:12px;color:#78716c;">
              Correo de demostración anonimizado. Sin datos de clientes reales.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'shipment-update',
    name: 'Actualización de envío',
    purpose: 'Aviso transaccional cuando cambia el estado de una guía.',
    subject: 'Tu envío GO-4821 va en tránsito',
    html: shell(
      `
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;">Hola Cliente Demo, tu envío va en tránsito</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#44403c;">
          El paquete <strong>ABC123456789</strong> ya salió del centro de distribución.
          Puedes seguir el recorrido con el botón de abajo.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;background:#faf8f5;border:1px solid #e7e2d9;border-radius:10px;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#57534e;">
              <div><strong style="color:#1c1917;">Estado</strong> · En tránsito</div>
              <div style="margin-top:6px;"><strong style="color:#1c1917;">Carrier</strong> · Carrier Demo</div>
              <div style="margin-top:6px;"><strong style="color:#1c1917;">Origen</strong> · CDMX Demo</div>
              <div style="margin-top:6px;"><strong style="color:#1c1917;">Destino</strong> · MTY Demo</div>
            </td>
          </tr>
        </table>
        <a href="#" style="display:inline-block;background:#1f6f5b;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">Ver rastreo</a>
      `,
      '#1f6f5b',
      'Envíos Demo',
    ),
  },
  {
    id: 'quota-warning',
    name: 'Aviso de cupo',
    purpose: 'Recordatorio de producto cuando el plan se acerca al límite.',
    subject: 'Cliente Demo · has usado el 85% de tus notificaciones',
    html: shell(
      `
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;">Cupo casi lleno</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#44403c;">
          Hola <strong>Cliente Demo</strong>, este mes llevas <strong>850 / 1 000</strong>
          notificaciones del plan Growth (números de ejemplo).
          Si llegas al tope, los envíos se pausan hasta el siguiente ciclo o un upgrade.
        </p>
        <div style="height:10px;background:#e7e2d9;border-radius:999px;overflow:hidden;margin:0 0 18px;">
          <div style="width:85%;height:100%;background:#b45309;"></div>
        </div>
        <a href="#" style="display:inline-block;background:#b45309;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">Revisar plan</a>
      `,
      '#b45309',
      'Avisos Demo',
    ),
  },
  {
    id: 'branded-tracking',
    name: 'Rastreo con marca',
    purpose: 'Plantilla white-label: mismos bloques, acento y copy de la marca.',
    subject: 'Northstar · actualización de tu guía',
    html: shell(
      `
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;">Actualización de tu guía</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#44403c;">
          Northstar te comparte el estado más reciente. La estructura del correo es la misma
          para todas las marcas; solo cambian color, logo y mensaje.
        </p>
        <p style="margin:0 0 18px;padding:14px 16px;background:#eef5f1;border-radius:10px;font-size:14px;color:#3d6b4f;">
          “Tu pedido ya está en ruta hacia la última milla.”
        </p>
        <a href="#" style="display:inline-block;background:#3d6b4f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">Abrir portal</a>
      `,
      '#3d6b4f',
      'Northstar',
    ),
  },
  {
    id: 'renewal-notice',
    name: 'Aviso de renovación',
    purpose: 'Correo de ciclo de facturación del producto de notificaciones.',
    subject: 'Tu plan se renueva en 3 días',
    html: shell(
      `
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;">Renovación próxima</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#44403c;">
          El plan <strong>Scale</strong> se renueva el <strong>21 nov 2026</strong>.
          Si programaste cancelación al vencer, no se cobrará el siguiente ciclo.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
          <tr>
            <td width="50%" style="padding:12px;border:1px solid #e7e2d9;border-radius:10px 0 0 10px;">
              <div style="font-size:12px;color:#78716c;">Plan</div>
              <div style="margin-top:4px;font-size:16px;font-weight:600;">Scale</div>
            </td>
            <td width="50%" style="padding:12px;border:1px solid #e7e2d9;border-left:0;border-radius:0 10px 10px 0;">
              <div style="font-size:12px;color:#78716c;">Cupo mensual</div>
              <div style="margin-top:4px;font-size:16px;font-weight:600;">5 000 avisos</div>
            </td>
          </tr>
        </table>
        <a href="#" style="display:inline-block;background:#1d4e89;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">Ver facturación</a>
      `,
      '#1d4e89',
      'Billing Demo',
    ),
  },
]
