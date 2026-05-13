export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('protocols', 'icon');
  if (!hasColumn) {
    await knex.schema.alterTable('protocols', (table) => {
      table.string('icon', 80).notNullable().defaultTo('');
    });
  }
}

export async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('protocols', 'icon');
  if (hasColumn) {
    await knex.schema.alterTable('protocols', (table) => {
      table.dropColumn('icon');
    });
  }
}
