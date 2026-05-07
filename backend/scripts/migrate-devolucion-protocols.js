/**
 * One-time migration: replace the old generic C-02 "Devolución o cambio de producto"
 * with the 3 new specific return protocols (C-02, C-04, C-05).
 *
 * Run from backend/ folder: node scripts/migrate-devolucion-protocols.js
 */

import knex from 'knex';
import { createDatabaseConfig } from '../src/config/db.js';

const db = knex(createDatabaseConfig());

// ── Helper ─────────────────────────────────────────────────────────────────
const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

async function ensureTypeId(name) {
  const [existing] = await db('protocol_types').where({ name }).select('id');
  if (existing) return existing.id;
  const [created] = await db('protocol_types').insert({ name }).returning(['id']);
  return created.id;
}

async function getVisibleRoleIds() {
  const roles = await db('roles').select('id', 'name');
  return roles
    .filter((r) => ['administrador', 'supervisor', 'logistica', 'sucursal'].includes(r.name))
    .map((r) => r.id);
}

async function insertProtocol(protocol, typeId, visibleRoleIds, adminId) {
  let slug = normalizeSlug(protocol.id);
  let suffix = 1;
  while (true) {
    const found = await db('protocols').where({ slug }).first('id');
    if (!found) break;
    suffix += 1;
    slug = `${normalizeSlug(protocol.id)}-${suffix}`;
  }

  const [created] = await db('protocols')
    .insert({
      slug,
      code: protocol.code,
      name: protocol.name,
      description: protocol.description,
      trigger: protocol.trigger,
      responsible: protocol.responsible,
      areas_json: JSON.stringify(protocol.areas || []),
      priority: protocol.priority,
      protocol_type_id: typeId,
      communication_rules: protocol.communicationRules || '',
      closing_criteria: protocol.closingCriteria || '',
      recommendations: protocol.recommendations || '',
      created_by_user_id: adminId || null,
    })
    .returning(['id']);

  const steps = (protocol.textSteps || []).map((content, index) => ({
    protocol_id: created.id,
    step_order: index + 1,
    content,
  }));
  if (steps.length > 0) await db('protocol_steps').insert(steps);

  if (visibleRoleIds.length > 0) {
    await db('protocol_visibility_roles').insert(
      visibleRoleIds.map((roleId) => ({ protocol_id: created.id, role_id: roleId }))
    );
  }

  return created.id;
}

// ── New protocols ──────────────────────────────────────────────────────────
const NEW_PROTOCOLS = [
  {
    id: 'producto_echado_perder',
    code: 'C-02',
    name: 'Producto en mal estado (echado a perder)',
    description: 'Gestión de devoluciones y reembolsos cuando un cliente regresa un producto defectuoso, descompuesto o en mal estado.',
    trigger: 'Cliente regresa un producto porque está en mal estado, descompuesto o tiene defecto de fábrica.',
    responsible: 'Encargado de turno',
    areas: ['Operaciones', 'Supervisor de turno'],
    priority: 'Alta',
    type: 'Atención al Cliente',
    textSteps: [
      'Paso 1 — Disculpa y atención inmediata: Recibir al cliente con amabilidad, ofrecer una disculpa genuina y atenderlo de forma prioritaria.',
      'Paso 2 — Ofrecer las dos opciones: Preguntar al cliente si prefiere un cambio por producto nuevo en buen estado o la devolución de su dinero (reembolso total).',
      'Paso 3 — Recibir y verificar el producto: Recibir el producto, revisar visualmente el daño o deterioro y confirmar que efectivamente está en mal estado.',
      'Paso 4 — Notificar al supervisor: Informar al supervisor sobre el caso para que autorice la acción correspondiente (cambio o reembolso).',
      'Paso 5 — Documentar la incidencia: Registrar el caso en sistema para dar de baja el producto del inventario, justificar la salida sin cobro y permitir análisis de calidad.',
      'Paso 6 — Ejecutar la acción: Realizar el cambio o reembolso según lo autorizado y confirmar con el cliente.',
    ],
    communicationRules:
      'Siempre iniciar con disculpa. Ningún cambio o reembolso procede sin autorización del supervisor. Documentar cada caso para control de inventario y calidad.',
    closingCriteria:
      'Cliente atendido con cambio o reembolso ejecutado, producto dado de baja en sistema y supervisor notificado.',
    recommendations:
      'Actuar con rapidez; en productos en mal estado el proceso debe ser ágil. Si se detectan varios reclamos similares, el supervisor investiga posibles fallas de producción.',
  },
  {
    id: 'no_me_gusto',
    code: 'C-04',
    name: 'Devolución por insatisfacción ("no me gustó")',
    description:
      'Manejo de solicitudes de cambio o reembolso cuando el cliente no quedó satisfecho con el sabor, textura o calidad del producto.',
    trigger:
      'Cliente regresa el producto porque no le gustó (sabor, textura, que estaba seco, etc.) y pide cambio o reembolso parcial.',
    responsible: 'Encargado de turno',
    areas: ['Operaciones', 'Supervisor de turno'],
    priority: 'Media',
    type: 'Atención al Cliente',
    textSteps: [
      'Paso 1 — Recibir y escuchar al cliente: Recibirlo con amabilidad, preguntar por qué no le gustó y revisar cuánto producto trae de vuelta.',
      'Paso 2 — Calcular cuánto trae sin consumir: Estimar el porcentaje que regresa el cliente (ej. si trae el 75% del pastel, el consumo fue del 25%).',
      'Paso 3 — Ofrecer opciones según lo que trae: Si trae una parte considerable, puede pedir cambio por otro producto similar (mismo valor o pagando diferencia) o reembolso proporcional a lo que no consumió.',
      'Paso 4 — Anotar el motivo: Pedir al cliente que diga brevemente por qué no le gustó (ej. "estaba seco", "sabor raro"). Esto es obligatorio si ya se han tenido tres o más quejas parecidas.',
      'Paso 5 — Notificar al supervisor: Informar sobre el caso, sobre todo si puede indicar un problema repetido de calidad.',
      'Paso 6 — Ejecutar el cambio o reembolso: Procesar la acción autorizada en sistema y confirmar con el cliente.',
    ],
    communicationRules:
      'No proceder sin verificar cuánto trae el cliente de vuelta. El reembolso es siempre proporcional a lo no consumido. Si el cliente no trae nada del producto (consumo total), no procede reembolso ni cambio.',
    closingCriteria:
      'Cliente atendido con acción proporcional ejecutada, motivo registrado y supervisor notificado.',
    recommendations:
      'Mantener trato empático aunque la queja sea subjetiva. Documentar los motivos para que calidad tome acciones correctivas.',
  },
  {
    id: 'cambio_tamano_tipo',
    code: 'C-05',
    name: 'Cambio de tamaño o tipo de producto',
    description:
      'Procedimiento cuando el cliente quiere cambiar su producto por uno de diferente tamaño o tipo, sin que esté defectuoso ni por disgusto.',
    trigger:
      'Cliente desea cambiar el producto que compró por uno de diferente tamaño o por uno completamente diferente.',
    responsible: 'Encargado de turno',
    areas: ['Operaciones', 'Supervisor de turno', 'Caja'],
    priority: 'Media',
    type: 'Atención al Cliente',
    textSteps: [
      'Paso 1 — Escuchar al cliente: Identificar si quiere cambiar de tamaño (ej. de 24 a 20 piezas) o de producto (ej. pastel de chocolate por uno de vainilla).',
      'Paso 2 — Revisar el estado del producto: Confirmar que el producto esté en buen estado y no haya sido consumido más de un poco.',
      'Paso 3 — Calcular la diferencia de precio: Si el nuevo es más caro, el cliente paga la diferencia. Si es más barato, se le devuelve la diferencia. Si son del mismo valor, no hay ajuste.',
      'Paso 4 — Notificar al supervisor y registrar en sistema: Registrar la devolución del producto original y hacer la nueva venta con el precio correcto.',
      'Paso 5 — Confirmar con el cliente: Explicar claramente si hay diferencia a pagar o a devolver y entregar el nuevo producto.',
    ],
    communicationRules:
      'El cambio solo procede si el producto está en condiciones de ser revendido. Las diferencias de precio siempre se ajustan. Si el producto está muy consumido, remitir al supervisor.',
    closingCriteria:
      'Cambio procesado en sistema, diferencia económica ajustada y cliente satisfecho con el nuevo producto.',
    recommendations:
      'Es el tipo de cambio más sencillo. Priorizar la solución rápida para mantener la relación con el cliente. Registrar para control de inventario.',
  },
];

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🔄  Iniciando migración de protocolos de devolución...\n');

    // 1. Delete old C-02 "devolucion-cambio" (and variants with suffix)
    const oldSlugs = await db('protocols')
      .where('slug', 'like', 'devolucion-cambio%')
      .orWhere('code', 'C-02')
      .select('id', 'slug', 'code', 'name');

    if (oldSlugs.length > 0) {
      for (const p of oldSlugs) {
        console.log(`  🗑  Eliminando: [${p.code}] ${p.name} (slug: ${p.slug})`);
        await db('protocol_visibility_roles').where({ protocol_id: p.id }).delete();
        await db('protocol_steps').where({ protocol_id: p.id }).delete();
        await db('protocols').where({ id: p.id }).delete();
      }
    } else {
      console.log('  ℹ  No se encontró el protocolo C-02 antiguo en la BD.');
    }

    // 2. Also skip if C-04 or C-05 already exist
    const existingCodes = await db('protocols')
      .whereIn('code', ['C-04', 'C-05'])
      .select('code', 'name');
    const skipCodes = new Set(existingCodes.map((p) => p.code));
    if (skipCodes.size > 0) {
      console.log(`\n  ⚠  Ya existen en BD: ${[...skipCodes].join(', ')} — se omitirán.`);
    }

    // 3. Insert new protocols
    const typeId = await ensureTypeId('Atención al Cliente');
    const visibleRoleIds = await getVisibleRoleIds();
    const adminUser = await db('users as u')
      .innerJoin('user_roles as ur', 'ur.user_id', 'u.id')
      .innerJoin('roles as r', 'r.id', 'ur.role_id')
      .where('r.name', 'administrador')
      .first('u.id as id');

    for (const protocol of NEW_PROTOCOLS) {
      if (skipCodes.has(protocol.code)) continue;
      const newId = await insertProtocol(protocol, typeId, visibleRoleIds, adminUser?.id);
      console.log(`  ✅  Insertado: [${protocol.code}] ${protocol.name} (id: ${newId})`);
    }

    console.log('\n✅  Migración completada.');
  } catch (err) {
    console.error('\n❌  Error durante la migración:', err.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();
