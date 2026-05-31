import { db } from '../../config/db.js';
import { createNotificationsForEntry } from '../notifications/service.js';

const mapType = (row) => ({
  id: row.id,
  name: row.name,
  isActive: row.is_active,
  createdAt: row.created_at,
});

const parseJson = (val) => {
  if (!val) return [];
  if (typeof val === 'object' && !Buffer.isBuffer(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
};

const mapReport = (row) => ({
  id: row.id,
  reportNumber: row.report_number,
  branchName: row.branch_name,
  submittedByUserId: row.submitted_by_user_id,
  submittedByName: row.submitted_by_name || null,
  reportDate: row.report_date,
  items: parseJson(row.items),
  generalNotes: row.general_notes,
  createdAt: row.created_at,
});

export const listStockTypes = async (onlyActive = false) => {
  let q = db('stock_report_types').orderBy('name');
  if (onlyActive) q = q.where({ is_active: true });
  return (await q).map(mapType);
};

export const createStockType = async ({ name }) => {
  const [row] = await db('stock_report_types').insert({ name }).returning('*');
  return mapType(row);
};

export const updateStockType = async (id, { name, isActive }) => {
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (isActive !== undefined) updates.is_active = isActive;
  const [row] = await db('stock_report_types').where({ id }).update(updates).returning('*');
  if (!row) throw new Error('Tipo no encontrado');
  return mapType(row);
};

export const deleteStockType = async (id) => {
  const count = await db('stock_report_types').where({ id }).delete();
  if (!count) throw new Error('Tipo no encontrado');
};

export const listStockReports = async () => {
  const rows = await db('stock_reports as sr')
    .leftJoin('users as u', 'u.id', 'sr.submitted_by_user_id')
    .select('sr.*', 'u.full_name as submitted_by_name')
    .orderBy('sr.created_at', 'desc');
  return rows.map(mapReport);
};

export const listMyStockReports = async (userId) => {
  const rows = await db('stock_reports as sr')
    .leftJoin('users as u', 'u.id', 'sr.submitted_by_user_id')
    .where('sr.submitted_by_user_id', userId)
    .select('sr.*', 'u.full_name as submitted_by_name')
    .orderBy('sr.created_at', 'desc');
  return rows.map(mapReport);
};

const buildReportNumber = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `EXI-${today}-`;
  const last = await db('stock_reports')
    .whereLike('report_number', `${prefix}%`)
    .orderBy('report_number', 'desc')
    .first();
  const seq = last ? parseInt(last.report_number.slice(-3), 10) + 1 : 1;
  return `${prefix}${String(seq).padStart(3, '0')}`;
};

export const createStockReport = async (userId, { items, generalNotes, reportDate }) => {
  const userRow = await db('users').where({ id: userId }).select('branch_name', 'full_name').first();
  const reportNumber = await buildReportNumber();

  const [row] = await db('stock_reports').insert({
    report_number: reportNumber,
    branch_name: userRow?.branch_name || null,
    submitted_by_user_id: userId,
    report_date: reportDate || new Date().toISOString().slice(0, 10),
    items: JSON.stringify(items || []),
    general_notes: generalNotes || null,
  }).returning('*');

  createNotificationsForEntry({
    type: 'existencias',
    title: 'Reporte de Existencias',
    body: `Sucursal ${userRow?.branch_name || '—'} | ${reportDate || 'hoy'} | ${(items || []).length} productos`,
    entityType: 'stock_report',
    entityId: row.id,
  }).catch((e) => console.error('[notify stock_report]', e));

  return mapReport({ ...row, submitted_by_name: userRow?.full_name || null });
};

export const deleteStockReport = async (id) => {
  const count = await db('stock_reports').where({ id }).delete();
  if (!count) throw new Error('Reporte no encontrado');
};
