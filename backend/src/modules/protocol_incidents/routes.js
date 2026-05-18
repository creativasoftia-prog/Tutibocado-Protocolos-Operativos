import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';
import { validateEmployeeExists } from '../employees/service.js';
import {
  createProtocolIncident,
  getProtocolIncidentsSummary,
  listProtocolIncidents,
  updateProtocolIncidentStatus,
} from './service.js';

export const protocolIncidentsRouter = Router();

protocolIncidentsRouter.use(authenticate);

const createSchema = z
  .object({
    protocolId: z.string().min(2, 'El protocolo es obligatorio'),
    employeeCode: z.string().regex(/^TB-[A-Z]{1,4}-\d{3,6}$/i, 'El código de colaborador debe tener formato TB-XXX-001'),
    entryType: z.enum(['ejecucion', 'sugerencia']),
    followedAllSteps: z.boolean().optional(),
    wasHelpful: z.boolean().optional(),
    documentation: z.string().max(4000).optional().nullable(),
    suggestion: z.string().max(4000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.entryType === 'ejecucion') {
      if (typeof data.followedAllSteps !== 'boolean') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debes indicar si se siguieron todos los pasos',
          path: ['followedAllSteps'],
        });
      }

      if (typeof data.wasHelpful !== 'boolean') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debes indicar si el protocolo fue útil',
          path: ['wasHelpful'],
        });
      }

      if (!data.documentation || data.documentation.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La documentación debe tener al menos 10 caracteres',
          path: ['documentation'],
        });
      }
    }

    if (data.entryType === 'sugerencia') {
      if (!data.suggestion || data.suggestion.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La sugerencia debe tener al menos 10 caracteres',
          path: ['suggestion'],
        });
      }
    }
  });

protocolIncidentsRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  }

  const employee = await validateEmployeeExists(parsed.data.employeeCode);
  if (!employee) {
    return res.status(404).json({
      message: 'No se encontró un colaborador activo con ese código. Verifica tu número de colaborador.',
    });
  }

  try {
    const created = await createProtocolIncident({
      protocolSlug: parsed.data.protocolId,
      employeeId: employee.id,
      entryType: parsed.data.entryType,
      followedAllSteps: parsed.data.followedAllSteps,
      wasHelpful: parsed.data.wasHelpful,
      documentation: parsed.data.documentation,
      suggestion: parsed.data.suggestion,
    });
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo registrar la incidencia' });
  }
});

protocolIncidentsRouter.get('/', requireAnyRole('administrador', 'capital_humano'), async (req, res) => {
  const { status, entryType, protocolId, employeeId } = req.query;
  const incidents = await listProtocolIncidents({
    status: status || undefined,
    entryType: entryType || undefined,
    protocolId: protocolId || undefined,
    employeeId: employeeId ? Number(employeeId) : undefined,
  });
  return res.json(incidents);
});

protocolIncidentsRouter.get('/summary', requireAnyRole('administrador', 'capital_humano'), async (_req, res) => {
  const summary = await getProtocolIncidentsSummary();
  return res.json(summary);
});

const updateStatusSchema = z.object({
  status: z.enum(['pendiente', 'revisado', 'resuelto']),
  reviewNotes: z.string().max(2000).optional().nullable(),
});

protocolIncidentsRouter.patch('/:id/status', requireAnyRole('administrador', 'capital_humano'), async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: 'ID inválido' });

  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  }

  try {
    const updated = await updateProtocolIncidentStatus({
      id,
      status: parsed.data.status,
      reviewNotes: parsed.data.reviewNotes,
      reviewerUserId: req.user.sub,
    });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'No se pudo actualizar la incidencia' });
  }
});