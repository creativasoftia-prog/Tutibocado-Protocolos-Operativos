export async function up(knex) {
  // ── Empleados ─────────────────────────────────────────────────────────────
  await knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.string('employee_code', 40).notNullable().unique(); // "EMP-001"
    table.string('full_name', 180).notNullable();
    table.string('email', 180).nullable().unique();
    table.string('phone', 40).nullable();
    table.string('department', 120).nullable();
    table.string('branch', 120).nullable();        // sucursal
    table.string('position', 120).nullable();       // puesto
    table.string('shift', 80).nullable();           // turno
    table.boolean('is_active').notNullable().defaultTo(true);
    table.text('notes').nullable();
    // FK opcional hacia user del sistema (si el empleado tiene cuenta)
    table.integer('user_id').unsigned().nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('user_id').references('users.id').onDelete('SET NULL');
  });

  // ── Reportes / Justificantes ───────────────────────────────────────────────
  await knex.schema.createTable('hr_reports', (table) => {
    table.increments('id').primary();
    table.string('report_number', 40).notNullable().unique(); // "REP-20260513-001"
    table.integer('employee_id').unsigned().notNullable();
    table.string('type', 80).notNullable();         // 'falta', 'enfermedad', 'situacion', 'otro'
    table.string('subject', 220).notNullable();
    table.text('description').notNullable();
    table.date('incident_date').notNullable();       // fecha del incidente/falta
    table.string('status', 40).notNullable().defaultTo('pendiente'); // pendiente | revisado | aceptado | rechazado
    table.text('hr_response').nullable();            // respuesta de capital humano
    table.integer('reviewed_by_user_id').unsigned().nullable();
    table.timestamp('reviewed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('employee_id').references('employees.id').onDelete('CASCADE');
    table.foreign('reviewed_by_user_id').references('users.id').onDelete('SET NULL');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('hr_reports');
  await knex.schema.dropTableIfExists('employees');
}
