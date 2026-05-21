export async function up(knex) {
  await knex.schema.alterTable('hr_reports', (table) => {
    table.integer('submitted_by_user_id').unsigned().nullable();
    table.foreign('submitted_by_user_id').references('users.id').onDelete('SET NULL');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('hr_reports', (table) => {
    table.dropForeign(['submitted_by_user_id']);
    table.dropColumn('submitted_by_user_id');
  });
}
