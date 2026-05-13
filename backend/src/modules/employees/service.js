import { db } from '../../config/db.js';

// ── helpers ──────────────────────────────────────────────────────────────────

const mapRow = (row) => ({
  id: row.id,
  employeeCode: row.employee_code,
  fullName: row.full_name,
  email: row.email || null,
  phone: row.phone || null,
  department: row.department || null,
  branch: row.branch || null,
  position: row.position || null,
  shift: row.shift || null,
  isActive: row.is_active,
  notes: row.notes || null,
  userId: row.user_id || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const generateCode = async () => {
  const last = await db('employees').max('id as maxId').first();
  const next = (last?.maxId || 0) + 1;
  return `EMP-${String(next).padStart(3, '0')}`;
};

// ── exports ───────────────────────────────────────────────────────────────────

export const listEmployees = async () => {
  const rows = await db('employees').orderBy('full_name', 'asc');
  return rows.map(mapRow);
};

export const getEmployeeById = async (id) => {
  const row = await db('employees').where({ id }).first();
  if (!row) return null;
  return mapRow(row);
};

export const findEmployeeByCode = async (code) => {
  const row = await db('employees').whereRaw('LOWER(employee_code) = ?', [code.toLowerCase()]).first();
  if (!row) return null;
  return mapRow(row);
};

export const createEmployee = async (payload) => {
  const code = payload.employeeCode?.trim() || (await generateCode());

  const existing = await db('employees').where({ employee_code: code }).first();
  if (existing) throw new Error(`Ya existe un empleado con el código ${code}`);

  const [id] = await db('employees').insert({
    employee_code: code,
    full_name: payload.fullName.trim(),
    email: payload.email?.trim() || null,
    phone: payload.phone?.trim() || null,
    department: payload.department?.trim() || null,
    branch: payload.branch?.trim() || null,
    position: payload.position?.trim() || null,
    shift: payload.shift?.trim() || null,
    is_active: payload.isActive !== false,
    notes: payload.notes?.trim() || null,
    user_id: payload.userId || null,
  });

  return getEmployeeById(id);
};

export const updateEmployee = async (id, payload) => {
  const existing = await db('employees').where({ id }).first();
  if (!existing) throw new Error('Empleado no encontrado');

  const updates = {
    updated_at: db.fn.now(),
  };

  if (payload.fullName !== undefined) updates.full_name = payload.fullName.trim();
  if (payload.email !== undefined) updates.email = payload.email?.trim() || null;
  if (payload.phone !== undefined) updates.phone = payload.phone?.trim() || null;
  if (payload.department !== undefined) updates.department = payload.department?.trim() || null;
  if (payload.branch !== undefined) updates.branch = payload.branch?.trim() || null;
  if (payload.position !== undefined) updates.position = payload.position?.trim() || null;
  if (payload.shift !== undefined) updates.shift = payload.shift?.trim() || null;
  if (payload.isActive !== undefined) updates.is_active = payload.isActive;
  if (payload.notes !== undefined) updates.notes = payload.notes?.trim() || null;
  if (payload.userId !== undefined) updates.user_id = payload.userId || null;

  await db('employees').where({ id }).update(updates);
  return getEmployeeById(id);
};

export const deleteEmployee = async (id) => {
  const existing = await db('employees').where({ id }).first();
  if (!existing) throw new Error('Empleado no encontrado');
  await db('employees').where({ id }).delete();
};

export const validateEmployeeExists = async (employeeCode) => {
  const row = await db('employees')
    .whereRaw('LOWER(employee_code) = ?', [employeeCode.toLowerCase()])
    .where({ is_active: true })
    .first();
  return row ? mapRow(row) : null;
};
