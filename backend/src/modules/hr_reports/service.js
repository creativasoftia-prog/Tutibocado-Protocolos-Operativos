import { db, isPostgresClient } from '../../config/db.js';

// ── helpers ──────────────────────────────────────────────────────────────────

const mapRow = (row) => ({
  id: row.id,
  reportNumber: row.report_number,
  employeeId: row.employee_id,
  employeeCode: row.employee_code || null,
  employeeName: row.employee_name || null,
  employeeDepartment: row.employee_department || null,
  employeeBranch: row.employee_branch || null,
  type: row.type,
  subject: row.subject,
  description: row.description,
  incidentDate: row.incident_date,
  status: row.status,
  hrResponse: row.hr_response || null,
  reviewedByUserId: row.reviewed_by_user_id || null,
  reviewedAt: row.reviewed_at || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const extractInsertedId = (insertResult) => {
  if (Array.isArray(insertResult) && insertResult.length > 0) {
    const first = insertResult[0];
    if (typeof first === 'number') return first;
    if (first && typeof first === 'object' && first.id != null) return first.id;
  }
  return null;
};

const generateReportNumber = async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const currentDateExpression = isPostgresClient()
    ? `CURRENT_DATE`
    : `CAST(GETDATE() AS DATE)`;

  const count = await db('hr_reports')
    .whereRaw(`CAST(created_at AS DATE) = ${currentDateExpression}`)
    .count('id as cnt')
    .first();
  const seq = ((count?.cnt || 0) + 1);
  return `REP-${dateStr}-${String(seq).padStart(3, '0')}`;
};

// ── exports ───────────────────────────────────────────────────────────────────

export const listReports = async ({ status, employeeId } = {}) => {
  const query = db('hr_reports as r')
    .leftJoin('employees as e', 'e.id', 'r.employee_id')
    .select(
      'r.*',
      'e.employee_code as employee_code',
      'e.full_name as employee_name',
      'e.department as employee_department',
      'e.branch as employee_branch'
    )
    .orderBy('r.created_at', 'desc');

  if (status) query.where('r.status', status);
  if (employeeId) query.where('r.employee_id', employeeId);

  const rows = await query;
  return rows.map(mapRow);
};

export const listReportsByEmployee = async (employeeId) => {
  return listReports({ employeeId });
};

export const getReportById = async (id) => {
  if (id == null || Number.isNaN(Number(id))) return null;

  const row = await db('hr_reports as r')
    .leftJoin('employees as e', 'e.id', 'r.employee_id')
    .select(
      'r.*',
      'e.employee_code as employee_code',
      'e.full_name as employee_name',
      'e.department as employee_department',
      'e.branch as employee_branch'
    )
    .where('r.id', id)
    .first();
  if (!row) return null;
  return mapRow(row);
};

export const createReport = async (payload) => {
  // Validar que el empleado existe y está activo
  const employee = await db('employees')
    .where({ id: payload.employeeId, is_active: true })
    .first();

  if (!employee) {
    throw new Error('El empleado no existe o no está activo en el sistema');
  }

  const reportNumber = await generateReportNumber();

  const insertResult = await db('hr_reports')
    .insert({
    report_number: reportNumber,
    employee_id: payload.employeeId,
    type: payload.type,
    subject: payload.subject.trim(),
    description: payload.description.trim(),
    incident_date: payload.incidentDate,
    status: 'pendiente',
    })
    .returning('id');

  const id = extractInsertedId(insertResult);
  if (id == null) {
    throw new Error('No se pudo obtener el id del reporte recién creado');
  }

  return getReportById(id);
};

export const updateReportStatus = async (id, payload, reviewerUserId) => {
  const existing = await db('hr_reports').where({ id }).first();
  if (!existing) throw new Error('Reporte no encontrado');

  await db('hr_reports').where({ id }).update({
    status: payload.status,
    hr_response: payload.hrResponse?.trim() || null,
    reviewed_by_user_id: reviewerUserId,
    reviewed_at: db.fn.now(),
    updated_at: db.fn.now(),
  });

  return getReportById(id);
};

export const deleteReport = async (id) => {
  const existing = await db('hr_reports').where({ id }).first();
  if (!existing) throw new Error('Reporte no encontrado');
  await db('hr_reports').where({ id }).delete();
};
