export const protocolsData = [
  {
    id: 'luz',
    code: 'E-01',
    name: 'Falla de energía eléctrica',
    description: 'Protocolo de actuación ante la falta de suministro eléctrico en la sucursal.',
    trigger: 'Corte de energía en la tienda o equipos principales',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Mantenimiento / CFE'],
    priority: 'Alta',
    type: 'Infraestructura',
    textSteps: [
      'Paso 1: Verificar si es un equipo o todo el local. Desconectar equipos y revisar breakers (centro de carga).',
      'Paso 2: Verificar si el problema es general en la zona consultando con vecinos o exterior.',
      'Paso 3: Reportar al 071 (CFE) notificar la anomalía y avisar al supervisor de inmediato.',
      'Paso 4: Esperar el tiempo estimado de CFE (Mantenimiento: 1-2h, Avería: 6-8h).',
      'Paso 5: Si no se restablece y hay riesgo para producto, el Supervisor decide el retorno al CEDIS o traslado.'
    ],
    communicationRules: 'Notificar inmediatamente al supervisor. Si no se resuelve, escalar a Gerencia.',
    closingCriteria: 'Energía restablecida o producto resguardado en CEDIS. Documentar el incidente.',
    recommendations: 'No abrir refrigeradores innecesariamente para mantener el frío.'
  },
  {
    id: 'agua',
    code: 'E-02',
    name: 'Falta de suministro de agua',
    description: 'Protocolo de actuación ante el corte o falta de suministro de agua en la sucursal.',
    trigger: 'Falta de agua en lavabos o baños',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Mantenimiento / Ayuntamiento'],
    priority: 'Media',
    type: 'Infraestructura',
    textSteps: [
      'Paso 1: Verificar si el corte es general en la plaza o zona.',
      'Paso 2: Notificar al supervisor de la incidencia.',
      'Paso 3: Reportar a la autoridad local o administración de la plaza si aplica.',
      'Paso 4: Utilizar reservas de agua para higiene esencial, sin afectar atención al cliente si es posible.',
      'Paso 5: Si la situación es crítica para higiene, el Supervisor evalúa con Gerencia medidas temporales.'
    ],
    communicationRules: 'Notificar al supervisor para evaluar el impacto operativo.',
    closingCriteria: 'Suministro restablecido o medida temporal implementada.',
    recommendations: 'Mantener un garrafón de agua de reserva para lavado de manos emergente.'
  },
  {
    id: 'insumos',
    code: 'I-01',
    name: 'Insumos no llegan',
    description: 'Protocolo a seguir cuando no se reciben los productos o insumos programados en los días designados.',
    trigger: 'Día de entrega (miércoles) sin recepción de insumos o productos faltantes críticos',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Logística'],
    priority: 'Media',
    type: 'Insumos y consumibles',
    textSteps: [
      'Paso 1: Líder de tienda notifica al supervisor indicando qué insumos faltan, con evidencia si aplica.',
      'Paso 2: Supervisor contacta a Logística, reporta el faltante y da seguimiento formal.',
      'Paso 3: Logística evalúa si puede resolver el día de hoy con entrega tardía o reenvío.',
      'Paso 4: Si Logística no puede resolver, el Supervisor escala a Gerencia si afecta la operación para toma de decisión.'
    ],
    communicationRules: 'Comunicación directa líder -> supervisor -> logística.',
    closingCriteria: 'Insumos entregados o caso escalado a Gerencia y documentado.',
    recommendations: 'Miércoles es el día oficial de entrega de velas y desechables.'
  },
  {
    id: 'producto_incidencia',
    code: 'L-01',
    name: 'Incidencia con producto',
    description: 'Acciones ante producto dañado, mal etiquetado, de más o sin asignar.',
    trigger: 'Recepción de producto con irregularidades o sin registro en sistema',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Logística'],
    priority: 'Media',
    type: 'Logística',
    textSteps: [
      'Paso 1: Recibir el producto y documentar inmediatamente la incidencia con evidencia fotográfica.',
      'Paso 2: Notificar al supervisor sobre el estado del producto y la irregularidad detectada.',
      'Paso 3: Supervisor canaliza a Logística enviando el reporte con foto y solicita reemplazo o retorno.',
      'Paso 4: Logística dicta la instrucción o autoriza el retorno.',
      'Paso 5: Retornar producto en el próximo viaje documentado y realizar inventario manual para ajuste.'
    ],
    communicationRules: 'Documentar con foto y notificar al supervisor. No regresar al chofer sin autorización.',
    closingCriteria: 'Producto reemplazado, retornado o justificado en el inventario.',
    recommendations: 'Toda salida o retorno debe documentarse para no afectar la métrica de merma.'
  },
  {
    id: 'sistema',
    code: 'S-01',
    name: 'Falla de sistema / App / POS',
    description: 'Procedimiento ante la caída del sistema de punto de venta o aplicación.',
    trigger: 'App o POS no abre, falla o no permite cobrar',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Soporte Técnico', 'Gerencia'],
    priority: 'Alta',
    type: 'Tecnología',
    textSteps: [
      'Paso 1: Líder notifica al supervisor con detalle del error, incluyendo mensaje y captura de pantalla si es posible.',
      'Paso 2: Supervisor reporta a Soporte Técnico mediante canal directo y da seguimiento.',
      'Paso 3: Si Soporte Técnico resuelve, se documenta y cierra el caso.',
      'Paso 4: Si no se resuelve, Supervisor escala a Gerencia registrando tiempo de inactividad e impacto.'
    ],
    communicationRules: 'Enviar foto del error al supervisor. No intentar arreglos de hardware no autorizados.',
    closingCriteria: 'Sistema restablecido o plan de contingencia autorizado.',
    recommendations: 'Verificar si es falla de internet (reiniciando router) antes de reportar falla de hardware.'
  },
  {
    id: 'personal',
    code: 'H-01',
    name: 'Incidencia de personal',
    description: 'Gestión de incidencias de conducta o faltas del personal de la sucursal.',
    trigger: 'Falta injustificada, retardo mayor, mala conducta',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Recursos Humanos'],
    priority: 'Media',
    type: 'Recursos Humanos',
    textSteps: [
      'Paso 1: Líder de tienda notifica al supervisor describiendo la situación con evidencia si aplica.',
      'Paso 2: Verificar recurrencia. Si es 1ª vez: Llamada verbal + formato F-04 Reporte de Incidencias.',
      'Paso 3: Si es 2ª vez: Acta administrativa formal con registro en Capital Humano.',
      'Paso 4: Si es 3ª vez: Rehabilitación de capacitación o desvinculación, escalando a Gerencia.',
      'Paso 5: Recursos Humanos da respaldo y seguimiento formal conforme al reglamento.'
    ],
    communicationRules: 'Toda incidencia debe quedar documentada por escrito (F-04).',
    closingCriteria: 'Documento firmado y subido al expediente del colaborador.',
    recommendations: 'El sistema de comunicación se dirige al puesto, no a la persona. Mantener trato profesional.'
  },
  {
    id: 'plaga',
    code: 'M-01',
    name: 'Detección de plaga',
    description: 'Acciones a tomar ante la presencia de insectos o roedores en la sucursal.',
    trigger: 'Avistamiento de plaga menor o mayor en área de piso o bodega',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Mantenimiento'],
    priority: 'Alta',
    type: 'Sanidad',
    textSteps: [
      'Paso 1: Notificar al supervisor de inmediato, documentando con evidencia fotográfica.',
      'Paso 2: Evaluar severidad. Si es menor (mosquitas/roedores aislados): Acción preventiva inmediata y documentar.',
      'Paso 3: Si es mayor (infestación): Supervisor obtiene 3 cotizaciones para el servicio.',
      'Paso 4: Supervisor presenta cotizaciones a Gerencia para autorización.',
      'Paso 5: Gerencia aprueba, se contrata y ejecuta el servicio de fumigación.'
    ],
    communicationRules: 'No alarmar a los clientes. Notificar discretamente al supervisor.',
    closingCriteria: 'Servicio de fumigación realizado y limpieza profunda completada.',
    recommendations: 'Asegurar el resguardo de alimentos antes de cualquier procedimiento químico.'
  },
  {
    id: 'autoridad',
    code: 'A-01',
    name: 'Visita de autoridad',
    description: 'Cómo actuar ante inspecciones de autoridades locales o sanitarias.',
    trigger: 'Llegada de inspectores o autoridades a la sucursal',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Gerencia', 'Legal'],
    priority: 'Crítica',
    type: 'Legal',
    textSteps: [
      'Paso 1: Atender con respeto. No comentar nada sin supervisión. Contactar al supervisor de inmediato.',
      'Paso 2: Si es Ayuntamiento (licencias/predial): Supervisor acompaña, documenta y reporta a Gerencia.',
      'Paso 3: Si es COFEPRIS/IMSS: Escalar a Gerencia de inmediato. No firmar nada sin autorización.',
      'Paso 4: Visita documentada y acciones definidas por Gerencia.'
    ],
    communicationRules: 'Avisar inmediatamente al supervisor. Pedir identificación a los inspectores.',
    closingCriteria: 'Acta de visita firmada (con autorización) y requerimientos atendidos.',
    recommendations: 'Tener siempre a la mano la carpeta de permisos y licencias actualizadas.'
  },
  {
    id: 'caja',
    code: 'F-01',
    name: 'Faltante de caja',
    description: 'Protocolo de revisión ante faltantes de efectivo o mermas considerables.',
    trigger: 'Corte de caja con faltante o merma mayor al 3%',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Contabilidad'],
    priority: 'Alta',
    type: 'Finanzas',
    textSteps: [
      'Paso 1: Líder documenta con evidencia fotográfica, realiza inventario manual y notifica al supervisor de inmediato.',
      'Paso 2: Supervisor y Contabilidad abren auditoría interna revisando cierres, arqueos y movimientos.',
      'Paso 3: Si se identifica el origen del faltante: Aplicar acción disciplinaria o de mejora.',
      'Paso 4: Si no se identifica: Escalar a Gerencia para investigación adicional o acción legal.'
    ],
    communicationRules: 'Manejo confidencial y directo con el supervisor y contabilidad.',
    closingCriteria: 'Origen identificado y acción aplicada, o caso escalado formalmente.',
    recommendations: 'La merma máxima permitida es 2-3%. Realizar arqueos preventivos.'
  },
  {
    id: 'cierre_terminal',
    code: 'F-02',
    name: 'Cierre de terminal y facturas',
    description: 'Gestión correcta de cierres de terminal de pago, transferencias y facturación.',
    trigger: 'Cierre de día o solicitud de factura de cliente',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Contabilidad'],
    priority: 'Media',
    type: 'Finanzas',
    textSteps: [
      'Paso 1: Al terminar el turno o día, generar el cierre de terminal.',
      'Paso 2: Enviar el cierre de terminal directamente al Contador.',
      'Paso 3: Si hay solicitud de factura: Recopilar datos fiscales del cliente.',
      'Paso 4: Informar al cliente que el tiempo de entrega de la factura es de 2 a 3 horas.',
      'Paso 5: Enviar solicitud de factura al Contador y al Supervisor.'
    ],
    communicationRules: 'Cierres directos al Contador. Facturas informadas a Contador y Supervisor.',
    closingCriteria: 'Cierre entregado o factura enviada al cliente.',
    recommendations: 'Validar depósitos y transferencias en el momento de la compra.'
  },
  {
    id: 'traspaso_turno',
    code: 'O-02',
    name: 'Traspaso de turno',
    description: 'Protocolo obligatorio para la transición de responsabilidades entre turnos.',
    trigger: 'Cambio de turno en la sucursal',
    responsible: 'Líder saliente y entrante',
    areas: ['Operaciones'],
    priority: 'Media',
    type: 'Operativo',
    textSteps: [
      'Paso 1: Líder saliente realiza corte de caja preliminar y cuadre de efectivo.',
      'Paso 2: Ambos líderes realizan un recorrido rápido de tienda validando limpieza y orden.',
      'Paso 3: Realizar validación rápida de inventario físico (pasteles, vitrina).',
      'Paso 4: Líder saliente comunica incidencias, faltantes y pendientes al entrante.',
      'Paso 5: En caso de discrepancias, reportar al supervisor en el momento, antes de que el saliente se retire.'
    ],
    communicationRules: 'Cualquier diferencia detectada en el cambio de turno debe notificarse de inmediato.',
    closingCriteria: 'Caja y tienda entregadas sin discrepancias o diferencias documentadas.',
    recommendations: 'Evitar salir antes de completar el protocolo para no asumir faltantes de otro turno.'
  },
  {
    id: 'queja_cliente',
    code: 'C-01',
    name: 'Atención a queja de cliente',
    description: 'Manejo de situaciones de insatisfacción o quejas directas de clientes.',
    trigger: 'Cliente manifiesta inconformidad con el producto o servicio',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Atención al Cliente'],
    priority: 'Alta',
    type: 'Atención al Cliente',
    textSteps: [
      'Paso 1: Escuchar al cliente con empatía, sin interrumpir, y ofrecer disculpas por el inconveniente.',
      'Paso 2: Intentar resolver en el momento siguiendo las políticas de garantía de la tienda.',
      'Paso 3: Si escala o requiere revisión mayor, canalizar al cliente a la línea gerente (Atención a Clientes).',
      'Paso 4: Notificar al supervisor de inmediato sobre la queja y el canal de resolución tomado.',
      'Paso 5: Supervisor monitorea la resolución a través de la línea gerente y cierra el caso.'
    ],
    communicationRules: 'Priorizar la amabilidad. No discutir con el cliente y canalizar si no hay solución local.',
    closingCriteria: 'Cliente atendido con resolución o caso canalizado formalmente a Atención al Cliente.',
    recommendations: 'El teléfono gerente (clave 0920) es el canal oficial para escalamientos de quejas.'
  },
  {
    id: 'cortesias',
    code: 'O-03',
    name: 'Cortesías por reseñas QR',
    description: 'Procedimiento para otorgar rebanadas de cortesía a cambio de reseñas en Google.',
    trigger: 'Cliente desea participar en la dinámica de cortesía por reseña',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Marketing'],
    priority: 'Baja',
    type: 'Operativo',
    textSteps: [
      'Paso 1: Invitar al cliente a escanear el QR y dejar una reseña positiva en Google.',
      'Paso 2: Validar la publicación viendo la captura de pantalla o la pantalla del cliente.',
      'Paso 3: Entregar la rebanada de cortesía y documentar la salida.',
      'Paso 4: Guardar la captura de pantalla de la reseña.',
      'Paso 5: Al cierre de semana, el supervisor cuadra las rebanadas de cortesía con las capturas de reseñas.'
    ],
    communicationRules: 'Reportar las cortesías con evidencia al supervisor para justificar el inventario.',
    closingCriteria: 'Cortesía entregada y documentada con captura de reseña.',
    recommendations: 'Toda cortesía sin evidencia se considerará merma injustificada.'
  },
  {
    id: 'emergencia',
    code: 'E-99',
    name: 'Emergencia o riesgo mayor',
    description: 'Actuación frente a asaltos, accidentes graves o desastres naturales.',
    trigger: 'Situación que ponga en riesgo la vida humana en la sucursal',
    responsible: 'Todo el personal',
    areas: ['Operaciones', 'Gerencia', 'Seguridad Pública'],
    priority: 'Crítica',
    type: 'Seguridad',
    textSteps: [
      'Paso 1: PRIMERO: Seguridad del personal. Llamar al 911. No arriesgar vidas por proteger producto.',
      'Paso 2: Notificar al supervisor de inmediato. El supervisor notifica a la cadena de mando.',
      'Paso 3: Supervisor escala a Gerencia para toma de decisiones operativas inmediatas.',
      'Paso 4: Documentar todo al finalizar la emergencia: evidencia, reporte formal y acciones.'
    ],
    communicationRules: 'Llamar al 911 de inmediato y posteriormente al supervisor.',
    closingCriteria: 'Personal a salvo, autoridades pertinentes a cargo y reporte de incidencias completado.',
    recommendations: 'Mantener la calma, no oponer resistencia en asaltos y seguir indicaciones de autoridades.'
  }
];
