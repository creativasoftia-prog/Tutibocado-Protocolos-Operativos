export async function up(knex) {
  await knex.schema.createTable('protocol_incidents', (table) => {
    table.increments('id').primary();
    table.string('incident_number', 40).notNullable().unique();
    table.integer('protocol_id').unsigned().notNullable();
    table.integer('employee_id').unsigned().notNullable();
    table.string('entry_type', 20).notNullable();
    table.boolean('followed_all_steps').nullable();
    table.boolean('was_helpful').nullable();
    table.text('documentation').nullable();
    table.text('suggestion').nullable();
    table.string('status', 20).notNullable().defaultTo('pendiente');
    table.text('review_notes').nullable();
    table.integer('reviewed_by_user_id').unsigned().nullable();
    table.timestamp('reviewed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('protocol_id').references('protocols.id').onDelete('CASCADE');
    table.foreign('employee_id').references('employees.id').onDelete('CASCADE');
    table.foreign('reviewed_by_user_id').references('users.id');
    table.index(['status', 'entry_type'], 'idx_protocol_incidents_status_type');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('protocol_incidents');
}