export async function up(knex) {
  await knex.schema.createTable('role_category_visibility', (table) => {
    table.integer('role_id').unsigned().notNullable();
    table.integer('protocol_type_id').unsigned().notNullable();

    table.primary(['role_id', 'protocol_type_id']);
    table.foreign('role_id').references('roles.id').onDelete('CASCADE');
    table.foreign('protocol_type_id').references('protocol_types.id').onDelete('CASCADE');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('role_category_visibility');
}
