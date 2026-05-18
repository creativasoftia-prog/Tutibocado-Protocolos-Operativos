export async function up(knex) {
  await knex.schema.table('employees', (table) => {
    table.date('hire_date').nullable(); // Fecha de ingreso
  });
}

export async function down(knex) {
  await knex.schema.table('employees', (table) => {
    table.dropColumn('hire_date');
  });
}
