import { db } from '../../config/db.js';

// ── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d) => {
  if (!d) return null;
  if (typeof d === 'string') return d.slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapRow = (row) => ({
  id: row.id,
  employeeCode: row.employee_code,
  fullName: row.full_name,
  email: row.email || null,
  phone: row.phone || null,
  position: row.position || null,
  hireDate: formatDate(row.hire_date),
  isActive: row.is_active,
  notes: row.notes || null,
  userId: row.user_id || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Extrae hasta 3 iniciales del nombre completo (primera letra de cada palabra)
const getInitials = (fullName) => {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
};

// Genera TB-{INICIALES}-{SEQ} — único por número secuencial global
const generateCode = async (fullName) => {
  const initials = getInitials(fullName);
  const last = await db('employees').max('id as maxId').first();
  const next = (last?.maxId || 0) + 1;
  return `TB-${initials}-${String(next).padStart(3, '0')}`;
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
  const code = payload.employeeCode?.trim() || (await generateCode(payload.fullName));
  const normalizedEmail = payload.email?.trim().toLowerCase() || null;

  const existing = await db('employees').where({ employee_code: code }).first();
  if (existing) throw new Error(`Ya existe un colaborador con el código ${code}`);

  if (normalizedEmail) {
    const existingEmail = await db('employees').whereRaw('LOWER(email) = ?', [normalizedEmail]).first('id');
    if (existingEmail) {
      throw new Error('Ya existe un colaborador con ese correo electrónico');
    }
  }

  const inserted = await db('employees').insert({
    employee_code: code,
    full_name: payload.fullName.trim(),
    email: normalizedEmail,
    phone: payload.phone?.trim() || null,
    position: payload.position?.trim() || null,
    hire_date: payload.hireDate || null,
    is_active: payload.isActive !== false,
    notes: payload.notes?.trim() || null,
    user_id: payload.userId || null,
  }).returning(['id']);

  const first = Array.isArray(inserted) ? inserted[0] : inserted;
  const id = typeof first === 'object' ? first.id : first;
  return getEmployeeById(id);
};

export const updateEmployee = async (id, payload) => {
  const existing = await db('employees').where({ id }).first();
  if (!existing) throw new Error('Colaborador no encontrado');

  if (payload.email !== undefined && payload.email) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const emailOwner = await db('employees')
      .whereRaw('LOWER(email) = ?', [normalizedEmail])
      .whereNot({ id })
      .first('id');

    if (emailOwner) {
      throw new Error('Ya existe un colaborador con ese correo electrónico');
    }
  }

  const updates = {
    updated_at: db.fn.now(),
  };

  if (payload.fullName !== undefined) updates.full_name = payload.fullName.trim();
  if (payload.email !== undefined) updates.email = payload.email?.trim() || null;
  if (payload.phone !== undefined) updates.phone = payload.phone?.trim() || null;
  if (payload.position !== undefined) updates.position = payload.position?.trim() || null;
  if (payload.hireDate !== undefined) updates.hire_date = payload.hireDate || null;
  if (payload.isActive !== undefined) updates.is_active = payload.isActive;
  if (payload.notes !== undefined) updates.notes = payload.notes?.trim() || null;
  if (payload.userId !== undefined) updates.user_id = payload.userId || null;

  await db('employees').where({ id }).update(updates);
  return getEmployeeById(id);
};

export const deleteEmployee = async (id) => {
  const existing = await db('employees').where({ id }).first();
  if (!existing) throw new Error('Colaborador no encontrado');
  await db('employees').where({ id }).delete();
};

export const validateEmployeeExists = async (employeeCode) => {
  const row = await db('employees')
    .whereRaw('LOWER(employee_code) = ?', [employeeCode.toLowerCase()])
    .where({ is_active: true })
    .first();
  return row ? mapRow(row) : null;
};
