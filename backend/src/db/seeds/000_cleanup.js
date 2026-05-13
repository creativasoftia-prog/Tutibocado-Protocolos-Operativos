export async function seed(knex) {
  // Desactivar temporalmente las restricciones de llaves foráneas para PostgreSQL
  await knex.raw('TRUNCATE TABLE audit_logs, protocol_visibility_roles, protocol_steps, protocols, protocol_types, user_roles, users, roles CASCADE');
}
