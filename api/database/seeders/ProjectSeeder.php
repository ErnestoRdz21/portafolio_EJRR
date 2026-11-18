<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Seeder;
use RuntimeException;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Si el proyecto ya existe (por slug), no lo toca: así un seed
     * accidental no pisa el contenido de producción. El copy nuevo
     * vive en projects(); se aplica a prod solo cuando tú lo apruebes.
     */
    public function run(): void
    {
        foreach ($this->projects() as $definition) {
            if (Project::query()->where('slug', $definition['slug'])->exists()) {
                continue;
            }

            $technologySlugs = $definition['technologies'];
            unset($definition['technologies']);

            $project = Project::query()->create($definition);

            $technologyIds = Technology::query()
                ->whereIn('slug', $technologySlugs)
                ->pluck('id');

            if ($technologyIds->count() !== count($technologySlugs)) {
                throw new RuntimeException("Faltan tecnologías para {$project->slug}.");
            }

            $project->technologies()->sync($technologyIds);

            foreach ($this->imagesFor($project) as $image) {
                $project->images()->create($image);
            }
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function imagesFor(Project $project): array
    {
        if ($project->slug === 'multichannel-notifications') {
            return [
                [
                    'path' => '/projects/notifications/cover.webp',
                    'alt_text' => 'Vista general del sistema de notificaciones multicanal con métricas y configuración.',
                    'caption' => 'Vista general del sistema de notificaciones multicanal, con métricas, configuración de eventos y administración de canales desde una sola interfaz.',
                    'sort_order' => 1,
                    'is_cover' => true,
                ],
                [
                    'path' => '/projects/notifications/01-event-configuration.webp',
                    'alt_text' => 'Configuración de eventos y canales de notificación.',
                    'caption' => 'Configuración de eventos y canales para controlar qué comunicaciones se envían durante cada etapa de la operación.',
                    'sort_order' => 2,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/notifications/02-notification-center.webp',
                    'alt_text' => 'Centro de notificaciones con eventos agrupados por categoría.',
                    'caption' => 'Centro de notificaciones que centraliza eventos operativos y mensajes relacionados con envíos, pagos y seguimiento.',
                    'sort_order' => 3,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/notifications/03-whatsapp.webp',
                    'alt_text' => 'Notificación transaccional de seguimiento enviada por WhatsApp.',
                    'caption' => 'Ejemplo de notificación transaccional enviada por WhatsApp durante el seguimiento de un envío.',
                    'sort_order' => 4,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/notifications/04-email.webp',
                    'alt_text' => 'Correo transaccional con información y progreso de un envío.',
                    'caption' => 'Plantilla de correo transaccional con estado del envío y representación visual de su recorrido.',
                    'sort_order' => 5,
                    'is_cover' => false,
                ],
            ];
        }

        if ($project->slug === 'white-label-tracking') {
            return [[
                'path' => '/projects/tracking/cover.webp',
                'alt_text' => 'Portal de rastreo con el resultado de una guía, línea de estado y banner publicitario.',
                'caption' => 'Portal de rastreo con marca configurable: búsqueda de guías, estado del envío, historial de eventos y un espacio para publicidad propia de cada marca.',
                'sort_order' => 1,
                'is_cover' => true,
            ]];
        }

        if ($project->slug === 'guided-product-tours') {
            return [
                [
                    'path' => 'projects/guided-product-tours/cover.webp',
                    'alt_text' => 'Tour guiado sobre accesos directos recomendados',
                    'caption' => 'Tour de onboarding: accesos directos a los módulos más usados.',
                    'sort_order' => 1,
                    'is_cover' => true,
                ],
                [
                    'path' => 'projects/guided-product-tours/01-accesos-directos.webp',
                    'alt_text' => 'Paso del tour explicando accesos directos',
                    'caption' => 'Cada desarrollo nuevo incluye un tour para instruir al cliente en la UI real.',
                    'sort_order' => 2,
                    'is_cover' => false,
                ],
                [
                    'path' => 'projects/guided-product-tours/02-busqueda-ajustes.webp',
                    'alt_text' => 'Paso del tour sobre el buscador de ajustes',
                    'caption' => 'El recorrido apunta al buscador para llegar directo a cualquier módulo.',
                    'sort_order' => 3,
                    'is_cover' => false,
                ],
                [
                    'path' => 'projects/guided-product-tours/03-tour-notificaciones.webp',
                    'alt_text' => 'Tour en la pantalla de notificaciones',
                    'caption' => 'Tour de notificaciones: qué avisos recibe el usuario y cuáles van al cliente.',
                    'sort_order' => 4,
                    'is_cover' => false,
                ],
                [
                    'path' => 'projects/guided-product-tours/04-audiencias-avisos.webp',
                    'alt_text' => 'Tour de audiencias para ti y para tus clientes',
                    'caption' => 'Pasos para separar avisos internos y avisos al destinatario de cada guía.',
                    'sort_order' => 5,
                    'is_cover' => false,
                ],
            ];
        }

        if ($project->slug === 'email-template-gallery') {
            return [
                [
                    'path' => 'projects/email-template-gallery/cover.webp',
                    'alt_text' => 'Plantilla de correo de envío creado, vista escritorio y móvil',
                    'caption' => 'Plantilla anonimizada: aviso de envío creado con preview responsive.',
                    'sort_order' => 1,
                    'is_cover' => true,
                ],
                [
                    'path' => 'projects/email-template-gallery/01-envio-creado-dual.webp',
                    'alt_text' => 'Correo de creación de envío en escritorio y móvil',
                    'caption' => 'Misma plantilla en escritorio y móvil, con branding censurado.',
                    'sort_order' => 2,
                    'is_cover' => false,
                ],
                [
                    'path' => 'projects/email-template-gallery/02-envio-creado-variante.webp',
                    'alt_text' => 'Variante demo de plantilla de envío creado',
                    'caption' => 'Variante Logistics Demo · DEMO-001 · Cliente Demo.',
                    'sort_order' => 3,
                    'is_cover' => false,
                ],
            ];
        }

        if ($project->slug === 'customer-support-desk') {
            return [
                [
                    'path' => '/projects/support/cover.webp',
                    'alt_text' => 'Vista principal de una mesa de atención con lista de conversaciones, chat y panel de información.',
                    'caption' => 'Vista principal de la mesa de atención, diseñada para concentrar conversaciones, contexto del cliente y herramientas operativas en una sola interfaz.',
                    'sort_order' => 1,
                    'is_cover' => true,
                ],
                [
                    'path' => '/projects/support/01-chat-dark.webp',
                    'alt_text' => 'Mesa de atención en modo oscuro con conversación y panel lateral.',
                    'caption' => 'La misma experiencia operativa en modo oscuro, manteniendo jerarquía visual y legibilidad durante sesiones prolongadas de atención.',
                    'sort_order' => 2,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/02-profile.webp',
                    'alt_text' => 'Vista de perfil del asesor dentro de la mesa de atención.',
                    'caption' => 'Perfil del asesor integrado dentro del mismo entorno, con información básica y controles de sesión.',
                    'sort_order' => 3,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/03-notes.webp',
                    'alt_text' => 'Sección de notas internas de la mesa de atención.',
                    'caption' => 'Espacio de notas internas para registrar contexto personal y apuntes relacionados con la atención.',
                    'sort_order' => 4,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/04-calendar.webp',
                    'alt_text' => 'Calendario y recordatorios dentro de la mesa de atención.',
                    'caption' => 'Calendario operativo para organizar recordatorios y tareas asociadas al seguimiento de atención.',
                    'sort_order' => 5,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/05-evaluations.webp',
                    'alt_text' => 'Panel de evaluaciones y métricas de atención.',
                    'caption' => 'Vista de evaluaciones y métricas de atención para consultar actividad, tiempos y resultados del asesor.',
                    'sort_order' => 6,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/06-settings.webp',
                    'alt_text' => 'Pantalla de ajustes y personalización de la mesa de atención.',
                    'caption' => 'Configuración personal de la interfaz, incluyendo preferencias visuales y opciones de cuenta.',
                    'sort_order' => 7,
                    'is_cover' => false,
                ],
            ];
        }

        if ($project->slug !== 'settings-spa-modernization') {
            return [[
                'path' => "projects/{$project->slug}/cover.webp",
                'alt_text' => $project->title,
                'caption' => null,
                'sort_order' => 0,
                'is_cover' => true,
            ]];
        }

        return [
            [
                'path' => '/projects/settings-spa/cover.webp',
                'alt_text' => 'Vista general de la sección Settings SPA con accesos de configuración.',
                'caption' => 'Vista general de la sección de configuración modernizada como SPA, con acceso centralizado a múltiples módulos.',
                'sort_order' => 1,
                'is_cover' => true,
            ],
            [
                'path' => '/projects/settings-spa/02-module-detail.webp',
                'alt_text' => 'Vista interna de un módulo integrado dentro de la sección Settings SPA.',
                'caption' => 'Módulo interno integrado bajo el mismo sistema visual, con resumen, filtros y listado en una sola vista.',
                'sort_order' => 2,
                'is_cover' => false,
            ],
            [
                'path' => '/projects/settings-spa/03-search-discovery.webp',
                'alt_text' => 'Buscador de configuraciones y navegación entre módulos en Settings SPA.',
                'caption' => 'Buscador y sistema de descubrimiento para acceder rápidamente a herramientas y configuraciones dentro de la SPA.',
                'sort_order' => 3,
                'is_cover' => false,
            ],
            [
                'path' => '/projects/settings-spa/04-feature-view.webp',
                'alt_text' => 'Sección de perfil dentro de Settings SPA, con navegación lateral de ajustes.',
                'caption' => 'Vista de cuenta dentro de la misma navegación, con secciones agrupadas y una vista previa del perfil.',
                'sort_order' => 4,
                'is_cover' => false,
            ],
            [
                'path' => '/projects/settings-spa/05-package-list.webp',
                'alt_text' => 'Listado en tabla de una funcionalidad de configuración.',
                'caption' => 'Listado de plantillas en una vista de tabla, dentro del mismo flujo de configuración.',
                'sort_order' => 5,
                'is_cover' => false,
            ],
            [
                'path' => 'projects/settings-spa/06-perfil-demo.webp',
                'alt_text' => 'Pantalla Mi Perfil en Settings SPA (demo)',
                'caption' => 'Usuario Demo, asesor demo y código DEMO-0001-0001.',
                'sort_order' => 6,
                'is_cover' => false,
            ],
            [
                'path' => 'projects/settings-spa/07-seguridad-demo.webp',
                'alt_text' => 'Pantalla Seguridad en Settings SPA (demo)',
                'caption' => 'Google Auth y cambio de contraseña en cuenta demo.',
                'sort_order' => 7,
                'is_cover' => false,
            ],
            [
                'path' => 'projects/settings-spa/08-direcciones-demo.webp',
                'alt_text' => 'Pantalla Direcciones en Settings SPA (demo)',
                'caption' => 'Listado con Ana Demo, Carlos Ejemplo y direcciones de ejemplo.',
                'sort_order' => 8,
                'is_cover' => false,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function projects(): array
    {
        return [
            [
                'slug' => 'saas-logistics-platform',
                'title' => 'SaaS Logistics Platform',
                'subtitle' => 'Cotización, guías y rastreo',
                'summary' => 'Caso de arquitectura del ciclo de un envío: cotizar, generar la guía y consultar el estado en un solo producto.',
                'context' => "En un SaaS de logística el envío no es una sola pantalla: cotización, creación de guía y rastreo suelen vivir en módulos distintos.\n\nEste caso documenta cómo se puede unificar ese recorrido en dominio y en interfaz, sin pretender ser un sistema completo de paqueterías.",
                'problem' => "Cotización, guía y rastreo no compartían un flujo común. Cada pieza resolvía su parte, pero el operador perdía contexto al saltar entre pasos.\n\nAdemás, mezclar el dominio del envío con el detalle de cada transportista hacía más difícil evolucionar la interfaz o la API.",
                'solution' => "Se modeló el recorrido principal del envío en Laravel (API REST y dominio) y se presentó en React con TypeScript.\n\nLa idea es simple: un flujo claro de punta a punta, con el estado del envío como eje, y las integraciones de transportistas detrás de ese dominio — no al revés.",
                'responsibilities' => "Definí el modelo de datos del flujo, la API del recorrido y las pantallas que lo muestran.\n\nTambién dejé explícita la frontera entre el dominio del envío y lo que depende de cada carrier, para que el case study se entienda sin convertirse en un catálogo de paqueterías.",
                'technical_decisions' => "Laravel concentra reglas de negocio y persistencia. React + TypeScript se encargan de la experiencia del flujo.\n\nSe priorizó una API REST legible para el recorrido, en lugar de pantallas acopladas a respuestas crudas de cada transportista.",
                'challenges' => "Mostrar el ciclo completo sin fingir un producto de paquetería real, y sin inventar métricas de operación.\n\nEl límite del caso es deliberado: arquitectura y flujo, no cobertura de todos los carriers.",
                'results' => "Queda documentada una arquitectura usable de punta a punta: de la base de datos a la interfaz.\n\nSirve como mapa mental para casos posteriores (rastreo white-label, notificaciones y modernización de ajustes) que se apoyan en el mismo tipo de dominio.",
                'learnings' => "Separar el dominio del envío de las integraciones evita que cada transportista dicte la forma de la UI.\n\nCuando el flujo es el producto, el case study gana claridad: se explica el recorrido, no el proveedor.",
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => true,
                'is_published' => false,
                'sort_order' => 1,
                'technologies' => ['laravel', 'php', 'react', 'typescript', 'postgresql', 'rest-apis', 'playwright'],
            ],
            [
                'slug' => 'multichannel-notifications',
                'title' => 'Multichannel Notification System',
                'subtitle' => 'Avisos por correo y WhatsApp',
                'summary' => 'Producto de notificaciones de punta a punta: un mismo evento puede salir por correo o WhatsApp, con historial, preferencias y un modelo listo para cobro por uso.',
                'context' => "En una plataforma de envíos, los avisos operativos (estado de guía, recordatorios, eventos de producto) no pueden vivir solo en la campana in-app.\n\nHacía falta un sistema que registrara el aviso una sola vez y lo entregara por el canal que el cliente tuviera activo — correo, WhatsApp o ambos — sin duplicar lógica por canal.",
                'problem' => "Cada canal tendía a registrar el aviso a su manera. Eso rompía el historial, complicaba el soporte y hacía imposible saber si un evento ya se había intentado enviar.\n\nTambién faltaba una base común para preferencias por canal, plantillas y, más adelante, cupos y planes: sin un registro único del aviso, el cobro y la auditoría no tenían dónde apoyarse.",
                'solution' => "Construí un registro común del evento: canal, destinatario, plantilla o contenido, y estado de entrega. El envío real (SMTP/Resend o Meta WhatsApp Cloud API) ocurre después; el aviso existe aunque el canal aún no haya respondido.\n\nEncima de ese núcleo se agregaron preferencias por canal, historial/audiencia, envío con archivos cuando aplica, y la lógica de producto cobrable: planes por cliente, cupos, prorrateo de upgrades a mitad de periodo, renovaciones y cancelación programada.",
                'responsibilities' => "Ownership de punta a punta del módulo: modelo de datos, servicios de envío e integración con WhatsApp Cloud API, UI de configuración y consulta, y la capa de planes/cupos.\n\nTambién documenté el módulo y dejé comandos o flujos de diagnóstico para QA, de modo que Soporte y el equipo pudieran validar envíos sin adivinar el estado del aviso.",
                'technical_decisions' => "Laravel concentra el dominio del aviso y las colas/jobs de entrega. React presenta configuración, historial y estados.\n\nLa Meta WhatsApp Cloud API se usa con plantillas aprobadas; el correo sigue el mailer de la plataforma. El estado del aviso es independiente del proveedor: primero se registra, luego se intenta enviar.",
                'challenges' => "Unificar canales con reglas distintas (plantillas de WhatsApp vs HTML de correo) sin duplicar el evento.\n\nEn el portafolio la demo no dispara envíos reales: simular un envío solo marca el registro como enviado. El case study explica el producto completo; la demo muestra el recorte seguro.",
                'results' => "Quedó un producto de notificaciones usable en operación: un solo historial, canales configurables y una base clara para facturar el uso.\n\nEl equipo puede seguir un aviso desde el evento hasta el intento de entrega, y el cliente puede elegir cómo quiere ser contactado.",
                'learnings' => "El estado del aviso debe existir aunque el canal todavía no envíe. Sin ese registro, no hay soporte ni cobro confiables.\n\nSeparar “qué pasó en el producto” de “cómo se entregó” permite sumar canales sin reescribir el dominio.",
                'role' => 'Full Stack Developer',
                'period' => '2026',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 2,
                'technologies' => ['laravel', 'php', 'react', 'whatsapp-cloud-api', 'rest-apis'],
            ],
            [
                'slug' => 'white-label-tracking',
                'title' => 'White-Label Tracking Portal',
                'subtitle' => 'Rastreo con marca configurable',
                'summary' => 'Portal de seguimiento que reutiliza el mismo recorrido de rastreo y cambia marca, acentos y mensajes según la configuración del cliente.',
                'context' => "Varios clientes necesitaban mostrar el rastreo de una guía con su propia marca: logo, colores, banners y copy.\n\nDuplicar una pantalla por cliente no escalaba. El portal debía ser uno solo, alimentado por configuración, y conectarse al módulo de rastreo personalizado de la plataforma.",
                'problem' => "Cada marca pedía una vista propia. Eso multiplicaba mantenimiento, errores visuales y riesgos al actualizar el flujo de estados.\n\nTambién había que evitar fugas de branding: un cliente no puede ver assets o textos de otro, y los cambios de configuración deben quedar auditables.",
                'solution' => "Una interfaz React + TypeScript + Vite que lee la configuración de marca (branding, acento, mensaje) y el estado del envío, y renderiza un solo layout.\n\nEn el ecosistema real esa configuración vive ligada al rastreo personalizado del backend (con control de duplicados y auditoría). En este portafolio la demo cambia marca y estado en el cliente con datos ficticios, para mostrar la idea sin exponer clientes.",
                'responsibilities' => "Diseñé la estructura de la interfaz, el contrato de configuración visual y la convivencia con el módulo de rastreo white-label.\n\nTambién cuidé que el cambio de marca no requiriera clonar componentes: tokens y contenido configurables, misma pantalla.",
                'technical_decisions' => "React, TypeScript, Tailwind y Vite para el portal. Firebase/config remota como soporte de configuración donde aplica el stack del producto.\n\nLa regla de diseño: la marca vive en datos, no en ramas de código por cliente.",
                'challenges' => "Cambiar la marca sin duplicar la pantalla y sin romper el recorrido de estados.\n\nEn la demo pública la guía es fija y no hay API real de rastreo: el foco es la presentación white-label, no el carrier.",
                'results' => "Una sola interfaz adaptable sirve a varias marcas. Sumar un cliente nuevo es configuración y contenido, no un fork del front.\n\nEl case study deja claro el patrón white-label y cómo se separa del dominio de rastreo.",
                'learnings' => "Si la marca está en componentes copiados, cada cambio de UX se vuelve un deploy por cliente.\n\nCuando la marca está en configuración, el producto escala y el diseño se mantiene coherente.",
                'role' => 'Full Stack Developer',
                'period' => '2025 – 2026',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 3,
                'technologies' => ['react', 'typescript', 'tailwind-css', 'vite', 'firebase'],
            ],
            [
                'slug' => 'customer-support-desk',
                'title' => 'Customer Support Desk',
                'subtitle' => 'Mesa de atención y conversaciones',
                'summary' => 'Mesa de atención sobre la bandeja de WhatsApp: lista de conversaciones, hilo, ficha del caso y flujo para que un asesor tome el control con contexto.',
                'context' => "El equipo de atención necesitaba trabajar sobre conversaciones reales de WhatsApp con una bandeja clara: quién espera, qué se habló y en qué estado está el caso.\n\nEste case study cubre la mesa (layout, búsqueda, hilo y estados). El bot de primer nivel y el handoff al asesor forman parte del mismo producto, pero aquí el foco es la experiencia de la bandeja.",
                'problem' => "La lista de casos y la conversación abierta no compartían un estado claro. Sin eso, el asesor pierde el hilo, duplica respuestas o no sabe si el caso sigue abierto.\n\nTambién hacía falta una UI densa pero usable: tres columnas (lista, conversación, ficha), búsqueda rápida y estados legibles, sin convertir el módulo en un helpdesk genérico de marketing.",
                'solution' => "API REST + interfaz React/Inertia con TypeScript: la conversación seleccionada se conserva, el hilo se lee en orden y el estado del caso se actualiza desde la bandeja.\n\nLa estructura separa conversación y mensajes. Encima se apoyan piezas del producto real como notas, supervisión y, en el bot, el traspaso al asesor con resumen — sin exponer datos personales en este portafolio.",
                'responsibilities' => "Modelé conversaciones y mensajes, armé la estructura de la bandeja y conecté la UI al backend.\n\nParticipé en la experiencia completa del desk (layout responsivo, tema claro/oscuro, búsqueda) y en dejar pruebas del dominio con Pest donde aplicaba.",
                'technical_decisions' => "Laravel para el dominio y la API; React + TypeScript + Tailwind para la mesa. Estados de conversación y de mensaje van separados a propósito.\n\nLa demo del portafolio usa datos ficticios y solo permite cambiar el estado de una conversación: suficiente para entender el flujo, sin bandeja real ni WhatsApp en vivo.",
                'challenges' => "Mantener el hilo legible en una UI de tres columnas, y no mezclar “estado del caso” con “estado del mensaje”.\n\nAnonimizar capturas reales (folios, teléfonos, nombres) para el portafolio sin perder la sensación de producto en producción.",
                'results' => "La bandeja queda operable: un asesor puede elegir un caso, leer el hilo y actualizar el estado con contexto.\n\nEl case study demuestra ownership de un producto de atención completo, no solo una lista estática de tickets.",
                'learnings' => "El estado de la conversación y el del mensaje no deben mezclarse: uno guía la cola de trabajo, el otro la lectura del hilo.\n\nEn soporte, la densidad de información importa: hay que priorizar folio, espera y último mensaje antes que decoración.",
                'role' => 'Full Stack Developer',
                'period' => '2026',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 4,
                'technologies' => ['laravel', 'react', 'typescript', 'rest-apis', 'tailwind-css', 'pest'],
            ],
            [
                'slug' => 'legacy-modernization',
                'title' => 'Legacy Platform Modernization',
                'subtitle' => 'Migración progresiva de una pantalla',
                'summary' => 'Cómo migrar una pantalla legacy a React por partes, sin apagar lo que sigue en producción.',
                'context' => "La plataforma tenía vistas donde marcado, jQuery y presentación vivían juntos. Reescribir todo de golpe no era opción: el negocio seguía operando.\n\nEste caso aísla el patrón de convivencia: una pieza nueva en React/Vite junto a lo que aún no se migra.",
                'problem' => "Marcado, comportamiento y estilos estaban acoplados. Cualquier mejora tocaba demasiados archivos y el riesgo de romper producción era alto.\n\nSin un límite claro entre legacy y lo nuevo, la migración se vuelve un reescrito infinito.",
                'solution' => "La pieza nueva vive en React + Vite. Laravel sigue entregando la página y los datos. Lo legacy permanece hasta que haya un corte explícito.\n\nLa demo del portafolio muestra la misma lista en vista clásica y en vista de componentes, para que se vea el antes/después sin fingir un rewrite total.",
                'responsibilities' => 'Definí el corte de la pantalla, la carga de la pieza nueva y las reglas de convivencia para no romper lo que aún no migra.',
                'technical_decisions' => 'Laravel se mantiene como backend. Vite entra la interfaz nueva. El límite entre ambas capas queda documentado y visible en la demo.',
                'challenges' => 'Migrar una parte sin apagar el resto, y evitar dos sistemas visuales peleando en la misma pantalla.',
                'results' => 'Queda un patrón reutilizable de migración progresiva. Settings SPA Modernization aplica la misma idea a una sección completa; este caso es el corte en miniatura.',
                'learnings' => 'El límite entre lo legacy y lo nuevo tiene que ser explícito: si no se ve, nadie sabe qué se puede borrar.',
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => false,
                'is_published' => false,
                'sort_order' => 5,
                'technologies' => ['laravel', 'php', 'react', 'typescript', 'vite', 'mysql', 'git'],
            ],
            [
                'slug' => 'settings-spa-modernization',
                'title' => 'Settings SPA Modernization',
                'subtitle' => 'Ajustes en una sola navegación',
                'summary' => 'Migración de la sección de Ajustes a una SPA: cambio de módulo sin recargar, componentes compartidos y varios flujos operativos dentro de la misma experiencia.',
                'context' => "Ajustes concentraba herramientas críticas del producto: transacciones, créditos, tickets, tiendas, direcciones, reportes, multiusuarios y más.\n\nLa sección tenía que sentirse rápida y consistente, pero sin reescribir toda la plataforma ni cortar las vistas Laravel que todavía sostenían operación.",
                'problem' => "La navegación estaba fragmentada. Cambiar de módulo recargaba la página, el estado se perdía y los estilos no aguantaban al crecer el número de pantallas.\n\nSumar un módulo nuevo significaba pelear otra vez con el layout legacy. La experiencia del usuario y el costo de mantenimiento empujaban a una SPA, pero el backend y muchas vistas seguían siendo Laravel.",
                'solution' => "Reconstruí la sección con React, TypeScript y Tailwind como SPA embebida: el cambio de módulo no recarga la página, hay loader con caché de secciones, buscador y accesos rápidos.\n\nLos módulos migrados comparten componentes (tablas, formularios, estados de carga, tema claro/oscuro). Los que aún no migran conviven como legacy hasta su turno. La demo de Legacy Platform Modernization muestra ese corte en una pantalla chica; este caso es la sección completa.",
                'responsibilities' => "Lideré la modernización progresiva: navegación SPA, integración de múltiples módulos, design system interno de la sección, responsive, light/dark, accesos directos y compatibilidad con el backend existente.\n\nTambién tomé decisiones de producto sobre el orden de migración y qué debía sentirse nativo en la SPA desde el primer día (navegación, búsqueda, feedback de carga).",
                'technical_decisions' => "Migración por partes, no big bang. Laravel sigue siendo la fuente de datos y de autenticación; React presenta la sección.\n\nComponentes reutilizables + sistema visual compartido. Vite para el build. El contrato es claro: el front no reinventar el dominio, solo la experiencia de Ajustes.",
                'challenges' => "Meter módulos nuevos sin romper los que aún no migran, y mantener una UI coherente mientras conviven dos generaciones de pantallas.\n\nEvitar que la SPA se convierta en un iframe opaco: navegación, permisos y datos tienen que seguir alineados con Laravel.",
                'results' => "Ajustes quedó como una experiencia continua: el operador se mueve entre módulos sin recargas, con una base de componentes que acelera cada módulo siguiente.\n\nLa plataforma no se detuvo durante la migración; el valor se fue liberando por entregas.",
                'learnings' => "En modernizaciones grandes, el límite legacy/nuevo debe ser explícito y la navegación es el primer producto.\n\nSi la SPA no gana en velocidad percibida y consistencia visual desde temprano, el equipo vuelve al patrón viejo.",
                'role' => 'Full Stack Developer / Product-focused Developer',
                'period' => '2025 – 2026',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 6,
                'technologies' => ['react', 'typescript', 'laravel', 'tailwind-css', 'vite'],
            ],
            [
                'slug' => 'guided-product-tours',
                'title' => 'Guided Product Tours',
                'subtitle' => 'Onboarding con driver.js',
                'summary' => 'En cada desarrollo nuevo se arma un tour guiado para que el cliente vea cómo usar la pantalla o pueda instruirse solo: API reutilizable, pasos anclados a la UI y persistencia por usuario.',
                'context' => "Al crecer la SPA de ajustes y otros módulos, los usuarios nuevos se perdían entre pantallas densas.\n\nLa regla de producto quedó clara: en cada desarrollo nuevo se hacen tours para que el cliente vea cómo se usa la feature o para instruirlo sin depender solo de docs. Hacía falta un sistema reutilizable, no tooltips sueltos por módulo.",
                'problem' => "Cada módulo inventaba su propia forma de “explicar la pantalla”: tooltips sueltos, docs externos o nada.\n\nSin un sistema común no había forma de marcar un tour como visto, limitar quién lo ve, ni mantener los pasos cuando la UI cambiaba.",
                'solution' => "Armé un sistema global de tours sobre driver.js: una API para declarar pasos, anclas en la UI, y reglas de cuándo mostrar el recorrido.\n\nLa persistencia queda por usuario; la activación se controla por configuración (whitelist). Soporte puede reactivar un tour sin redeploy. En este portafolio la demo corre solo en el navegador sobre una mini SPA ficticia.",
                'responsibilities' => "Diseñé la API del tour, la integración en la SPA de ajustes y el contrato de persistencia/activación.\n\nTambién cuidé que los pasos fueran mantenibles: selectores estables y copy corto, para que el onboarding no se rompiera en cada refactor visual.",
                'technical_decisions' => "driver.js para el spotlight y el popover. React + TypeScript para la pantalla anfitriona. La decisión de producto: el tour vive junto a la UI, no en un micrositio aparte.\n\nWhitelist y “ya visto” viven en configuración/persistencia de usuario en el producto real; la demo del portafolio no guarda estado en servidor.",
                'challenges' => "Anclar pasos a una UI que sigue migrando, sin que un cambio de layout rompa el tour.\n\nEvitar tours interminables: pocos pasos, un objetivo claro por pantalla, y salida fácil.",
                'results' => "Quedó un patrón de onboarding reutilizable en varias secciones del producto.\n\nEl case study y la demo en vivo muestran el mismo idea: destacar controles reales y cerrar el recorrido con feedback claro.",
                'learnings' => "Un tour útil enseña la interfaz que la persona va a usar, no un deck de marketing.\n\nSi el sistema no es global, cada módulo vuelve a inventar tooltips y el onboarding se fragmenta.",
                'role' => 'Full Stack Developer',
                'period' => '2026',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 7,
                'technologies' => ['react', 'typescript', 'laravel', 'vite', 'tailwind-css'],
            ],
            [
                'slug' => 'email-template-gallery',
                'title' => 'Transactional Email Gallery',
                'subtitle' => 'Plantillas HTML con branding',
                'summary' => 'Galería de correos transaccionales anonimizados: misma estructura de plantilla, preview escritorio/móvil y variantes de marca para avisos operativos.',
                'context' => "El producto de notificaciones envía correo además de WhatsApp. Los mensajes tienen que verse confiables en bandeja y adaptarse a marcas white-label.\n\nEste caso concentra el trabajo de plantillas HTML, jerarquía visual y variantes — sin exponer logos ni datos de clientes.",
                'problem' => "Un correo “plano” pierde la identidad del producto y complica el soporte: el usuario no reconoce el aviso ni encuentra la acción.\n\nDuplicar HTML por marca o por evento también multiplica el mantenimiento y los errores de responsive.",
                'solution' => "Plantillas HTML con un shell común (cabecera, cuerpo, pie) y tokens de marca (color, nombre, CTA).\n\nLas variantes cubren avisos de envío, cupo, rastreo white-label y renovación. La demo del portafolio muestra preview escritorio/móvil con contenido 100% ficticio.",
                'responsibilities' => "Definí la estructura de las plantillas, las variantes de branding y el criterio de qué se anonimiza en el portafolio.\n\nEn producto, esas plantillas se apoyan en el mismo dominio de avisos del sistema multicanal; aquí el foco es la presentación y el preview.",
                'technical_decisions' => "HTML tabular compatible con clientes de correo. Tokens de acento por marca en lugar de forks por cliente.\n\nEn el portafolio el preview usa iframe + srcDoc para aislar estilos del shell del sitio.",
                'challenges' => "Que se vea bien en móvil y escritorio sin depender de CSS moderno que muchos clientes ignoran.\n\nAnonimizar por completo: sin logos reales, sin métricas de clientes, sin copy interno sensible.",
                'results' => "Una galería clara de lo que el sistema puede mandar: el visitante ve el oficio de plantillas, no solo un log de envíos.\n\nEl patrón white-label del rastreo se refleja también en el correo.",
                'learnings' => "La plantilla es producto: asunto, jerarquía y CTA importan tanto como el envío.\n\nSi la marca vive en datos, sumar un cliente no implica clonar el HTML.",
                'role' => 'Full Stack Developer',
                'period' => '2026',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 8,
                'technologies' => ['laravel', 'php', 'react', 'typescript', 'tailwind-css'],
            ],
            [
                'slug' => 'notification-billing-plans',
                'title' => 'Notification Plans & Quotas',
                'subtitle' => 'Planes, cupos y prorrateo',
                'summary' => 'Capa cobrable del producto de notificaciones: planes por cliente, cupos del ciclo, upgrade a mitad de periodo con residual, renovaciones y cancelación al vencer.',
                'context' => "Cuando el sistema de avisos pasó de “feature interna” a producto cobrable, hacía falta una capa de planes y cupos.\n\nEste case study aísla esa capa: catálogo de planes, consumo del ciclo y el cálculo de upgrade — con números inventados en la demo.",
                'problem' => "Sin cupo ni plan, no hay forma justa de cobrar el uso ni de avisar antes del tope.\n\nUn upgrade a mitad de mes no puede cobrar el plan nuevo completo otra vez: hace falta residual/prorrateo y un cupo que refleje el plan activo.",
                'solution' => "Modelo de planes por cliente con tope mensual, contador de uso y reglas de renovación/cancelación al vencer.\n\nEl upgrade a mitad de ciclo calcula un residual por días restantes. La demo del portafolio usa precios y cupos ficticios para mostrar el flujo sin exponer billing real.",
                'responsibilities' => "Participé en el dominio de planes/cupos y en dejar el flujo entendible en UI: plan activo, uso del ciclo y simulación de upgrade.\n\nEl case study se conecta con Multichannel Notification System: allá está el envío; aquí, cómo se cobra y limita.",
                'technical_decisions' => "Laravel concentra reglas de plan, cupo y residual. La UI solo presenta estado y acciones.\n\nSeparar “aviso enviado” de “unidad de cupo consumida” evita cobrar mal cuando un canal falla o se reintenta.",
                'challenges' => "Explicar prorrateo sin abrumar, y no filtrar números reales de clientes en el portafolio.\n\nMantener la demo honesta: simulación local, sin pasarela ni cobros.",
                'results' => "Queda visible el ownership de un producto SaaS cobrable encima del motor de avisos.\n\nQuien revisa el portafolio entiende planes, cupos y upgrade — no solo el envío por canal.",
                'learnings' => "El cobro necesita el mismo rigor que el envío: contadores claros y reglas de ciclo explícitas.\n\nSi el residual no se explica en la UI, el upgrade se siente arbitrario.",
                'role' => 'Full Stack Developer',
                'period' => '2026',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 9,
                'technologies' => ['laravel', 'php', 'react', 'typescript', 'rest-apis'],
            ],
        ];
    }
}
