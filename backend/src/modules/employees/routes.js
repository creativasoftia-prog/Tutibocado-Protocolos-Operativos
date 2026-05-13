import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAnyRole } from '../../middleware/auth.js';
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee,
  validateEmployeeExists,
} from './service.js';

export const employeesRouter = Router();

employeesRouter.use(authenticate);

// ── Validar que un empleado existe (todos los roles, para el formulario de reportes)
employeesRouter.get('/validate/:code', async (req, res) => {
  const employee = await validateEmployeeExists(req.params.code);
  if (!employee) {
    return res.status(404).json({ message: 'No se encontró un empleado activo con ese código' });
  }
  return res.json(employee);
});

// ── Listar (admin + capital_humano)
employeesRouter.get('/', requireAnyRole('administrador', 'capital_humano'), async (_req, res) => {
  const employees = await listEmployees();
  return res.json(employees);
});

const employeeSchema = z.object({
  employeeCode: z.string().min(1).max(40).optional(),
  fullName: z.string().min(3).max(180),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  department: z.string().max(120).optional().nullable(),
  branch: z.string().max(120).optional().nullable(),
  position: z.string().max(120).optional().nullable(),
  shift: z.string().max(80).optional().nullable(),
  isActive: z.boolean().optional(),
  notes: z.string().max(1000).optional().nullable(),
  userId: z.number().int().positive().optional().nullable(),
});

// ── Crear (admin + capital_humano)
employeesRouter.post('/', requireAnyRole('administrador', 'capital_humano'), async (req, res) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  }
  try {
    const employee = await createEmployee(parsed.data);
    return res.status(201).json(employee);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateSchema = employeeSchema.partial();

// ── Actualizar (admin + capital_humano)
employeesRouter.put('/:id', requireAnyRole('administrador', 'capital_humano'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ message: 'ID inválido' });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  }
  try {
    const employee = await updateEmployee(id, parsed.data);
    return res.json(employee);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ── Eliminar (solo admin)
employeesRouter.delete('/:id', requireAnyRole('administrador'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ message: 'ID inválido' });
  try {
    await deleteEmployee(id);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
