import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';
import {
  createUserWithRoles,
  deleteUserById,
  getUserProfile,
  listUsersWithRoles,
  loginWithEmailPassword,
  updateUserWithRoles,
  renewToken
} from './service.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos de acceso inválidos', errors: parsed.error.flatten() });
  }

  try {
    const result = await loginWithEmailPassword(parsed.data);
    if (!result) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    return res.json(result);
  } catch (err) {
    return res.status(503).json({ message: 'Servicio temporalmente no disponible. Intenta de nuevo.' });
  }
});

authRouter.get('/me', authenticate, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.sub);
    if (!profile) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(profile);
  } catch (err) {
    return res.status(503).json({ message: 'Servicio temporalmente no disponible.' });
  }
});

authRouter.get('/users', authenticate, requireAnyRole('administrador'), async (_req, res) => {
  const users = await listUsersWithRoles();
  return res.json(users);
});

authRouter.post('/renew', authenticate, async (req, res) => {
  try {
    const result = await renewToken(req.user.sub);
    if (!result) {
      return res.status(401).json({ message: 'Usuario no válido o inactivo' });
    }
    return res.json(result);
  } catch (err) {
    return res.status(503).json({ message: 'Servicio temporalmente no disponible.' });
  }
});

const createUserSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roleNames: z.array(z.string().min(2)).min(1, 'Debes seleccionar al menos un rol'),
  branchName: z.preprocess((v) => (v === '' ? null : v), z.string().max(120).nullable().optional()),
}).superRefine((data, ctx) => {
  if (data.roleNames.includes('sucursal') && (!data.branchName || data.branchName.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre de sucursal debe tener al menos 2 caracteres',
      path: ['branchName'],
    });
  }
});

authRouter.post('/users', authenticate, requireAnyRole('administrador'), async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos de usuario inválidos', errors: parsed.error.flatten() });
  }

  try {
    const user = await createUserWithRoles(parsed.data);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo crear el usuario' });
  }
});

const updateUserSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
  roleNames: z.array(z.string().min(2)).min(1, 'Debes seleccionar al menos un rol'),
  isActive: z.boolean().default(true),
  branchName: z.preprocess((v) => (v === '' ? null : v), z.string().max(120).nullable().optional()),
}).superRefine((data, ctx) => {
  if (data.roleNames.includes('sucursal') && (!data.branchName || data.branchName.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre de sucursal debe tener al menos 2 caracteres',
      path: ['branchName'],
    });
  }
});

authRouter.put('/users/:userId', authenticate, requireAnyRole('administrador'), async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos de usuario inválidos', errors: parsed.error.flatten() });
  }

  try {
    const user = await updateUserWithRoles({ userId, ...parsed.data });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo actualizar el usuario' });
  }
});

authRouter.delete('/users/:userId', authenticate, requireAnyRole('administrador'), async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  try {
    const result = await deleteUserById({ userId, actorUserId: req.user.sub });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo eliminar el usuario' });
  }
});
