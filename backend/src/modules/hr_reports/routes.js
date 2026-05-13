import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';
import {
  createReport,
  deleteReport,
  getReportById,
  listReports,
  listReportsByEmployee,
  updateReportStatus,
} from './service.js';
import { validateEmployeeExists } from '../employees/service.js';

export const hrReportsRouter = Router();

hrReportsRouter.use(authenticate);

// ── Listar todos (solo capital_humano y admin)
hrReportsRouter.get('/', requireAnyRole('administrador', 'capital_humano'), async (req, res) => {
  const { status, employeeId } = req.query;
  const reports = await listReports({
    status: status || undefined,
    employeeId: employeeId ? parseInt(employeeId, 10) : undefined,
  });
  return res.json(reports);
});

// ── Listar por empleado (propio — cualquier rol autenticado)
hrReportsRouter.get('/employee/:employeeId', async (req, res) => {
  const employeeId = parseInt(req.params.employeeId, 10);
  if (!employeeId) return res.status(400).json({ message: 'ID inválido' });
  const reports = await listReportsByEmployee(employeeId);
  return res.json(reports);
});

// ── Obtener uno
hrReportsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ message: 'ID inválido' });
  const report = await getReportById(id);
  if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });
  return res.json(report);
});

const createReportSchema = z.object({
  employeeCode: z.string().min(1),           // se valida contra BD
  type: z.enum(['falta', 'enfermedad', 'situacion', 'permiso', 'otro']),
  subject: z.string().min(5).max(220),
  description: z.string().min(10),
  incidentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// ── Crear reporte (todos los roles — valida el empleado por código)
hrReportsRouter.post('/', async (req, res) => {
  const parsed = createReportSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  }

  const employee = await validateEmployeeExists(parsed.data.employeeCode);
  if (!employee) {
    return res.status(404).json({
      message: 'No se encontró un empleado activo con ese código. Verifica tu número de empleado.',
    });
  }

  try {
    const report = await createReport({
      employeeId: employee.id,
      type: parsed.data.type,
      subject: parsed.data.subject,
      description: parsed.data.description,
      incidentDate: parsed.data.incidentDate,
    });
    return res.status(201).json(report);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateStatusSchema = z.object({
  status: z.enum(['pendiente', 'revisado', 'aceptado', 'rechazado']),
  hrResponse: z.string().max(2000).optional().nullable(),
});

// ── Actualizar estado (solo capital_humano y admin)
hrReportsRouter.patch('/:id/status', requireAnyRole('administrador', 'capital_humano'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ message: 'ID inválido' });

  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  }

  try {
    const report = await updateReportStatus(id, parsed.data, req.user.sub);
    return res.json(report);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ── Eliminar (solo admin)
hrReportsRouter.delete('/:id', requireAnyRole('administrador'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await deleteReport(id);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
