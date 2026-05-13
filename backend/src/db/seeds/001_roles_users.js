import bcrypt from 'bcryptjs';

export async function seed(knex) {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);

  // Insertar Roles
  await knex('roles').insert([
    { name: 'administrador', description: 'Administrador del Sistema', is_system: true },
    { name: 'gerente', description: 'Gerencia Operativa', is_system: true },
    { name: 'supervisor', description: 'Supervisión de Piso', is_system: true },
    { name: 'operador', description: 'Personal Operativo', is_system: true },
    { name: 'capital_humano', description: 'Recursos Humanos', is_system: true }
  ]);

  // Insertar Usuario Admin
  const [adminUserId] = await knex('users').insert({
    full_name: 'Administrador General',
    email: 'admin@tutibocado.local',
    password_hash: adminPasswordHash,
    is_active: true
  }).returning('id');

  const adminId = typeof adminUserId === 'object' ? adminUserId.id : adminUserId;

  // Asignar Rol Admin
  const role = await knex('roles').where('name', 'administrador').first();

  await knex('user_roles').insert({
    user_id: adminId,
    role_id: role.id
  });
}
