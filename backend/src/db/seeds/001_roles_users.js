import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';

export async function seed(knex) {
  await knex('audit_logs').del();
  await knex('protocol_visibility_roles').del();
  await knex('protocol_steps').del();
  await knex('protocols').del();
  await knex('protocol_types').del();
  await knex('user_roles').del();
  await knex('users').del();
  await knex('roles').del();

  const rolesData = [
    {
      name: 'administrador',
      description: 'Gestiona usuarios, roles y protocolos',
      is_system: true
    },
    {
      name: 'supervisor',
      description: 'Supervision operativa',
      is_system: true
    },
    {
      name: 'logistica',
      description: 'Operaciones logisticas',
      is_system: true
    },
    {
      name: 'sucursal',
      description: 'Colaborador de sucursal',
      is_system: true
    }
  ];

  await knex('roles').insert(rolesData);

  const roles = await knex('roles').select('id', 'name');
  const adminRole = roles.find((item) => item.name === 'administrador');
  const sucursalRole = roles.find((item) => item.name === 'sucursal');

  const adminPasswordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  const [adminUser] = await knex('users')
    .insert({
      full_name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL.toLowerCase(),
      password_hash: adminPasswordHash,
      is_active: true
    })
    .returning(['id']);

  await knex('user_roles').insert({ user_id: adminUser.id, role_id: adminRole.id });

  const defaultUsers = [
    {
      full_name: 'Supervisor Demo',
      email: 'supervisor@tutibocado.local',
      password: 'Demo123!',
      role: 'supervisor'
    },
    {
      full_name: 'Logistica Demo',
      email: 'logistica@tutibocado.local',
      password: 'Demo123!',
      role: 'logistica'
    },
    {
      full_name: 'Sucursal Demo',
      email: 'sucursal@tutibocado.local',
      password: 'Demo123!',
      role: 'sucursal'
    }
  ];

  for (const item of defaultUsers) {
    const role = roles.find((entry) => entry.name === item.role) || sucursalRole;
    const hash = await bcrypt.hash(item.password, 10);

    const [user] = await knex('users')
      .insert({
        full_name: item.full_name,
        email: item.email,
        password_hash: hash,
        is_active: true
      })
      .returning(['id']);

    await knex('user_roles').insert({ user_id: user.id, role_id: role.id });
  }
}
