/**
 * One-time migration: replace all user-visible "POS" references in the DB with plain Spanish.
 * Run from backend/ folder: node scripts/migrate-remove-pos.js
 */
import knex from 'knex';
import { createDatabaseConfig } from '../src/config/db.js';

const db = knex(createDatabaseConfig());

const UPDATES = [
  // S-01
  { slug: 'sistema', name: 'Falla de la app o sistema de cobro',
    trigger: 'La app o el sistema de cobro no abre, falla, se sobrecalienta o no permite cobrar',
    description: 'Procedimiento ante la caída de la app de cobro, el sistema o falla de red.' },
  // F-03
  { slug: 'arqueo_manual',
    description: 'Procedimiento de registro de ventas y cuadre de caja durante falta de energía eléctrica o caída del sistema de cobro.' },
  // P-03
  { slug: 'faltante_caja_p03',
    description: 'Protocolo ante faltante de dinero físico en caja respecto al sistema de cobro.' },
  // T-03
  { slug: 'falla_internet',
    recommendations: 'Considerar red de respaldo (datos móviles) para cobros en la terminal.' },
  // T-05
  { slug: 'falla_pos', name: 'Falla del sistema de cobro',
    trigger: 'El sistema de cobro está bloqueado, no procesa pagos, está lento o tiene errores de conexión',
    areas_json: JSON.stringify(['Soporte técnico', 'Operaciones', 'Administración']),
    closing_criteria: 'Sistema de cobro operando y todas las transacciones manuales capturadas.' },
];

const STEP_UPDATES = [
  { slug: 'arqueo_manual', step_order: 3,
    content: 'Paso 3: Al restablecerse la luz o el sistema, capturar todas las ventas manuales en el sistema de cobro.' },
  { slug: 'faltante_caja_p03', step_order: 2,
    content: 'Paso 2: Supervisor revisa el sistema de cobro buscando transacciones rechazadas o canceladas.' },
  { slug: 'faltante_caja_p03', step_order: 3,
    content: 'Paso 3: Comparar tickets físicos con los registros del sistema y hacer segundo conteo.' },
];

async function main() {
  try {
    console.log('🔄  Eliminando referencias a "POS" de la BD...\n');

    for (const update of UPDATES) {
      const { slug, ...fields } = update;
      const protocol = await db('protocols').where({ slug }).first('id', 'name');
      if (!protocol) {
        // Try with slug normalized variants
        const altSlug = slug.replace(/_/g, '-');
        const p2 = await db('protocols').where({ slug: altSlug }).first('id', 'name');
        if (!p2) { console.log(`  ⚠  No encontrado: ${slug}`); continue; }
        await db('protocols').where({ id: p2.id }).update(fields);
        console.log(`  ✅  Actualizado: ${p2.name} → ${fields.name || p2.name}`);
        continue;
      }
      await db('protocols').where({ id: protocol.id }).update(fields);
      console.log(`  ✅  Actualizado: ${protocol.name} → ${fields.name || protocol.name}`);
    }

    for (const su of STEP_UPDATES) {
      const protocol = await db('protocols').where({ slug: su.slug }).first('id');
      const altSlug = su.slug.replace(/_/g, '-');
      const p = protocol || await db('protocols').where({ slug: altSlug }).first('id');
      if (!p) { console.log(`  ⚠  No encontrado paso: ${su.slug} #${su.step_order}`); continue; }
      const updated = await db('protocol_steps')
        .where({ protocol_id: p.id, step_order: su.step_order })
        .update({ content: su.content });
      if (updated) console.log(`  ✅  Paso actualizado: ${su.slug} #${su.step_order}`);
      else console.log(`  ⚠  Paso no encontrado: ${su.slug} #${su.step_order}`);
    }

    console.log('\n✅  Migración completada.');
  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();
