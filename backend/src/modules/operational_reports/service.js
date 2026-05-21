import { db } from '../../config/db.js';
import { createNotificationsForEntry } from '../notifications/service.js';

const FORM_LABELS = {
  demanda_no_atendida: 'Demanda No Atendida',
  baja_demanda: 'Baja Demanda',
  mas_vendidos: 'Más Vendidos',
};

const PREFIXES = {
  demanda_no_atendida: 'DEM',
  baja_demanda: 'BAJA',
  mas_vendidos: 'VEND',
};

const parseJson = (val) => {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return val; }
};

const mapReport = (row) => ({
  id: row.id,
  reportNumber: row.report_number,
  formType: row.form_type,
  branchName: row.branch_name,
  submittedByUserId: row.submitted_by_user_id,
  submittedByName: row.submitted_by_name,
  reportDate: row.report_date,
  shift: row.shift,
  periodLabel: row.period_label,
  items: parseJson(row.items),
  metadata: parseJson(row.metadata),
  managerNote: row.manager_note,
  encargadoName: row.encargado_name,
  createdAt: row.created_at,
});

const buildReportNumber = async (formType) => {
  const prefix = PREFIXES[formType] || 'OP';
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const full = `${prefix}-${today}-`;
  const last = await db('operational_reports')
    .whereLike('report_number', `${full}%`)
    .orderBy('report_number', 'desc')
    .first();
  const seq = last ? parseInt(last.report_number.slice(-3), 10) + 1 : 1;
  return `${full}${String(seq).padStart(3, '0')}`;
};

export const listOperationalReports = async ({ formType } = {}) => {
  let q = db('operational_reports as or2')
    .leftJoin('users as u', 'u.id', 'or2.submitted_by_user_id')
    .select('or2.*', 'u.full_name as submitted_by_name')
    .orderBy('or2.created_at', 'desc');
  if (formType) q = q.where('or2.form_type', formType);
  return (await q).map(mapReport);
};

export const listMyOperationalReports = async (userId) => {
  const rows = await db('operational_reports as or2')
    .leftJoin('users as u', 'u.id', 'or2.submitted_by_user_id')
    .where('or2.submitted_by_user_id', userId)
    .select('or2.*', 'u.full_name as submitted_by_name')
    .orderBy('or2.created_at', 'desc');
  return rows.map(mapReport);
};

export const createOperationalReport = async (userId, {
  formType, reportDate, shift, periodLabel,
  items, metadata, managerNote, encargadoName,
}) => {
  const userRow = await db('users').where({ id: userId }).select('branch_name').first();
  const reportNumber = await buildReportNumber(formType);

  const [row] = await db('operational_reports').insert({
    report_number: reportNumber,
    form_type: formType,
    branch_name: userRow?.branch_name || null,
    submitted_by_user_id: userId,
    report_date: reportDate,
    shift: shift || null,
    period_label: periodLabel || null,
    items: JSON.stringify(items),
    metadata: metadata ? JSON.stringify(metadata) : null,
    manager_note: managerNote || null,
    encargado_name: encargadoName || null,
  }).returning('*');

  const label = FORM_LABELS[formType] || formType;
  createNotificationsForEntry({
    type: 'operativo',
    title: `Nuevo reporte: ${label}`,
    body: `Sucursal ${userRow?.branch_name || '—'} | ${reportDate}`,
    entityType: 'operational_report',
    entityId: row.id,
  }).catch((e) => console.error('[notify operational_report]', e));

  return { ...mapReport(row), reportNumber };
};

export const deleteOperationalReport = async (id) => {
  const count = await db('operational_reports').where({ id }).delete();
  if (!count) throw new Error('Reporte no encontrado');
};
