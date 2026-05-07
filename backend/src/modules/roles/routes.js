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
  name: z.string().min(3),
  description: z.string().min(3).max(300).optional().default('')
});

rolesRouter.post('/', requireAnyRole('administrador'), async (req, res) => {
  const parsed = createRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid role payload' });
  }

  const normalizedName = parsed.data.name.trim().toLowerCase();

  const exists = await db('roles').where({ name: normalizedName }).first('id');
  if (exists) {
    return res.status(409).json({ message: 'Role already exists' });
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
