/**
 * Migración: eliminar el término "POS" de registros de la BD usando slugs reales.
 * Run: node scripts/migrate-remove-pos-v2.js
 */
import knex from 'knex';
import { createDatabaseConfig } from '../src/config/db.js';

const db = knex(createDatabaseConfig());

async function main() {
  try {
    console.log('🔄  Actualizando registros en BD...\n');

    // ── Protocolos (campos principales) ───────────────────────────────────

    // T-05 fallapos → sistema de cobro
    await db('protocols').where({ slug: 'fallapos' }).update({
      name: 'Falla del sistema de cobro',
      trigger: 'El sistema de cobro está bloqueado, no procesa pagos, está lento o tiene errores de conexión',
      areas_json: JSON.stringify(['Soporte técnico', 'Operaciones', 'Administración']),
      closing_criteria: 'Sistema de cobro operando y todas las transacciones manuales capturadas.',
    });
    console.log('  ✅  T-05 (fallapos) → nombre y campos actualizados');

    // F-03 arqueomanual → descripción
    await db('protocols').where({ slug: 'arqueomanual' }).update({
      description: 'Procedimiento de registro de ventas y cuadre de caja durante falta de energía eléctrica o caída del sistema de cobro.',
    });
    console.log('  ✅  F-03 (arqueomanual) → descripción actualizada');

    // P-03 faltantecajap03 → descripción
    await db('protocols').where({ slug: 'faltantecajap03' }).update({
      description: 'Protocolo ante faltante de dinero físico en caja respecto al sistema de cobro.',
    });
    console.log('  ✅  P-03 (faltantecajap03) → descripción actualizada');

    // T-03 fallainternet → recommendations
    await db('protocols').where({ slug: 'fallainternet' }).update({
      recommendations: 'Considerar red de respaldo (datos móviles) para cobros en la terminal.',
    });
    console.log('  ✅  T-03 (fallainternet) → recomendaciones actualizadas');

    // ── Pasos ──────────────────────────────────────────────────────────────

    // F-03 paso 3
    await db('protocol_steps')
      .whereExists(
        db('protocols').whereRaw('protocols.id = protocol_steps.protocol_id').where({ slug: 'arqueomanual' }).select('id')
      )
      .where({ step_order: 3 })
      .update({ content: 'Paso 3: Al restablecerse la luz o el sistema, capturar todas las ventas manuales en el sistema de cobro.' });
    console.log('  ✅  F-03 paso 3 actualizado');

    // P-03 paso 2
    await db('protocol_steps')
      .whereExists(
        db('protocols').whereRaw('protocols.id = protocol_steps.protocol_id').where({ slug: 'faltantecajap03' }).select('id')
      )
      .where({ step_order: 2 })
      .update({ content: 'Paso 2: Supervisor revisa el sistema de cobro buscando transacciones rechazadas o canceladas.' });
    console.log('  ✅  P-03 paso 2 actualizado');

    // P-03 paso 3
    await db('protocol_steps')
      .whereExists(
        db('protocols').whereRaw('protocols.id = protocol_steps.protocol_id').where({ slug: 'faltantecajap03' }).select('id')
      )
      .where({ step_order: 3 })
      .update({ content: 'Paso 3: Comparar tickets físicos con los registros del sistema y hacer segundo conteo.' });
    console.log('  ✅  P-03 paso 3 actualizado');

    // F-06 paso 2
    await db('protocol_steps')
      .whereExists(
        db('protocols').whereRaw('protocols.id = protocol_steps.protocol_id').where({ slug: 'gestionanticipos' }).select('id')
      )
      .where({ step_order: 2 })
      .update({ content: 'Paso 2 — Registrar el pedido en sistema: Ingresar todos los detalles en el sistema de cobro siguiendo el flujo establecido.' });
    console.log('  ✅  F-06 paso 2 actualizado');

    console.log('\n✅  Migración completada.');
  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

main();
