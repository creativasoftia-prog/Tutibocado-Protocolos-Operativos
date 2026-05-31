export async function up(knex) {
  await knex.schema.createTable('stock_report_types', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable().unique();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('stock_reports', (table) => {
    table.increments('id').primary();
    table.string('report_number', 30).notNullable().unique();
    table.string('branch_name', 160).nullable();
    table.integer('submitted_by_user_id').unsigned().nullable();
    table.date('report_date').notNullable();
    table.jsonb('items').notNullable().defaultTo('[]');
    table.text('general_notes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.foreign('submitted_by_user_id').references('users.id').onDelete('SET NULL');
  });

  await knex.schema.createTable('operational_reports', (table) => {
    table.increments('id').primary();
    table.string('report_number', 30).notNullable().unique();
    table.string('form_type', 40).notNullable();
    table.string('branch_name', 160).nullable();
    table.integer('submitted_by_user_id').unsigned().nullable();
    table.date('report_date').notNullable();
    table.string('shift', 20).nullable();
    table.string('period_label', 120).nullable();
    table.jsonb('items').notNullable().defaultTo('[]');
    table.jsonb('metadata').nullable();
    table.text('manager_note').nullable();
    table.string('encargado_name', 160).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.foreign('submitted_by_user_id').references('users.id').onDelete('SET NULL');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('operational_reports');
  await knex.schema.dropTableIfExists('stock_reports');
  await knex.schema.dropTableIfExists('stock_report_types');
}
