export async function up(knex) {
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('type', 30).notNullable();         // 'reporte' | 'sugerencia' | 'documentacion'
    table.string('title', 220).notNullable();
    table.text('body').notNullable().defaultTo('');
    table.string('entity_type', 40).notNullable();  // 'hr_report' | 'protocol_incident'
    table.integer('entity_id').unsigned().notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['user_id', 'is_read'], 'idx_notifications_user_read');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('notifications');
}
