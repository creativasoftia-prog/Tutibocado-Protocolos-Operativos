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
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres').optional().or(z.literal('')),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  icon: z.string().max(80).optional().default(''),
  description: z.string().min(8, 'La descripción debe tener al menos 8 caracteres'),
  trigger: z.string().min(5, 'La situación detonante debe tener al menos 5 caracteres'),
  responsible: z.string().min(3, 'El responsable debe tener al menos 3 caracteres'),
  areas: z.array(z.string().min(2, 'Cada área debe tener al menos 2 caracteres')).min(1, 'Debes agregar al menos un área'),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  type: z.string().min(3, 'La categoría debe tener al menos 3 caracteres'),
  textSteps: z.array(z.string().min(5, 'Cada paso debe tener al menos 5 caracteres')).min(1, 'Debes agregar al menos un paso'),
  communicationRules: z.string().min(5, 'Las reglas de comunicación deben tener al menos 5 caracteres'),
  closingCriteria: z.string().min(5, 'Los criterios de cierre deben tener al menos 5 caracteres'),
  recommendations: z.string().min(5, 'Las recomendaciones deben tener al menos 5 caracteres'),
  visibleForRoles: z.array(z.string().min(3)).min(1, 'Selecciona al menos un rol visible')
});

protocolsRouter.post('/', requireAnyRole('administrador'), async (req, res) => {
  const parsed = createProtocolSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Datos inválidos del protocolo',
      errors: parsed.error.flatten()
    });
  }

  try {
    const protocol = await createProtocol({ payload: parsed.data, actorUserId: req.user.sub });
    return res.status(201).json(protocol);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo crear el protocolo' });
  }
});

const categorySchema = z.object({
  name: z.string().min(3, 'La categoría debe tener al menos 3 caracteres').max(120, 'La categoría no puede exceder 120 caracteres')
});

protocolsRouter.get('/categories/list', requireAnyRole('administrador'), async (_req, res) => {
  const categories = await listCategories();
  return res.json(categories);
});

protocolsRouter.post('/categories', requireAnyRole('administrador'), async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos de categoría inválidos', errors: parsed.error.flatten() });
  }

  try {
    const category = await createCategory({ name: parsed.data.name, actorUserId: req.user.sub });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo crear la categoría' });
  }
});

protocolsRouter.put('/categories/:categoryId', requireAnyRole('administrador'), async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos de categoría inválidos', errors: parsed.error.flatten() });
  }

  try {
    const category = await updateCategoryBySlug({
      categoryId: req.params.categoryId,
      name: parsed.data.name,
      actorUserId: req.user.sub
    });
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo actualizar la categoría' });
  }
});

protocolsRouter.delete('/categories/:categoryId', requireAnyRole('administrador'), async (req, res) => {
  try {
    const result = await deleteCategoryBySlug({ categoryId: req.params.categoryId, actorUserId: req.user.sub });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo eliminar la categoría' });
  }
});

protocolsRouter.put('/:protocolId', requireAnyRole('administrador'), async (req, res) => {
  const parsed = createProtocolSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Datos inválidos del protocolo',
      errors: parsed.error.flatten()
    });
  }

  try {
    const protocol = await updateProtocolBySlug({
      slug: req.params.protocolId,
      payload: parsed.data,
      actorUserId: req.user.sub
    });
    return res.json(protocol);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo actualizar el protocolo' });
  }
});

protocolsRouter.delete('/:protocolId', requireAnyRole('administrador'), async (req, res) => {
  try {
    const result = await deleteProtocolBySlug({ slug: req.params.protocolId, actorUserId: req.user.sub });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo eliminar el protocolo' });
  }
});
