import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth.js';
import {
  listOperationalReports, listMyOperationalReports,
  createOperationalReport, deleteOperationalReport,
} from './service.js';

export const operationalReportsRouter = Router();

const isAdmin = (req, res, next) => {
  if (!req.user.roles?.includes('administrador')) return res.status(403).json({ message: 'Forbidden' });
  next();
};
const isAdminOrCH = (req, res, next) => {
  const roles = req.user.roles || [];
  if (!roles.includes('administrador') && !roles.includes('capital_humano') && !roles.includes('supervisor')) {
    return res.status(403).json({ message: 'Sin permiso' });
  }
  next();
};

const reportSchema = z.object({
  formType: z.enum(['demanda_no_atendida', 'baja_demanda', 'mas_vendidos']),
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  shift: z.string().optional().nullable(),
  periodLabel: z.string().max(100).optional().nullable(),
  items: z.array(z.record(z.unknown())).min(1),
  metadata: z.record(z.unknown()).optional().nullable(),
  managerNote: z.string().max(1000).optional().nullable(),
  encargadoName: z.string().max(200).optional().nullable(),
});

// /my MUST come before /
operationalReportsRouter.get('/my', authenticate, async (req, res) => {
  try { res.json(await listMyOperationalReports(req.user.sub)); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

operationalReportsRouter.get('/', authenticate, isAdminOrCH, async (req, res) => {
  try { res.json(await listOperationalReports({ formType: req.query.formType || null })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

operationalReportsRouter.post('/', authenticate, async (req, res) => {
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.errors[0]?.message || 'Datos inválidos' });
  try {
    const report = await createOperationalReport(req.user.sub, parsed.data);
    res.status(201).json(report);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

operationalReportsRouter.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try { await deleteOperationalReport(parseInt(req.params.id, 10)); res.json({ ok: true }); }
  catch (e) { res.status(e.message.includes('encontrado') ? 404 : 500).json({ message: e.message }); }
});
