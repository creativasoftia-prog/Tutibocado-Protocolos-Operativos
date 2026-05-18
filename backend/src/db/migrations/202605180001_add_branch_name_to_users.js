export async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('branch_name', 120).nullable();
  });
}

export async function down(knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('branch_name');
  });
}
