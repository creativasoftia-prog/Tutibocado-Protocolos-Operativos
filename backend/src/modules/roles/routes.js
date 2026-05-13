import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../config/db.js';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';

export const rolesRouter = Router();

rolesRouter.use(authenticate);

rolesRouter.get('/', async (_req, res) => {
  const roles = await db('roles')
    .select('name', 'description', 'is_system as isSystem', 'created_at as createdAt')
    .orderBy('name', 'asc');

  return res.json(roles);
});

const createRoleSchema = z.object({
  name: z.string().min(3, 'El nombre del rol debe tener al menos 3 caracteres'),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres').max(300, 'La descripción no puede exceder 300 caracteres').optional().default('')
});

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

  const [role] = await db('roles')
    .insert({
      name: normalizedName,
      description: parsed.data.description?.trim() || '',
      is_system: false
    })
    .returning(['name', 'description', 'is_system as isSystem', 'created_at as createdAt']);

  return res.status(201).json(role);
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

  const [updated] = await db('roles')
    .where({ id: existing.id })
    .update({
      name: nextName,
      description: parsed.data.description?.trim() || ''
    })
    .returning(['name', 'description', 'is_system as isSystem', 'created_at as createdAt']);

  return res.json(updated);
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

  const [assignedUsers] = await db('user_roles').where({ role_id: role.id }).count('user_id as count');
  if (Number(assignedUsers?.count || 0) > 0) {
    return res.status(409).json({ message: 'No se puede eliminar el rol porque tiene cuentas asignadas' });
  }

  const [assignedProtocols] = await db('protocol_visibility_roles').where({ role_id: role.id }).count('protocol_id as count');
  if (Number(assignedProtocols?.count || 0) > 0) {
    return res.status(409).json({ message: 'No se puede eliminar el rol porque está asignado a protocolos' });
  }

  await db('roles').where({ id: role.id }).del();
  return res.json({ deleted: true });
});
