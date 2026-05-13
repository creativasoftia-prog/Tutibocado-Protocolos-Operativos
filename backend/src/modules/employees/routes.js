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
  employeeCode: z.string().regex(/^EMP-\d{3,6}$/i, 'El código debe tener formato EMP-001').optional(),
  fullName: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres').max(180, 'El nombre completo no puede exceder 180 caracteres'),
  email: z.string().email('Ingresa un correo válido').optional().nullable(),
  phone: z.string().regex(/^\d{10}$/, 'El teléfono debe contener exactamente 10 dígitos').optional().nullable(),
  department: z.string().min(2, 'El departamento debe tener al menos 2 caracteres').max(120, 'El departamento no puede exceder 120 caracteres').optional().nullable(),
  branch: z.string().min(2, 'La sucursal debe tener al menos 2 caracteres').max(120, 'La sucursal no puede exceder 120 caracteres').optional().nullable(),
  position: z.string().min(2, 'El puesto debe tener al menos 2 caracteres').max(120, 'El puesto no puede exceder 120 caracteres').optional().nullable(),
  shift: z.string().min(2, 'El turno debe tener al menos 2 caracteres').max(80, 'El turno no puede exceder 80 caracteres').optional().nullable(),
  isActive: z.boolean().optional(),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional().nullable(),
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
