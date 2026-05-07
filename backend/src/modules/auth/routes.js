import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';
import {
  createUserWithRoles,
  deleteUserById,
  getUserProfile,
  listUsersWithRoles,
  loginWithEmailPassword,
  updateUserWithRoles
} from './service.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid login payload' });
  }

  const result = await loginWithEmailPassword(parsed.data);

  if (!result) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json(result);
});

authRouter.get('/me', authenticate, async (req, res) => {
  const profile = await getUserProfile(req.user.sub);

  if (!profile) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(profile);
});

authRouter.get('/users', authenticate, requireAnyRole('administrador'), async (_req, res) => {
  const users = await listUsersWithRoles();
  return res.json(users);
});

const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  roleNames: z.array(z.string().min(2)).min(1)
});

authRouter.post('/users', authenticate, requireAnyRole('administrador'), async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid user payload' });
  }

  try {
    const user = await createUserWithRoles(parsed.data);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create user' });
  }
});

const updateUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal('')),
  roleNames: z.array(z.string().min(2)).min(1),
  isActive: z.boolean().default(true)
});

authRouter.put('/users/:userId', authenticate, requireAnyRole('administrador'), async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid user payload' });
  }

  try {
    const user = await updateUserWithRoles({ userId, ...parsed.data });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update user' });
  }
});

authRouter.delete('/users/:userId', authenticate, requireAnyRole('administrador'), async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const result = await deleteUserById({ userId, actorUserId: req.user.sub });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete user' });
  }
});
