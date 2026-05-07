import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';
import {
  createCategory,
  createProtocol,
  deleteCategoryBySlug,
  deleteProtocolBySlug,
  listCategories,
  listVisibleProtocols,
  updateCategoryBySlug,
  updateProtocolBySlug
} from './service.js';

export const protocolsRouter = Router();

protocolsRouter.use(authenticate);

protocolsRouter.get('/', async (req, res) => {
  const roles = req.user.roles || [];
  const protocols = await listVisibleProtocols(roles);
  return res.json(protocols);
});

const createProtocolSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(3),
  description: z.string().min(8),
  trigger: z.string().min(5),
  responsible: z.string().min(3),
  areas: z.array(z.string().min(2)).min(1),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  type: z.string().min(3),
  textSteps: z.array(z.string().min(5)).min(1),
  communicationRules: z.string().min(5),
  closingCriteria: z.string().min(5),
  recommendations: z.string().min(5),
  visibleForRoles: z.array(z.string().min(3)).min(1)
});

protocolsRouter.post('/', requireAnyRole('administrador'), async (req, res) => {
  const parsed = createProtocolSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid protocol payload' });
  }

  try {
    const protocol = await createProtocol({ payload: parsed.data, actorUserId: req.user.sub });
    return res.status(201).json(protocol);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create protocol' });
  }
});

const categorySchema = z.object({
  name: z.string().min(3).max(120)
});

protocolsRouter.get('/categories/list', requireAnyRole('administrador'), async (_req, res) => {
  const categories = await listCategories();
  return res.json(categories);
});

protocolsRouter.post('/categories', requireAnyRole('administrador'), async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid category payload' });
  }

  try {
    const category = await createCategory({ name: parsed.data.name, actorUserId: req.user.sub });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create category' });
  }
});

protocolsRouter.put('/categories/:categoryId', requireAnyRole('administrador'), async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid category payload' });
  }

  try {
    const category = await updateCategoryBySlug({
      categoryId: req.params.categoryId,
      name: parsed.data.name,
      actorUserId: req.user.sub
    });
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update category' });
  }
});

protocolsRouter.delete('/categories/:categoryId', requireAnyRole('administrador'), async (req, res) => {
  try {
    const result = await deleteCategoryBySlug({ categoryId: req.params.categoryId, actorUserId: req.user.sub });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete category' });
  }
});

protocolsRouter.put('/:protocolId', requireAnyRole('administrador'), async (req, res) => {
  const parsed = createProtocolSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid protocol payload' });
  }

  try {
    const protocol = await updateProtocolBySlug({
      slug: req.params.protocolId,
      payload: parsed.data,
      actorUserId: req.user.sub
    });
    return res.json(protocol);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update protocol' });
  }
});

protocolsRouter.delete('/:protocolId', requireAnyRole('administrador'), async (req, res) => {
  try {
    const result = await deleteProtocolBySlug({ slug: req.params.protocolId, actorUserId: req.user.sub });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete protocol' });
  }
});
