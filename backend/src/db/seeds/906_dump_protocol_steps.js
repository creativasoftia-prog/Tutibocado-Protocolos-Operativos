/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries for this table to avoid duplicates
  // Note: Cleanup script usually handles this, but here we do it per table if needed.
  // await knex('protocol_steps').del();
  
  await knex('protocol_steps').insert([
  {
    "id": 1117,
    "protocol_id": 209,
    "step_order": 1,
    "content": "Paso 1: Verificar si es un equipo o todo el local. Desconectar equipos y revisar breakers (centro de carga)."
  },
  {
    "id": 1118,
    "protocol_id": 209,
    "step_order": 2,
    "content": "Paso 2: Verificar si el problema es general en la zona consultando con vecinos o exterior."
  },
  {
    "id": 1119,
    "protocol_id": 209,
    "step_order": 3,
    "content": "Paso 3: Reportar al 071 (CFE) notificar la anomalía y avisar al supervisor de inmediato."
  },
  {
    "id": 1120,
    "protocol_id": 209,
    "step_order": 4,
    "content": "Paso 4: Si el corte es prolongado, iniciar registro manual de ventas (arqueo manual, F-03)."
  },
  {
    "id": 1121,
    "protocol_id": 209,
    "step_order": 5,
    "content": "Paso 5: Esperar el tiempo estimado de CFE (Mantenimiento: 1-2h, Avería: 6-8h). Si hay riesgo para producto, el Supervisor decide retorno a CEDIS."
  },
  {
    "id": 1122,
    "protocol_id": 210,
    "step_order": 1,
    "content": "Paso 1: Verificar si el corte es general en la plaza o zona."
  },
  {
    "id": 1123,
    "protocol_id": 210,
    "step_order": 2,
    "content": "Paso 2: Notificar al supervisor de la incidencia."
  },
  {
    "id": 1124,
    "protocol_id": 210,
    "step_order": 3,
    "content": "Paso 3: Reportar a la autoridad local o administración de la plaza si aplica."
  },
  {
    "id": 1125,
    "protocol_id": 210,
    "step_order": 4,
    "content": "Paso 4: Utilizar reservas de agua para higiene esencial, sin afectar atención al cliente si es posible."
  },
  {
    "id": 1126,
    "protocol_id": 210,
    "step_order": 5,
    "content": "Paso 5: Si la situación es crítica para higiene, el Supervisor evalúa con Gerencia medidas temporales."
  },
  {
    "id": 1127,
    "protocol_id": 211,
    "step_order": 1,
    "content": "Paso 1: Líder de tienda notifica al supervisor indicando qué insumos faltan, con evidencia si aplica."
  },
  {
    "id": 1128,
    "protocol_id": 211,
    "step_order": 2,
    "content": "Paso 2: Supervisor contacta a Logística, reporta el faltante y da seguimiento formal."
  },
  {
    "id": 1129,
    "protocol_id": 211,
    "step_order": 3,
    "content": "Paso 3: Logística evalúa si puede resolver el día de hoy con entrega tardía o reenvío."
  },
  {
    "id": 1130,
    "protocol_id": 211,
    "step_order": 4,
    "content": "Paso 4: Si Logística no puede resolver, el Supervisor escala a Gerencia si afecta la operación para toma de decisión."
  },
  {
    "id": 1131,
    "protocol_id": 212,
    "step_order": 1,
    "content": "Paso 1: Generar el pedido en la herramienta digital de Almacén. (No usar WhatsApp ni contactar a dirección)."
  },
  {
    "id": 1132,
    "protocol_id": 212,
    "step_order": 2,
    "content": "Paso 2: Si es fuera del horario límite (Lunes 14:00), el pedido queda para el siguiente ciclo y se genera incidencia de extemporáneo."
  },
  {
    "id": 1133,
    "protocol_id": 212,
    "step_order": 3,
    "content": "Paso 3: Para emergencias justificadas (ej. perecederos/fruta), el supervisor evalúa y autoriza la urgencia."
  },
  {
    "id": 1134,
    "protocol_id": 212,
    "step_order": 4,
    "content": "Paso 4: Almacén atiende según disponibilidad, stock validado y calendario oficial."
  },
  {
    "id": 1135,
    "protocol_id": 212,
    "step_order": 5,
    "content": "Paso 5: Sucursal recepciona insumo firmando conformidad o levanta incidencia si hay diferencias."
  },
  {
    "id": 1136,
    "protocol_id": 213,
    "step_order": 1,
    "content": "Paso 1: Solicitar autorización de retorno al supervisor indicando el motivo (ajuste, merma, caducidad o defecto)."
  },
  {
    "id": 1137,
    "protocol_id": 213,
    "step_order": 2,
    "content": "Paso 2: Esperar la orden autorizada; ningún retorno procede hacia almacén sin este documento validado por el supervisor."
  },
  {
    "id": 1138,
    "protocol_id": 213,
    "step_order": 3,
    "content": "Paso 3: Entregar los insumos al repartidor junto con la orden de retorno firmada."
  },
  {
    "id": 1139,
    "protocol_id": 213,
    "step_order": 4,
    "content": "Paso 4: Almacén recepciona, clasifica el retorno y registra la entrada."
  },
  {
    "id": 1140,
    "protocol_id": 213,
    "step_order": 5,
    "content": "Paso 5: Confirmar en sistema el ajuste de inventario para mantener trazabilidad."
  },
  {
    "id": 1141,
    "protocol_id": 214,
    "step_order": 1,
    "content": "Paso 1: Al momento de la entrega, inspeccionar el producto recibido. Si presenta daño físico, empaque abierto, caducidad comprometida, etiquetado incorrecto o alguna irregularidad visible, no recibir el producto. Tomar evidencia fotográfica clara del estado en que llega."
  },
  {
    "id": 1142,
    "protocol_id": 214,
    "step_order": 2,
    "content": "Paso 2: Realizar el procedimiento correspondiente en el formato F-04 (Rechazo de Producto), registrando de forma precisa: nombre del producto, cantidad afectada, motivo del rechazo y evidencia fotográfica anexada."
  },
  {
    "id": 1143,
    "protocol_id": 214,
    "step_order": 3,
    "content": "Paso 3: Notificar de inmediato al supervisor responsable, informando la incidencia detectada y compartiendo la evidencia recopilada."
  },
  {
    "id": 1144,
    "protocol_id": 214,
    "step_order": 4,
    "content": "Paso 4: El supervisor deberá comunicarse con el área de Logística para reportar la situación y solicitar la acción correctiva correspondiente, ya sea reemplazo del producto, autorización de retorno o indicaciones adicionales."
  },
  {
    "id": 1145,
    "protocol_id": 214,
    "step_order": 5,
    "content": "Paso 5: El área de Logística evaluará la incidencia y dictará el procedimiento a seguir respecto al producto rechazado."
  },
  {
    "id": 1146,
    "protocol_id": 214,
    "step_order": 6,
    "content": "Paso 6: Una vez autorizada la acción por supervisor y Logística, retornar el producto al repartidor debidamente documentado. Si aplica, realizar el ajuste manual de inventario para mantener existencias correctas en sistema."
  },
  {
    "id": 1147,
    "protocol_id": 215,
    "step_order": 1,
    "content": "Paso 1: Líder notifica al supervisor con detalle del error, incluyendo mensaje y captura de pantalla si es posible."
  },
  {
    "id": 1148,
    "protocol_id": 215,
    "step_order": 2,
    "content": "Paso 2: En caso de falla de terminal de cobro bancaria, utilizar terminal Clip como método de respaldo temporal."
  },
  {
    "id": 1149,
    "protocol_id": 215,
    "step_order": 3,
    "content": "Paso 3: Supervisor reporta a Soporte Técnico mediante canal directo y da seguimiento."
  },
  {
    "id": 1150,
    "protocol_id": 215,
    "step_order": 4,
    "content": "Paso 4: Si Soporte Técnico resuelve, se documenta y se regresa al método habitual de cobro/registro."
  },
  {
    "id": 1151,
    "protocol_id": 215,
    "step_order": 5,
    "content": "Paso 5: Si no se resuelve, Supervisor escala a Gerencia registrando tiempo de inactividad e impacto."
  },
  {
    "id": 1152,
    "protocol_id": 216,
    "step_order": 1,
    "content": "Paso 1: Líder de tienda notifica al supervisor describiendo la situación con evidencia si aplica."
  },
  {
    "id": 1153,
    "protocol_id": 216,
    "step_order": 2,
    "content": "Paso 2: Verificar recurrencia. Si es 1ª vez: Llamada verbal + formato F-04 Reporte de Incidencias."
  },
  {
    "id": 1154,
    "protocol_id": 216,
    "step_order": 3,
    "content": "Paso 3: Si es 2ª vez: Acta administrativa formal con registro en Capital Humano."
  },
  {
    "id": 1155,
    "protocol_id": 216,
    "step_order": 4,
    "content": "Paso 4: Si es 3ª vez: Rehabilitación de capacitación o desvinculación, escalando a Gerencia."
  },
  {
    "id": 1156,
    "protocol_id": 216,
    "step_order": 5,
    "content": "Paso 5: Capital Humano da respaldo y seguimiento formal conforme al reglamento."
  },
  {
    "id": 1157,
    "protocol_id": 217,
    "step_order": 1,
    "content": "Paso 1: El colaborador debe generar un ticket directamente en el sistema de Capital Humano."
  },
  {
    "id": 1158,
    "protocol_id": 217,
    "step_order": 2,
    "content": "Paso 2: Especificar la categoría correcta del ticket: nómina, asistencias, préstamos o permisos."
  },
  {
    "id": 1159,
    "protocol_id": 217,
    "step_order": 3,
    "content": "Paso 3: Capital Humano evalúa la solicitud y responde al colaborador a través de la misma plataforma."
  },
  {
    "id": 1160,
    "protocol_id": 217,
    "step_order": 4,
    "content": "Paso 4: En caso de aprobación de permisos, el colaborador informará al líder de tienda para prever cobertura."
  },
  {
    "id": 1161,
    "protocol_id": 217,
    "step_order": 5,
    "content": "Paso 5: Para soporte técnico relacionado a Capital Humano, enviar el ticket correspondiente al área."
  },
  {
    "id": 1162,
    "protocol_id": 218,
    "step_order": 1,
    "content": "Paso 1: El colaborador puede generar un ticket confidencial en el sistema de Capital Humano."
  },
  {
    "id": 1163,
    "protocol_id": 218,
    "step_order": 2,
    "content": "Paso 2: Capital Humano recibe la solicitud manteniendo estricta confidencialidad del caso."
  },
  {
    "id": 1164,
    "protocol_id": 218,
    "step_order": 3,
    "content": "Paso 3: Se evalúa y asigna el apoyo pertinente (orientación, eventual contacto con psicólogo o bot de apoyo)."
  },
  {
    "id": 1165,
    "protocol_id": 218,
    "step_order": 4,
    "content": "Paso 4: Capital Humano da seguimiento directo y continuo con el colaborador."
  },
  {
    "id": 1166,
    "protocol_id": 218,
    "step_order": 5,
    "content": "Paso 5: No canalizar estas situaciones a través de los supervisores operativos para proteger la privacidad."
  },
  {
    "id": 1167,
    "protocol_id": 219,
    "step_order": 1,
    "content": "Paso 1: El supervisor o jefe de área detecta e identifica el incumplimiento operativo."
  },
  {
    "id": 1168,
    "protocol_id": 219,
    "step_order": 2,
    "content": "Paso 2: Documentar la falla de forma inmediata y levantar incidencia en el sistema o formato correspondiente."
  },
  {
    "id": 1169,
    "protocol_id": 219,
    "step_order": 3,
    "content": "Paso 3: Evitar resolver el problema informalmente sin dejar documento o registro."
  },
  {
    "id": 1170,
    "protocol_id": 219,
    "step_order": 4,
    "content": "Paso 4: Notificar a Capital Humano sobre la incidencia generada en el expediente."
  },
  {
    "id": 1171,
    "protocol_id": 219,
    "step_order": 5,
    "content": "Paso 5: 3 incidencias documentadas son motivo de acción disciplinaria o causal de baja según reglamento."
  },
  {
    "id": 1172,
    "protocol_id": 220,
    "step_order": 1,
    "content": "Paso 1: Notificar al supervisor de inmediato, documentando con evidencia fotográfica."
  },
  {
    "id": 1173,
    "protocol_id": 220,
    "step_order": 2,
    "content": "Paso 2: Evaluar severidad. Si es menor (mosquitas/roedores aislados): Acción preventiva inmediata y documentar."
  },
  {
    "id": 1174,
    "protocol_id": 220,
    "step_order": 3,
    "content": "Paso 3: Si es mayor (infestación): Supervisor obtiene 3 cotizaciones para el servicio."
  },
  {
    "id": 1175,
    "protocol_id": 220,
    "step_order": 4,
    "content": "Paso 4: Supervisor presenta cotizaciones a Gerencia para autorización."
  },
  {
    "id": 1176,
    "protocol_id": 220,
    "step_order": 5,
    "content": "Paso 5: Gerencia aprueba, se contrata y ejecuta el servicio de fumigación."
  },
  {
    "id": 1177,
    "protocol_id": 221,
    "step_order": 1,
    "content": "Paso 1: Atender con respeto. No comentar nada sin supervisión. Contactar al supervisor de inmediato."
  },
  {
    "id": 1178,
    "protocol_id": 221,
    "step_order": 2,
    "content": "Paso 2: Si es Ayuntamiento (licencias/predial): Supervisor acompaña, documenta y reporta a Gerencia."
  },
  {
    "id": 1179,
    "protocol_id": 221,
    "step_order": 3,
    "content": "Paso 3: Si es COFEPRIS/IMSS: Escalar a Gerencia de inmediato. No firmar nada ni recibir inspección sin autorización."
  },
  {
    "id": 1180,
    "protocol_id": 221,
    "step_order": 4,
    "content": "Paso 4: En caso de cualquier requerimiento legal, mantener canal con el área de Visitas de Dependencias Gubernamentales."
  },
  {
    "id": 1181,
    "protocol_id": 221,
    "step_order": 5,
    "content": "Paso 5: Visita documentada y acciones posteriores definidas por Gerencia."
  },
  {
    "id": 1182,
    "protocol_id": 222,
    "step_order": 1,
    "content": "Paso 1: Líder documenta con evidencia fotográfica, realiza inventario manual y notifica al supervisor de inmediato."
  },
  {
    "id": 1183,
    "protocol_id": 222,
    "step_order": 2,
    "content": "Paso 2: Supervisor y Contabilidad abren auditoría interna revisando cierres, arqueos y movimientos."
  },
  {
    "id": 1184,
    "protocol_id": 222,
    "step_order": 3,
    "content": "Paso 3: Si se identifica el origen del faltante: Aplicar acción disciplinaria o de mejora."
  },
  {
    "id": 1185,
    "protocol_id": 222,
    "step_order": 4,
    "content": "Paso 4: Si no se identifica: Escalar a Gerencia para investigación adicional o acción Asuntos Gubernamentales."
  },
  {
    "id": 1186,
    "protocol_id": 223,
    "step_order": 1,
    "content": "Paso 1: Al terminar el turno o día, generar el cierre de terminal."
  },
  {
    "id": 1187,
    "protocol_id": 223,
    "step_order": 2,
    "content": "Paso 2: Enviar el cierre de terminal directamente al Contador."
  },
  {
    "id": 1188,
    "protocol_id": 223,
    "step_order": 3,
    "content": "Paso 3: Si hay solicitud de factura: Recopilar datos fiscales del cliente."
  },
  {
    "id": 1189,
    "protocol_id": 223,
    "step_order": 4,
    "content": "Paso 4: Informar al cliente que el tiempo de entrega de la factura es de 2 a 3 horas."
  },
  {
    "id": 1190,
    "protocol_id": 223,
    "step_order": 5,
    "content": "Paso 5: Enviar solicitud de factura al Contador y al Supervisor."
  },
  {
    "id": 1191,
    "protocol_id": 224,
    "step_order": 1,
    "content": "Paso 1: Iniciar registro de ventas manualmente en formato designado o libreta."
  },
  {
    "id": 1192,
    "protocol_id": 224,
    "step_order": 2,
    "content": "Paso 2: Anotar fecha, hora, productos vendidos, total cobrado y método de pago (priorizar efectivo)."
  },
  {
    "id": 1193,
    "protocol_id": 224,
    "step_order": 3,
    "content": "Paso 3: Al restablecerse la luz o el sistema, capturar todas las ventas manuales en el sistema de cobro."
  },
  {
    "id": 1194,
    "protocol_id": 224,
    "step_order": 4,
    "content": "Paso 4: Realizar el arqueo sumando el efectivo físico contra el reporte de ventas manuales."
  },
  {
    "id": 1195,
    "protocol_id": 224,
    "step_order": 5,
    "content": "Paso 5: Reportar el cierre y cualquier discrepancia al contador y supervisor."
  },
  {
    "id": 1196,
    "protocol_id": 225,
    "step_order": 1,
    "content": "Paso 1: Líder saliente realiza corte de caja preliminar y cuadre de efectivo."
  },
  {
    "id": 1197,
    "protocol_id": 225,
    "step_order": 2,
    "content": "Paso 2: Ambos líderes realizan un recorrido rápido de tienda validando limpieza y orden."
  },
  {
    "id": 1198,
    "protocol_id": 225,
    "step_order": 3,
    "content": "Paso 3: Realizar validación rápida de inventario físico (pasteles, vitrina)."
  },
  {
    "id": 1199,
    "protocol_id": 225,
    "step_order": 4,
    "content": "Paso 4: Líder saliente comunica incidencias, faltantes y pendientes al entrante."
  },
  {
    "id": 1200,
    "protocol_id": 225,
    "step_order": 5,
    "content": "Paso 5: En caso de discrepancias, reportar al supervisor en el momento, antes de que el saliente se retire."
  },
  {
    "id": 1201,
    "protocol_id": 226,
    "step_order": 1,
    "content": "Paso 1: Escuchar al cliente con empatía, sin interrumpir, y ofrecer disculpas por el inconveniente."
  },
  {
    "id": 1202,
    "protocol_id": 226,
    "step_order": 2,
    "content": "Paso 2: Intentar resolver en el momento siguiendo las políticas de garantía de la tienda."
  },
  {
    "id": 1203,
    "protocol_id": 226,
    "step_order": 3,
    "content": "Paso 3: Si escala o requiere revisión mayor, canalizar al cliente a la línea gerente (Atención a Clientes)."
  },
  {
    "id": 1204,
    "protocol_id": 226,
    "step_order": 4,
    "content": "Paso 4: Notificar al supervisor de inmediato sobre la queja y el canal de resolución tomado."
  },
  {
    "id": 1205,
    "protocol_id": 226,
    "step_order": 5,
    "content": "Paso 5: Supervisor monitorea la resolución a través de la línea gerente y cierra el caso."
  },
  {
    "id": 1206,
    "protocol_id": 227,
    "step_order": 1,
    "content": "Paso 1: Invitar al cliente a escanear el QR y dejar una reseña positiva en Google."
  },
  {
    "id": 1207,
    "protocol_id": 227,
    "step_order": 2,
    "content": "Paso 2: Validar la publicación viendo la captura de pantalla o la pantalla del cliente."
  },
  {
    "id": 1208,
    "protocol_id": 227,
    "step_order": 3,
    "content": "Paso 3: Entregar la rebanada de cortesía y documentar la salida."
  },
  {
    "id": 1209,
    "protocol_id": 227,
    "step_order": 4,
    "content": "Paso 4: Guardar la captura de pantalla de la reseña."
  },
  {
    "id": 1210,
    "protocol_id": 227,
    "step_order": 5,
    "content": "Paso 5: Al cierre de semana, el supervisor cuadra las rebanadas de cortesía con las capturas de reseñas."
  },
  {
    "id": 1211,
    "protocol_id": 228,
    "step_order": 1,
    "content": "Paso 1: PRIMERO: Seguridad del personal. Llamar al 911. No arriesgar vidas por proteger producto."
  },
  {
    "id": 1212,
    "protocol_id": 228,
    "step_order": 2,
    "content": "Paso 2: Notificar al supervisor de inmediato. El supervisor notifica a la cadena de mando."
  },
  {
    "id": 1213,
    "protocol_id": 228,
    "step_order": 3,
    "content": "Paso 3: Supervisor escala a Gerencia para toma de decisiones operativas inmediatas."
  },
  {
    "id": 1214,
    "protocol_id": 228,
    "step_order": 4,
    "content": "Paso 4: Documentar todo al finalizar la emergencia: evidencia, reporte formal y acciones."
  },
  {
    "id": 1215,
    "protocol_id": 229,
    "step_order": 1,
    "content": "Paso 1: Mantener la calma y colgar la llamada inmediatamente sin dar información."
  },
  {
    "id": 1216,
    "protocol_id": 229,
    "step_order": 2,
    "content": "Paso 2: No proporcionar NUNCA información de la empresa, dueños, ganancias o personal."
  },
  {
    "id": 1217,
    "protocol_id": 229,
    "step_order": 3,
    "content": "Paso 3: Notificar al supervisor de inmediato sobre la situación. Si la amenaza es física, contactar al 911."
  },
  {
    "id": 1218,
    "protocol_id": 229,
    "step_order": 4,
    "content": "Paso 4: Registrar y documentar el número telefónico, fecha y hora del incidente."
  },
  {
    "id": 1219,
    "protocol_id": 229,
    "step_order": 5,
    "content": "Paso 5: Supervisor escala el caso y alerta a las demás sucursales como prevención."
  },
  {
    "id": 1220,
    "protocol_id": 230,
    "step_order": 1,
    "content": "Paso 1: No confrontar a la persona o personas bajo ninguna circunstancia."
  },
  {
    "id": 1221,
    "protocol_id": 230,
    "step_order": 2,
    "content": "Paso 2: Resguardarse dentro del local y asegurar accesos si la situación lo amerita."
  },
  {
    "id": 1222,
    "protocol_id": 230,
    "step_order": 3,
    "content": "Paso 3: Llamar al 911 solicitando apoyo de seguridad pública en la ubicación exacta."
  },
  {
    "id": 1223,
    "protocol_id": 230,
    "step_order": 4,
    "content": "Paso 4: Informar al supervisor inmediatamente sobre el desarrollo de la situación."
  },
  {
    "id": 1224,
    "protocol_id": 230,
    "step_order": 5,
    "content": "Paso 5: Una vez superado el evento, generar reporte de incidencias con evidencia (fotos/videos)."
  },
  {
    "id": 1225,
    "protocol_id": 231,
    "step_order": 1,
    "content": "Paso 1: Revisar la fecha de caducidad del pastel. Si le faltan 2 días o menos, avisar al supervisor."
  },
  {
    "id": 1226,
    "protocol_id": 231,
    "step_order": 2,
    "content": "Paso 2: El supervisor autoriza el porcentaje de descuento (ejemplo: 20%, 30% o 50% según la política de la tienda)."
  },
  {
    "id": 1227,
    "protocol_id": 231,
    "step_order": 3,
    "content": "Paso 3: Colocar una etiqueta o letrero visible en el pastel que diga \"PRONTO A VENCER - DESCUENTO\" con el precio rebajado."
  },
  {
    "id": 1228,
    "protocol_id": 231,
    "step_order": 4,
    "content": "Paso 4: Ubicar el pastel en un lugar visible dentro del refrigerador o vitrina para que los clientes lo vean fácilmente."
  },
  {
    "id": 1229,
    "protocol_id": 231,
    "step_order": 5,
    "content": "Paso 5: Registrar la promoción en el sistema (si aplica) o anotar el movimiento en un cuaderno de mermas."
  },
  {
    "id": 1230,
    "protocol_id": 231,
    "step_order": 6,
    "content": "Paso 6: Si el pastel no se vende en el día, al final de la jornada avisar al supervisor para decidir si se rebaja más o se reasigna."
  },
  {
    "id": 1231,
    "protocol_id": 232,
    "step_order": 1,
    "content": "Paso 1: Revisar la fecha de caducidad del pastel. Si le faltan 2 días o menos, avisar al supervisor."
  },
  {
    "id": 1232,
    "protocol_id": 232,
    "step_order": 2,
    "content": "Paso 2: El supervisor confirma que se va a vender por rebanadas (porciones individuales)."
  },
  {
    "id": 1233,
    "protocol_id": 232,
    "step_order": 3,
    "content": "Paso 3: Notificar al area o persona encargada de rebanar pasteles (puede ser otra tienda, obrador o personal autorizado). La tienda no hace el rebanado."
  },
  {
    "id": 1234,
    "protocol_id": 232,
    "step_order": 4,
    "content": "Paso 4: Una vez rebanado, cada porcion se empaca y etiqueta con precio, fecha de caducidad (la misma del pastel original) y el letrero \"PORCION\"."
  },
  {
    "id": 1235,
    "protocol_id": 232,
    "step_order": 5,
    "content": "Paso 5: Colocar las rebanadas en el refrigerador o vitrina en un lugar visible."
  },
  {
    "id": 1236,
    "protocol_id": 232,
    "step_order": 6,
    "content": "Paso 6: Si sobran rebanadas al final del dia, avisar al supervisor para decidir si se promocionan o se desechan."
  },
  {
    "id": 1237,
    "protocol_id": 233,
    "step_order": 1,
    "content": "Paso 1: Revisar inventario actual de productos y suministros."
  },
  {
    "id": 1238,
    "protocol_id": 233,
    "step_order": 2,
    "content": "Paso 2: Identificar faltantes y proyectar demanda para los próximos días."
  },
  {
    "id": 1239,
    "protocol_id": 233,
    "step_order": 3,
    "content": "Paso 3: Completar formato de solicitud indicando sucursal y cantidades exactas."
  },
  {
    "id": 1240,
    "protocol_id": 233,
    "step_order": 4,
    "content": "Paso 4: Enviar solicitud antes de las 11:00 a.m. en los días establecidos."
  },
  {
    "id": 1241,
    "protocol_id": 233,
    "step_order": 5,
    "content": "Paso 5: Confirmar con el supervisor la recepción de la solicitud."
  },
  {
    "id": 1242,
    "protocol_id": 233,
    "step_order": 6,
    "content": "Paso 6: Recibir el pedido en el horario y fecha programados."
  },
  {
    "id": 1243,
    "protocol_id": 234,
    "step_order": 1,
    "content": "Paso 1: Detectar ausencia en los primeros 5 minutos del turno."
  },
  {
    "id": 1244,
    "protocol_id": 234,
    "step_order": 2,
    "content": "Paso 2: Intentar contacto directo con el empleado (2 intentos en los primeros 10 min)."
  },
  {
    "id": 1245,
    "protocol_id": 234,
    "step_order": 3,
    "content": "Paso 3: Registrar la ausencia con hora y resultado del contacto."
  },
  {
    "id": 1246,
    "protocol_id": 234,
    "step_order": 4,
    "content": "Paso 4: Notificar a administración/RRHH detallando turno y empleado."
  },
  {
    "id": 1247,
    "protocol_id": 234,
    "step_order": 5,
    "content": "Paso 5: Activar protocolo de reemplazo interno, externo o de operación reducida."
  },
  {
    "id": 1248,
    "protocol_id": 234,
    "step_order": 6,
    "content": "Paso 6: Documentar cierre completando acta de ausencia P-02-F01 y enviar reporte."
  },
  {
    "id": 1249,
    "protocol_id": 235,
    "step_order": 1,
    "content": "Paso 1: Operario detecta faltante y notifica INMEDIATAMENTE al supervisor."
  },
  {
    "id": 1250,
    "protocol_id": 235,
    "step_order": 2,
    "content": "Paso 2: Supervisor revisa el sistema de cobro buscando transacciones rechazadas o canceladas."
  },
  {
    "id": 1251,
    "protocol_id": 235,
    "step_order": 3,
    "content": "Paso 3: Comparar tickets físicos con los registros del sistema y hacer segundo conteo."
  },
  {
    "id": 1252,
    "protocol_id": 235,
    "step_order": 4,
    "content": "Paso 4: Determinar causa (error de sistema, error operativo, faltante sin explicación o fraude)."
  },
  {
    "id": 1253,
    "protocol_id": 235,
    "step_order": 5,
    "content": "Paso 5: Registrar en Formato P-03-F01 (Acta de faltante de caja) con firmas."
  },
  {
    "id": 1254,
    "protocol_id": 235,
    "step_order": 6,
    "content": "Paso 6: Notificar a administración adjuntando el acta y aplicar acción correctiva."
  },
  {
    "id": 1255,
    "protocol_id": 236,
    "step_order": 1,
    "content": "Paso 1: Preparar la zona de recepción y verificar formato de solicitud original."
  },
  {
    "id": 1256,
    "protocol_id": 236,
    "step_order": 2,
    "content": "Paso 2: Recibir pedido, lista de embarque y anotar hora de llegada."
  },
  {
    "id": 1257,
    "protocol_id": 236,
    "step_order": 3,
    "content": "Paso 3: Revisión inicial de empaques y encuadre físico contra lista de embarque."
  },
  {
    "id": 1258,
    "protocol_id": 236,
    "step_order": 4,
    "content": "Paso 4: Registrar discrepancias y encuadre en el sistema de inventario."
  },
  {
    "id": 1259,
    "protocol_id": 236,
    "step_order": 5,
    "content": "Paso 5: Decidir aceptación total, parcial o rechazo y llenar Formato F-04."
  },
  {
    "id": 1260,
    "protocol_id": 236,
    "step_order": 6,
    "content": "Paso 6: Almacenar los productos respetando FIFO y cerrar acta en sistema."
  },
  {
    "id": 1261,
    "protocol_id": 237,
    "step_order": 1,
    "content": "Paso 1: Escuchar al cliente y aceptar la solicitud de devolución con empatía."
  },
  {
    "id": 1262,
    "protocol_id": 237,
    "step_order": 2,
    "content": "Paso 2: Inspeccionar el producto (integridad, daño, empaque) y clasificar el tipo de devolución."
  },
  {
    "id": 1263,
    "protocol_id": 237,
    "step_order": 3,
    "content": "Paso 3: Tomar fotografías del defecto o estado del pastel y consultar con el supervisor."
  },
  {
    "id": 1264,
    "protocol_id": 237,
    "step_order": 4,
    "content": "Paso 4: Procesar reembolso o canje en el sistema si se aprueba, o explicar el rechazo."
  },
  {
    "id": 1265,
    "protocol_id": 237,
    "step_order": 5,
    "content": "Paso 5: Completar el Formato F-14 (Acta de Retorno de Pastel) y notificar a pastelería si aplica."
  },
  {
    "id": 1266,
    "protocol_id": 237,
    "step_order": 6,
    "content": "Paso 6: Almacenar producto para análisis y realizar seguimiento de servicio al cliente."
  },
  {
    "id": 1267,
    "protocol_id": 238,
    "step_order": 1,
    "content": "Paso 1: Identificar tareas pendientes e incidencias a lo largo del turno."
  },
  {
    "id": 1268,
    "protocol_id": 238,
    "step_order": 2,
    "content": "Paso 2: Documentar en bitácora de turno con hora, descripción y nivel de urgencia."
  },
  {
    "id": 1269,
    "protocol_id": 238,
    "step_order": 3,
    "content": "Paso 3: Comunicar verbalmente al supervisor las tareas críticas antes del cambio."
  },
  {
    "id": 1270,
    "protocol_id": 238,
    "step_order": 4,
    "content": "Paso 4: Entregar la bitácora al turno siguiente para su confirmación de recepción."
  },
  {
    "id": 1271,
    "protocol_id": 238,
    "step_order": 5,
    "content": "Paso 5: El turno entrante ejecuta las tareas críticas en las primeras 2 horas y registra seguimiento."
  },
  {
    "id": 1272,
    "protocol_id": 238,
    "step_order": 6,
    "content": "Paso 6: Cerrar incidencias con firmas y analizar patrones mensualmente."
  },
  {
    "id": 1273,
    "protocol_id": 239,
    "step_order": 1,
    "content": "Paso 1: Verificar enchufe y presencia de luz interior."
  },
  {
    "id": 1274,
    "protocol_id": 239,
    "step_order": 2,
    "content": "Paso 2: Escuchar si el motor funciona; si está muy caliente, desconectar 2 horas."
  },
  {
    "id": 1275,
    "protocol_id": 239,
    "step_order": 3,
    "content": "Paso 3: Limpiar rejilla de ventilación de polvo y suciedad (sin agua)."
  },
  {
    "id": 1276,
    "protocol_id": 239,
    "step_order": 4,
    "content": "Paso 4: Si hay acumulación gruesa de hielo, descongelar de forma natural."
  },
  {
    "id": 1277,
    "protocol_id": 239,
    "step_order": 5,
    "content": "Paso 5: Revisar que el sello de puerta cierre bien usando la prueba del papel."
  },
  {
    "id": 1278,
    "protocol_id": 239,
    "step_order": 6,
    "content": "Paso 6: Si persiste, notificar al supervisor indicando los pasos ya realizados para llamar al técnico."
  },
  {
    "id": 1279,
    "protocol_id": 240,
    "step_order": 1,
    "content": "Paso 1: Revisar que los productos no obstruyan la pared trasera ni conductos de ventilación."
  },
  {
    "id": 1280,
    "protocol_id": 240,
    "step_order": 2,
    "content": "Paso 2: Realizar prueba del papel para verificar el sello de la puerta."
  },
  {
    "id": 1281,
    "protocol_id": 240,
    "step_order": 3,
    "content": "Paso 3: Buscar si hay hielo cubriendo el sensor de temperatura (no tocarlo)."
  },
  {
    "id": 1282,
    "protocol_id": 240,
    "step_order": 4,
    "content": "Paso 4: Tomar lectura exacta del display de temperatura."
  },
  {
    "id": 1283,
    "protocol_id": 240,
    "step_order": 5,
    "content": "Paso 5: Reiniciar equipo (desenchufar 5 minutos) y esperar 1 hora."
  },
  {
    "id": 1284,
    "protocol_id": 240,
    "step_order": 6,
    "content": "Paso 6: Si el problema continúa, escalar a técnico informando los pasos seguidos."
  },
  {
    "id": 1285,
    "protocol_id": 241,
    "step_order": 1,
    "content": "Paso 1: Verificar que enchufe esté firmemente conectado a la toma de corriente."
  },
  {
    "id": 1286,
    "protocol_id": 241,
    "step_order": 2,
    "content": "Paso 2: Si no hay luz, probar el enchufe en otra toma que funcione."
  },
  {
    "id": 1287,
    "protocol_id": 241,
    "step_order": 3,
    "content": "Paso 3: Revisar el cuadro eléctrico (pastillas) para verificar si saltó el interruptor."
  },
  {
    "id": 1288,
    "protocol_id": 241,
    "step_order": 4,
    "content": "Paso 4: Inspeccionar el cable de alimentación buscando daños o quemaduras (no usar si hay daño)."
  },
  {
    "id": 1289,
    "protocol_id": 241,
    "step_order": 5,
    "content": "Paso 5: Buscar y verificar cualquier interruptor ON/OFF adicional en el equipo."
  },
  {
    "id": 1290,
    "protocol_id": 241,
    "step_order": 6,
    "content": "Paso 6: Si no enciende, notificar inmediatamente para llamar técnico y activar plan de respaldo para productos."
  },
  {
    "id": 1291,
    "protocol_id": 242,
    "step_order": 1,
    "content": "Paso 1: Escuchar atentamente para identificar el tipo de ruido sin tocar el equipo."
  },
  {
    "id": 1292,
    "protocol_id": 242,
    "step_order": 2,
    "content": "Paso 2: Si hay clics repetitivos, verificar calentamiento del motor."
  },
  {
    "id": 1293,
    "protocol_id": 242,
    "step_order": 3,
    "content": "Paso 3: Si hay vibración, verificar nivelación ajustando patas y separación de la pared."
  },
  {
    "id": 1294,
    "protocol_id": 242,
    "step_order": 4,
    "content": "Paso 4: Si hay gorgoteo, reconocerlo como ciclo normal de deshielo a menos que sea muy fuerte."
  },
  {
    "id": 1295,
    "protocol_id": 242,
    "step_order": 5,
    "content": "Paso 5: Revisar fricciones internas o elementos sueltos."
  },
  {
    "id": 1296,
    "protocol_id": 242,
    "step_order": 6,
    "content": "Paso 6: Escalar a supervisor si el ruido es preocupante (rechinamiento constante, motor caliente)."
  },
  {
    "id": 1297,
    "protocol_id": 243,
    "step_order": 1,
    "content": "Paso 1: Apagar de inmediato, desconectar y señalizar como NO USAR."
  },
  {
    "id": 1298,
    "protocol_id": 243,
    "step_order": 2,
    "content": "Paso 2: Diagnóstico básico: revisar enchufe, toma de corriente y posibles sobrecalentamientos."
  },
  {
    "id": 1299,
    "protocol_id": 243,
    "step_order": 3,
    "content": "Paso 3: Activar equipo de respaldo si está disponible."
  },
  {
    "id": 1300,
    "protocol_id": 243,
    "step_order": 4,
    "content": "Paso 4: Revisar bloqueos en licuadoras o purgar máquinas de café según aplique."
  },
  {
    "id": 1301,
    "protocol_id": 243,
    "step_order": 5,
    "content": "Paso 5: Documentar la falla en Acta de Falla de Equipo (E-01-F01)."
  },
  {
    "id": 1302,
    "protocol_id": 243,
    "step_order": 6,
    "content": "Paso 6: Escalar a administración con detalles para coordinar reparación o reemplazo."
  },
  {
    "id": 1303,
    "protocol_id": 244,
    "step_order": 1,
    "content": "Paso 1: Verificar conexiones de cables, energía y encendido de monitor."
  },
  {
    "id": 1304,
    "protocol_id": 244,
    "step_order": 2,
    "content": "Paso 2: Reiniciar el sistema apagando por 30 segundos."
  },
  {
    "id": 1305,
    "protocol_id": 244,
    "step_order": 3,
    "content": "Paso 3: Validar la conexión a red / Wi-Fi."
  },
  {
    "id": 1306,
    "protocol_id": 244,
    "step_order": 4,
    "content": "Paso 4: Cerrar y reabrir el programa con fallo, o liberar espacio si el disco está lleno."
  },
  {
    "id": 1307,
    "protocol_id": 244,
    "step_order": 5,
    "content": "Paso 5: Anotar mensaje de error y contexto."
  },
  {
    "id": 1308,
    "protocol_id": 244,
    "step_order": 6,
    "content": "Paso 6: Escalar a soporte técnico proporcionando detalles si el fallo persiste."
  },
  {
    "id": 1309,
    "protocol_id": 245,
    "step_order": 1,
    "content": "Paso 1: Verificar batería (conectar cargador 5 minutos mínimo)."
  },
  {
    "id": 1310,
    "protocol_id": 245,
    "step_order": 2,
    "content": "Paso 2: Inspeccionar daños físicos (pantalla rota, puerto de carga)."
  },
  {
    "id": 1311,
    "protocol_id": 245,
    "step_order": 3,
    "content": "Paso 3: Reiniciar el equipo apagando por 30 segundos."
  },
  {
    "id": 1312,
    "protocol_id": 245,
    "step_order": 4,
    "content": "Paso 4: Validar conexión a internet mediante modo avión o reconexión de datos."
  },
  {
    "id": 1313,
    "protocol_id": 245,
    "step_order": 5,
    "content": "Paso 5: Liberar espacio si el almacenamiento supera el 85% y limpiar caché de apps."
  },
  {
    "id": 1314,
    "protocol_id": 245,
    "step_order": 6,
    "content": "Paso 6: Escalar a soporte si persiste, usando alternativo temporal."
  },
  {
    "id": 1315,
    "protocol_id": 246,
    "step_order": 1,
    "content": "Paso 1: Confirmar si el problema es de un solo dispositivo o de toda la red."
  },
  {
    "id": 1316,
    "protocol_id": 246,
    "step_order": 2,
    "content": "Paso 2: Revisar las luces del módem/router (rojo/apagado)."
  },
  {
    "id": 1317,
    "protocol_id": 246,
    "step_order": 3,
    "content": "Paso 3: Reiniciar el módem desconectándolo por 30 segundos."
  },
  {
    "id": 1318,
    "protocol_id": 246,
    "step_order": 4,
    "content": "Paso 4: Confirmar si otras sucursales tienen falla (caída de zona)."
  },
  {
    "id": 1319,
    "protocol_id": 246,
    "step_order": 5,
    "content": "Paso 5: Si no se resuelve, el supervisor levanta reporte con el proveedor de internet."
  },
  {
    "id": 1320,
    "protocol_id": 246,
    "step_order": 6,
    "content": "Paso 6: Activar plan de contingencia (cobro manual, tethering desde móvil)."
  },
  {
    "id": 1321,
    "protocol_id": 247,
    "step_order": 1,
    "content": "Paso 1: Verificar encendido y cables conectados."
  },
  {
    "id": 1322,
    "protocol_id": 247,
    "step_order": 2,
    "content": "Paso 2: Confirmar disponibilidad de papel y recargar si está vacía."
  },
  {
    "id": 1323,
    "protocol_id": 247,
    "step_order": 3,
    "content": "Paso 3: Buscar y retirar con cuidado cualquier atasco de papel."
  },
  {
    "id": 1324,
    "protocol_id": 247,
    "step_order": 4,
    "content": "Paso 4: Reiniciar impresora por 10 segundos y validar la conexión en Windows."
  },
  {
    "id": 1325,
    "protocol_id": 247,
    "step_order": 5,
    "content": "Paso 5: Leer el mensaje de error en pantalla o indicadores LED."
  },
  {
    "id": 1326,
    "protocol_id": 247,
    "step_order": 6,
    "content": "Paso 6: Enviar impresión de prueba; si falla, escalar a soporte."
  },
  {
    "id": 1327,
    "protocol_id": 248,
    "step_order": 1,
    "content": "Paso 1: Validar si la falla es de la aplicación, pantalla negra o lentitud."
  },
  {
    "id": 1328,
    "protocol_id": 248,
    "step_order": 2,
    "content": "Paso 2: Verificar conexión a internet, fundamental para terminales."
  },
  {
    "id": 1329,
    "protocol_id": 248,
    "step_order": 3,
    "content": "Paso 3: Reiniciar completamente el equipo (computadora o terminal) por 30 segundos."
  },
  {
    "id": 1330,
    "protocol_id": 248,
    "step_order": 4,
    "content": "Paso 4: Revisar estado de la base de datos y conexión de periféricos (cajonera, lector)."
  },
  {
    "id": 1331,
    "protocol_id": 248,
    "step_order": 5,
    "content": "Paso 5: Si falla, activar COBRO MANUAL de inmediato anotando en libreta."
  },
  {
    "id": 1332,
    "protocol_id": 248,
    "step_order": 6,
    "content": "Paso 6: Escalar a soporte remoto. Al restaurarse, sincronizar todas las ventas manuales."
  },
  {
    "id": 1333,
    "protocol_id": 249,
    "step_order": 1,
    "content": "Paso 1 — Acceso y condiciones físicas del local: Al llegar a la sucursal, verificar que el acceso esté en buen estado, sin daños visibles en puertas, cerraduras o fachada. Si se detecta alguna anomalía como puerta forzada, vidrios rotos o señales de intrusión, no entrar al local y contactar al supervisor de inmediato siguiendo el protocolo S-03."
  },
  {
    "id": 1334,
    "protocol_id": 249,
    "step_order": 2,
    "content": "Paso 2 — Encendido y condiciones básicas: Encender luces, sistema de caja, refrigerador y demás equipos necesarios. Verificar que la temperatura del refrigerador esté dentro del rango correcto (4–15°C). Si algún equipo no enciende o presenta falla, referirse al protocolo correspondiente según el equipo afectado."
  },
  {
    "id": 1335,
    "protocol_id": 249,
    "step_order": 3,
    "content": "Paso 3 — Abrir al público: La sucursal debe abrir en el horario establecido sin demora. Atender al cliente y continuar con tareas pendientes durante el turno si llega un cliente antes de completar el checklist."
  },
  {
    "id": 1336,
    "protocol_id": 249,
    "step_order": 4,
    "content": "Paso 4 — Completar responsabilidades del turno: Completar el checklist de apertura siguiendo el formulario F-09A (verificación de fondo de caja, inventario F-03, vitrina, limpieza, insumos, papel de impresora y bitácora del turno anterior). Todo debe quedar completado antes de la mitad del turno."
  },
  {
    "id": 1337,
    "protocol_id": 249,
    "step_order": 5,
    "content": "Paso 5 — Registro y confirmación: Firmar el F-09A como encargado de apertura y notificar al supervisor si existe alguna novedad, faltante o condición anormal detectada durante el proceso."
  },
  {
    "id": 1338,
    "protocol_id": 250,
    "step_order": 1,
    "content": "Paso 1 — Responsabilidades previas al cierre: Completar tareas que no interfieran con la atención: limpieza, revisión final de inventario (F-03), registro de novedades en bitácora F-01 y anotación de compromisos para el siguiente turno."
  },
  {
    "id": 1339,
    "protocol_id": 250,
    "step_order": 2,
    "content": "Paso 2 — Corte de caja: Realizar el corte de caja con dos personas presentes (si aplica), llenando el formato F-02. Registrar total en efectivo, otros medios, vales y cortesías. Documentar y notificar cualquier diferencia al supervisor."
  },
  {
    "id": 1340,
    "protocol_id": 250,
    "step_order": 3,
    "content": "Paso 3 — Cierre al público y seguridad del local: Tras atender al último cliente, cerrar la sucursal, apagar equipos, asegurar refrigerador y verificar accesos."
  },
  {
    "id": 1341,
    "protocol_id": 250,
    "step_order": 4,
    "content": "Paso 4 — Reporte diario: Enviar el reporte diario de operación (F-05) al supervisor antes de retirarse, incluyendo novedades relevantes."
  },
  {
    "id": 1342,
    "protocol_id": 250,
    "step_order": 5,
    "content": "Paso 5 — Entrega de accesos: Entregar llaves y accesos al siguiente encargado si aplica, o resguardarlos según procedimiento. Firmar F-09C como encargado de cierre."
  },
  {
    "id": 1343,
    "protocol_id": 251,
    "step_order": 1,
    "content": "Paso 1 — Atender al cliente con calma y empatía: Recibir al cliente con amabilidad. Pedir un momento para verificar internamente y no discutir ni culpar a otras áreas frente al cliente."
  },
  {
    "id": 1344,
    "protocol_id": 251,
    "step_order": 2,
    "content": "Paso 2 — Verificar en sistema: Buscar el pedido por nombre, número o fecha y revisar observaciones o discrepancias."
  },
  {
    "id": 1345,
    "protocol_id": 251,
    "step_order": 3,
    "content": "Paso 3 — Notificar al supervisor de inmediato: Informar con todos los detalles; el supervisor decide el curso de acción. No ofrecer soluciones sin autorización."
  },
  {
    "id": 1346,
    "protocol_id": 251,
    "step_order": 4,
    "content": "Paso 4 — Comunicar al cliente con transparencia: Tras la indicación del supervisor, explicar la solución o tiempos estimados al cliente de forma clara."
  },
  {
    "id": 1347,
    "protocol_id": 251,
    "step_order": 5,
    "content": "Paso 5 — Documentar el incidente: Registrar la situación en la bitácora F-01 con nombre del cliente, tipo de error, acciones y resultado."
  },
  {
    "id": 1348,
    "protocol_id": 252,
    "step_order": 1,
    "content": "Paso 1 — Confirmar el agotamiento: Verificar físicamente en vitrina, bodega y reservas antes de declarar agotado."
  },
  {
    "id": 1349,
    "protocol_id": 252,
    "step_order": 2,
    "content": "Paso 2 — Informar al cliente con alternativas: Comunicar amablemente y ofrecer opciones similares del catálogo."
  },
  {
    "id": 1350,
    "protocol_id": 252,
    "step_order": 3,
    "content": "Paso 3 — Notificar al supervisor: Indicar hora aproximada de agotamiento y demanda observada."
  },
  {
    "id": 1351,
    "protocol_id": 252,
    "step_order": 4,
    "content": "Paso 4 — Actualizar la presentación de vitrina: Reorganizar la vitrina para evitar espacios vacíos."
  },
  {
    "id": 1352,
    "protocol_id": 252,
    "step_order": 5,
    "content": "Paso 5 — Registrar en bitácora: Anotar en F-01 producto, hora y si hubo clientes no atendidos."
  },
  {
    "id": 1353,
    "protocol_id": 253,
    "step_order": 1,
    "content": "Paso 1 — Disculpa y atención inmediata: Recibir al cliente con amabilidad, ofrecer una disculpa genuina y atenderlo de forma prioritaria."
  },
  {
    "id": 1354,
    "protocol_id": 253,
    "step_order": 2,
    "content": "Paso 2 — Ofrecer las dos opciones: Preguntar al cliente si prefiere un cambio por producto nuevo en buen estado o la devolución de su dinero (reembolso total)."
  },
  {
    "id": 1355,
    "protocol_id": 253,
    "step_order": 3,
    "content": "Paso 3 — Recibir y verificar el producto: Recibir el producto, revisar visualmente el daño o deterioro y confirmar que efectivamente está en mal estado."
  },
  {
    "id": 1356,
    "protocol_id": 253,
    "step_order": 4,
    "content": "Paso 4 — Notificar al supervisor: Informar al supervisor sobre el caso para que autorice la acción correspondiente (cambio o reembolso)."
  },
  {
    "id": 1357,
    "protocol_id": 253,
    "step_order": 5,
    "content": "Paso 5 — Documentar la incidencia: Registrar el caso en sistema para dar de baja el producto del inventario, justificar la salida sin cobro y permitir análisis de calidad."
  },
  {
    "id": 1358,
    "protocol_id": 253,
    "step_order": 6,
    "content": "Paso 6 — Ejecutar la acción: Realizar el cambio o reembolso según lo autorizado y confirmar con el cliente."
  },
  {
    "id": 1359,
    "protocol_id": 254,
    "step_order": 1,
    "content": "Paso 1 — Recibir y escuchar al cliente: Recibirlo con amabilidad, preguntar por qué no le gustó y revisar cuánto producto trae de vuelta."
  },
  {
    "id": 1360,
    "protocol_id": 254,
    "step_order": 2,
    "content": "Paso 2 — Calcular cuánto trae sin consumir: Estimar el porcentaje que regresa el cliente (ej. si trae el 75% del pastel, el consumo fue del 25%)."
  },
  {
    "id": 1361,
    "protocol_id": 254,
    "step_order": 3,
    "content": "Paso 3 — Ofrecer opciones según lo que trae: Si trae una parte considerable, puede pedir cambio por otro producto similar (mismo valor o pagando diferencia) o reembolso proporcional a lo que no consumió."
  },
  {
    "id": 1362,
    "protocol_id": 254,
    "step_order": 4,
    "content": "Paso 4 — Anotar el motivo: Pedir al cliente que diga brevemente por qué no le gustó (ej. \"estaba seco\", \"sabor raro\"). Esto es obligatorio si ya se han tenido tres o más quejas parecidas."
  },
  {
    "id": 1363,
    "protocol_id": 254,
    "step_order": 5,
    "content": "Paso 5 — Notificar al supervisor: Informar sobre el caso, sobre todo si puede indicar un problema repetido de calidad."
  },
  {
    "id": 1364,
    "protocol_id": 254,
    "step_order": 6,
    "content": "Paso 6 — Ejecutar el cambio o reembolso: Procesar la acción autorizada en sistema y confirmar con el cliente."
  },
  {
    "id": 1365,
    "protocol_id": 255,
    "step_order": 1,
    "content": "Paso 1 — Escuchar al cliente: Identificar si quiere cambiar de tamaño (ej. de 24 a 20 piezas) o de producto (ej. pastel de chocolate por uno de vainilla)."
  },
  {
    "id": 1366,
    "protocol_id": 255,
    "step_order": 2,
    "content": "Paso 2 — Revisar el estado del producto: Confirmar que el producto esté en buen estado y no haya sido consumido más de un poco."
  },
  {
    "id": 1367,
    "protocol_id": 255,
    "step_order": 3,
    "content": "Paso 3 — Calcular la diferencia de precio: Si el nuevo es más caro, el cliente paga la diferencia. Si es más barato, se le devuelve la diferencia. Si son del mismo valor, no hay ajuste."
  },
  {
    "id": 1368,
    "protocol_id": 255,
    "step_order": 4,
    "content": "Paso 4 — Notificar al supervisor y registrar en sistema: Registrar la devolución del producto original y hacer la nueva venta con el precio correcto."
  },
  {
    "id": 1369,
    "protocol_id": 255,
    "step_order": 5,
    "content": "Paso 5 — Confirmar con el cliente: Explicar claramente si hay diferencia a pagar o a devolver y entregar el nuevo producto."
  },
  {
    "id": 1370,
    "protocol_id": 256,
    "step_order": 1,
    "content": "Paso 1 — Mantener la calma y no escalar: Hablar en tono bajo y tranquilo, evitando confrontación."
  },
  {
    "id": 1371,
    "protocol_id": 256,
    "step_order": 2,
    "content": "Paso 2 — No ceder a presiones fuera de política: No ofrecer compensaciones no autorizadas."
  },
  {
    "id": 1372,
    "protocol_id": 256,
    "step_order": 3,
    "content": "Paso 3 — Notificar al supervisor de inmediato: Describir la situación y nivel de agresividad."
  },
  {
    "id": 1373,
    "protocol_id": 256,
    "step_order": 4,
    "content": "Paso 4 — Resguardar al resto del personal y clientes: Mantener distancia y priorizar seguridad."
  },
  {
    "id": 1374,
    "protocol_id": 256,
    "step_order": 5,
    "content": "Paso 5 — Contactar al 911 si hay amenaza física: Llamar inmediatamente si hay riesgo real y notificar al supervisor."
  },
  {
    "id": 1375,
    "protocol_id": 256,
    "step_order": 6,
    "content": "Paso 6 — Documentar el incidente: Registrar en F-01 con hora, descripción, acciones y resultado."
  },
  {
    "id": 1376,
    "protocol_id": 257,
    "step_order": 1,
    "content": "Paso 1 — Identificar el error: Determinar si fue cobro de más, de menos, producto no registrado o método incorrecto."
  },
  {
    "id": 1377,
    "protocol_id": 257,
    "step_order": 2,
    "content": "Paso 2 — Notificar al supervisor antes de corregir: Informar monto, producto y tipo de error; esperar autorización."
  },
  {
    "id": 1378,
    "protocol_id": 257,
    "step_order": 3,
    "content": "Paso 3 — Corrección con cliente presente: Devolver diferencia con autorización o aplicar ajuste según indicación del supervisor."
  },
  {
    "id": 1379,
    "protocol_id": 257,
    "step_order": 4,
    "content": "Paso 4 — Corrección sin cliente presente: Documentar en F-02 la diferencia y explicación; supervisor/contador evalúan seguimiento."
  },
  {
    "id": 1380,
    "protocol_id": 257,
    "step_order": 5,
    "content": "Paso 5 — Registrar el incidente: Anotar en F-01 causa probable y acción tomada."
  },
  {
    "id": 1381,
    "protocol_id": 258,
    "step_order": 1,
    "content": "Paso 1 — Atención inicial al cliente: Identificar producto, fecha, personalizaciones y datos de contacto sin comprometer disponibilidad sin verificar."
  },
  {
    "id": 1382,
    "protocol_id": 258,
    "step_order": 2,
    "content": "Paso 2 — Registrar el pedido en sistema: Ingresar todos los detalles en el sistema de cobro siguiendo el flujo establecido."
  },
  {
    "id": 1383,
    "protocol_id": 258,
    "step_order": 3,
    "content": "Paso 3 — Gestión del anticipo: Registrar pago en sistema y entregar comprobante con monto, saldo y fecha de entrega."
  },
  {
    "id": 1384,
    "protocol_id": 258,
    "step_order": 4,
    "content": "Paso 4 — Notificar al supervisor y al contador: Informar especialmente cuando hay personalización o monto significativo."
  },
  {
    "id": 1385,
    "protocol_id": 258,
    "step_order": 5,
    "content": "Paso 5 — Confirmar detalles con el cliente antes de su salida: Repetir producto, fecha, monto y saldo."
  },
  {
    "id": 1386,
    "protocol_id": 259,
    "step_order": 1,
    "content": "Paso 1 — Atender a la persona de inmediato: Preguntar cómo se siente, ofrecer primeros auxilios si es leve, llamar al 911 si es grave."
  },
  {
    "id": 1387,
    "protocol_id": 259,
    "step_order": 2,
    "content": "Paso 2 — Notificar al supervisor de inmediato: Describir lo ocurrido y solicitar indicaciones."
  },
  {
    "id": 1388,
    "protocol_id": 259,
    "step_order": 3,
    "content": "Paso 3 — No reconocer responsabilidad: Evitar frases que impliquen admisión de culpa; las declaraciones formales pasan por supervisor/gerencia."
  },
  {
    "id": 1389,
    "protocol_id": 259,
    "step_order": 4,
    "content": "Paso 4 — Documentar el incidente: Registrar en F-01 con hora, lugar, descripción, acciones y resultado; tomar evidencia si procede."
  },
  {
    "id": 1390,
    "protocol_id": 259,
    "step_order": 5,
    "content": "Paso 5 — Seguimiento con gerencia: Supervisor informa a gerencia para evaluar implicaciones legales y acciones preventivas."
  },
  {
    "id": 1391,
    "protocol_id": 260,
    "step_order": 1,
    "content": "Paso 1 — Atender al colaborador de inmediato: Aplicar primeros auxilios si es leve; llamar al 911 si es grave."
  },
  {
    "id": 1392,
    "protocol_id": 260,
    "step_order": 2,
    "content": "Paso 2 — Notificar al supervisor de inmediato: Describir tipo de accidente y condición del colaborador."
  },
  {
    "id": 1393,
    "protocol_id": 260,
    "step_order": 3,
    "content": "Paso 3 — No minimizar el incidente: Reportar formalmente cualquier accidente laboral, por pequeño que parezca."
  },
  {
    "id": 1394,
    "protocol_id": 260,
    "step_order": 4,
    "content": "Paso 4 — Documentar el accidente: Registrar en F-01 con detalle y evidencia si procede."
  },
  {
    "id": 1395,
    "protocol_id": 260,
    "step_order": 5,
    "content": "Paso 5 — Seguimiento con Capital Humano e IMSS: Supervisor notifica a Capital Humano para tramitar reporte ante IMSS si aplica."
  }
]);
};
