import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../config/db.js';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';

export const rolesRouter = Router();

rolesRouter.use(authenticate);

rolesRouter.get('/', async (_req, res) => {
  const roles = await db('roles')
    .select('id', 'name', 'description', 'is_system as isSystem', 'created_at as createdAt')
    .orderBy('name', 'asc');

  const rolesWithPermissions = await Promise.all(
    roles.map(async (role) => {
      const categoryIds = await db('role_category_visibility')
        .where({ role_id: role.id })
        .pluck('protocol_type_id');
      
      const protocolIds = await db('protocol_visibility_roles')
        .where({ role_id: role.id })
        .pluck('protocol_id');

      return {
        ...role,
        permissions: {
          categoryIds,
          protocolIds
        }
      };
    })
  );

  return res.json(rolesWithPermissions);
});

const createRoleSchema = z.object({
  name: z.string().min(3, 'El nombre del rol debe tener al menos 3 caracteres'),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres').max(300, 'La descripción no puede exceder 300 caracteres').optional().default(''),
  permissions: z.object({
    categoryIds: z.array(z.number()).optional().default([]),
    protocolIds: z.array(z.number()).optional().default([])
  }).optional().default({ categoryIds: [], protocolIds: [] })
});

async function updateRolePermissions(trx, roleId, permissions) {
  const { categoryIds, protocolIds } = permissions;

  // Actualizar categorías
  await trx('role_category_visibility').where({ role_id: roleId }).del();
  if (categoryIds.length > 0) {
    await trx('role_category_visibility').insert(
      categoryIds.map(id => ({ role_id: roleId, protocol_type_id: id }))
    );
  }

  // Actualizar protocolos específicos
  await trx('protocol_visibility_roles').where({ role_id: roleId }).del();
  if (protocolIds.length > 0) {
    await trx('protocol_visibility_roles').insert(
      protocolIds.map(id => ({ role_id: roleId, protocol_id: id }))
    );
  }
}

rolesRouter.post('/', requireAnyRole('administrador'), async (req, res) => {
  const parsed = createRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos del rol inválidos', errors: parsed.error.flatten() });
  }

  const normalizedName = parsed.data.name.trim().toLowerCase();

  const exists = await db('roles').where({ name: normalizedName }).first('id');
  if (exists) {
    return res.status(409).json({ message: 'El rol ya existe' });
  }

  const result = await db.transaction(async (trx) => {
    const [role] = await trx('roles')
      .insert({
        name: normalizedName,
        description: parsed.data.description?.trim() || '',
        is_system: false
      })
      .returning(['id', 'name', 'description', 'is_system as isSystem', 'created_at as createdAt']);

    await updateRolePermissions(trx, role.id, parsed.data.permissions);

    return { ...role, permissions: parsed.data.permissions };
  });

  return res.status(201).json(result);
});

rolesRouter.put('/:roleName', requireAnyRole('administrador'), async (req, res) => {
  const currentName = String(req.params.roleName || '').trim().toLowerCase();
  if (!currentName) {
    return res.status(400).json({ message: 'Nombre de rol inválido' });
  }

  const parsed = createRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos del rol inválidos', errors: parsed.error.flatten() });
  }

  const existing = await db('roles').where({ name: currentName }).first('id', 'name');
  if (!existing) {
    return res.status(404).json({ message: 'Rol no encontrado' });
  }

  const nextName = parsed.data.name.trim().toLowerCase();
  const duplicated = await db('roles').where({ name: nextName }).whereNot({ id: existing.id }).first('id');
  if (duplicated) {
    return res.status(409).json({ message: 'El rol ya existe' });
  }

  const result = await db.transaction(async (trx) => {
    const [updated] = await trx('roles')
      .where({ id: existing.id })
      .update({
        name: nextName,
        description: parsed.data.description?.trim() || ''
      })
      .returning(['id', 'name', 'description', 'is_system as isSystem', 'created_at as createdAt']);

    await updateRolePermissions(trx, updated.id, parsed.data.permissions);

    return { ...updated, permissions: parsed.data.permissions };
  });

  return res.json(result);
});

rolesRouter.delete('/:roleName', requireAnyRole('administrador'), async (req, res) => {
  const roleName = String(req.params.roleName || '').trim().toLowerCase();
  if (!roleName) {
    return res.status(400).json({ message: 'Nombre de rol inválido' });
  }

  const role = await db('roles').where({ name: roleName }).first('id', 'name');
  if (!role) {
    return res.status(404).json({ message: 'Rol no encontrado' });
  }

  const [assignedUsers, linkedCategories, linkedProtocols] = await Promise.all([
    db('user_roles').where({ role_id: role.id }).count('user_id as count').first(),
    db('role_category_visibility').where({ role_id: role.id }).count('protocol_type_id as count').first(),
    db('protocol_visibility_roles').where({ role_id: role.id }).count('protocol_id as count').first(),
  ]);

  const usersCount = Number(assignedUsers?.count || 0);
  const categoriesCount = Number(linkedCategories?.count || 0);
  const protocolsCount = Number(linkedProtocols?.count || 0);

  if (usersCount > 0 || categoriesCount > 0 || protocolsCount > 0) {
    return res.status(409).json({
      message: 'No se puede eliminar el rol porque no está vacío',
      details: {
        usersCount,
        categoriesCount,
        protocolsCount,
      },
    });
  }

  await db('roles').where({ id: role.id }).del();
  return res.json({ deleted: true });
});

