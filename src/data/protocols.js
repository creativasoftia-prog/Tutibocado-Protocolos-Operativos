export const protocolsData = [
  {
    id: 'luz',
    code: 'E-01',
    name: 'Falla de energía eléctrica',
    description: 'Protocolo de actuación ante la falta de suministro eléctrico en la sucursal.',
    trigger: 'Corte de energía en la tienda o equipos principales',
    responsible: 'Líder de tienda / Encargado en turno',
    areas: ['Operaciones', 'Mantenimiento / CFE'],
    priority: 'Alta',
    type: 'Infraestructura',
    textSteps: [
      'Paso 1: Verificar si es un equipo o todo el local. Desconectar equipos y revisar breakers (centro de carga).',
      'Paso 2: Verificar si el problema es general en la zona consultando con vecinos o exterior.',
      'Paso 3: Reportar al 071 (CFE) notificar la anomalía y avisar al supervisor de inmediato.',
      'Paso 4: Esperar el tiempo estimado de CFE (Mantenimiento: 1-2h, Avería: 6-8h).',
      'Paso 5: Si no se restablece y hay riesgo para producto, el Supervisor decide el retorno al CERIS o traslado.'
    ],
    communicationRules: 'Notificar inmediatamente al supervisor. Si no se resuelve, escalar a Gerencia.',
    closingCriteria: 'Energía restablecida o producto resguardado en CERIS. Documentar el incidente.',
    recommendations: 'No abrir refrigeradores innecesariamente para mantener el frío.'
  },
  {
    id: 'insumos',
    code: 'O-01',
    name: 'Insumos no llegan',
    description: 'Protocolo a seguir cuando no se reciben los productos o insumos programados.',
    trigger: 'Día de entrega sin recepción de insumos o productos faltantes críticos',
    responsible: 'Líder de tienda',
    areas: ['Operaciones', 'Logística'],
    priority: 'Media',
    type: 'Operativo',
    textSteps: [
      'Paso 1: Líder de tienda notifica al supervisor indicando qué productos faltan, con evidencia si aplica.',
      'Paso 2: Supervisor contacta a Logística, reporta el faltante y da seguimiento formal.',
      'Paso 3: Logística evalúa si puede resolver el día de hoy con entrega tardía o reenvío.',
      'Paso 4: Si Logística no puede resolver, el Supervisor escala a Gerencia si afecta la operación para toma de decisión.'
    ],
    communicationRules: 'Comunicación directa líder -> supervisor -> logística.',
    closingCriteria: 'Insumos entregados o caso escalado a Gerencia y documentado.',
    recommendations: 'Revisar inventarios de seguridad para evitar quiebres de stock inmediatos.'
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
      'Paso 2: Supervisor reporta a Soporte técnico mediante canal directo y da seguimiento.',
      'Paso 3: Si Soporte técnico resuelve, se documenta y cierra el caso.',
      'Paso 4: Si no se resuelve, Supervisor escala a Gerencia registrando tiempo de inactividad e impacto en la operación.'
    ],
    communicationRules: 'Enviar foto del error al supervisor. No intentar arreglos no autorizados en hardware.',
    closingCriteria: 'Sistema restablecido o plan de contingencia de cobro autorizado por Gerencia.',
    recommendations: 'Verificar si es falla de internet (reiniciando router) antes de reportar falla de hardware.'
  },
  {
    id: 'personal',
    code: 'H-01',
    name: 'Incidencia de personal',
    description: 'Gestión de incidencias de conducta o faltas del personal de la sucursal.',
    trigger: 'Falta injustificada, retardo mayor, mala conducta',
    responsible: 'Líder de tienda / Supervisor',
    areas: ['Operaciones', 'Recursos Humanos'],
    priority: 'Media',
    type: 'Recursos Humanos',
    textSteps: [
      'Paso 1: Líder de tienda notifica al supervisor describiendo la situación con evidencia si aplica.',
      'Paso 2: Verificar la recurrencia. Si es 1ª vez: Llamada verbal + formato F-04.',
      'Paso 3: Si es 2ª vez: Acta formal de atención con registro en Capital Humano.',
      'Paso 4: Si es 3ª vez: Capacitación o desvinculación, escalando a Gerencia general.',
      'Paso 5: Recursos Humanos da respaldo y seguimiento formal conforme al reglamento interno.'
    ],
    communicationRules: 'Toda incidencia debe quedar documentada por escrito (F-04).',
    closingCriteria: 'Documento firmado y subido al expediente del colaborador.',
    recommendations: 'Mantener un trato respetuoso pero firme. La retroalimentación debe ser en privado.'
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
      'Paso 2: Evaluar severidad. Si es menor (mosquitas/roedores aislados): Acción inmediata preventiva, documentar y cotizar servicio si se requiere.',
      'Paso 3: Si es mayor (infestación): Supervisor obtiene 3 cotizaciones, presenta a Gerencia para autorización.',
      'Paso 4: Gerencia aprueba y contrata el servicio de fumigación.',
      'Paso 5: Servicio realizado, caso documentado y cerrado.'
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
    responsible: 'Líder de tienda / Supervisor',
    areas: ['Operaciones', 'Gerencia', 'Legal'],
    priority: 'Crítica',
    type: 'Legal',
    textSteps: [
      'Paso 1: Atender con respeto. No comentar nada sin supervisión. Contactar al supervisor de inmediato.',
      'Paso 2: Si es Ayuntamiento (licencias/predial): Supervisor acompaña, documenta, reporta a Gerencia y Gerencia decide.',
      'Paso 3: Si es COFEPRIS / IMSS: Escalar a Gerencia de inmediato. Contabilidad presente si aplica. No firmar nada sin autorización.',
      'Paso 4: Visita documentada y acciones definidas por Gerencia.'
    ],
    communicationRules: 'Avisar inmediatamente al supervisor y gerente. Pedir identificación a los inspectores.',
    closingCriteria: 'Acta de visita firmada (con autorización) y requerimientos atendidos.',
    recommendations: 'Tener siempre a la mano la carpeta de permisos y licencias actualizadas.'
  },
  {
    id: 'caja',
    code: 'F-01',
    name: 'Faltante de caja',
    description: 'Protocolo de revisión ante faltantes de efectivo o mermas considerables.',
    trigger: 'Corte de caja con faltante o merma mayor al 3%',
    responsible: 'Líder de tienda / Supervisor',
    areas: ['Operaciones', 'Contabilidad'],
    priority: 'Alta',
    type: 'Finanzas',
    textSteps: [
      'Paso 1: Líder documenta con evidencia fotográfica, realiza inventario manual y notifica al supervisor de inmediato.',
      'Paso 2: Supervisor y Contabilidad abren auditoría interna revisando cierres, arqueos y movimientos del día.',
      'Paso 3: Si se identifica el origen del faltante: Aplicar acción disciplinaria o de mejora.',
      'Paso 4: Si no se identifica: Escalar a Gerencia general para investigación adicional o acción legal.'
    ],
    communicationRules: 'Manejo confidencial y directo con el supervisor y contabilidad.',
    closingCriteria: 'Origen identificado y acción aplicada, o caso escalado formalmente.',
    recommendations: 'Realizar arqueos sorpresa preventivos y validar depósitos al momento.'
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
      'Paso 2: Notificar al supervisor de inmediato. El supervisor notifica la cadena completa.',
      'Paso 3: Supervisor escala a Gerencia general para toma de decisión operativa.',
      'Paso 4: Documentar todo al finalizar la emergencia: evidencia, reporte formal y acciones tomadas.'
    ],
    communicationRules: 'Llamar al 911 de inmediato y posteriormente a la cadena de mando.',
    closingCriteria: 'Personal a salvo, autoridades pertinentes a cargo y reporte de incidencias completado.',
    recommendations: 'Mantener la calma, no oponer resistencia y seguir indicaciones de autoridades.'
  }
];
