import { db, isPostgresClient } from '../../config/db.js';

const mapRow = (row) => ({
  id: row.id,
  incidentNumber: row.incident_number,
  protocolId: row.protocol_slug,
  protocolCode: row.protocol_code,
  protocolName: row.protocol_name,
  employeeId: row.employee_id,
  employeeCode: row.employee_code,
  employeeName: row.employee_name,
  entryType: row.entry_type,
  followedAllSteps: row.followed_all_steps,
  wasHelpful: row.was_helpful,
  documentation: row.documentation || null,
  suggestion: row.suggestion || null,
  status: row.status,
  reviewNotes: row.review_notes || null,
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

const generateIncidentNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const currentDateExpression = isPostgresClient() ? 'CURRENT_DATE' : 'CAST(GETDATE() AS DATE)';

  const count = await db('protocol_incidents')
    .whereRaw(`CAST(created_at AS DATE) = ${currentDateExpression}`)
    .count('id as cnt')
    .first();

  const seq = (Number(count?.cnt || 0) + 1);
  return `PIN-${dateStr}-${String(seq).padStart(3, '0')}`;
};

const baseSelect = () =>
  db('protocol_incidents as pi')
    .innerJoin('protocols as p', 'p.id', 'pi.protocol_id')
    .innerJoin('employees as e', 'e.id', 'pi.employee_id')
    .select(
      'pi.*',
      'p.slug as protocol_slug',
      'p.code as protocol_code',
      'p.name as protocol_name',
      'e.employee_code as employee_code',
      'e.full_name as employee_name'
    );

export const createProtocolIncident = async ({
  protocolSlug,
  employeeId,
  entryType,
  followedAllSteps,
  wasHelpful,
  documentation,
  suggestion,
}) => {
  const protocol = await db('protocols').where({ slug: protocolSlug }).first('id');
  if (!protocol) throw new Error('Protocolo no encontrado');

  const incidentNumber = await generateIncidentNumber();

  const insertResult = await db('protocol_incidents')
    .insert({
      incident_number: incidentNumber,
      protocol_id: protocol.id,
      employee_id: employeeId,
      entry_type: entryType,
      followed_all_steps: followedAllSteps ?? null,
      was_helpful: wasHelpful ?? null,
      documentation: documentation?.trim() || null,
      suggestion: suggestion?.trim() || null,
      status: 'pendiente',
    })
    .returning('id');

  const id = extractInsertedId(insertResult);
  if (id == null) {
    throw new Error('No se pudo registrar la incidencia del protocolo');
  }

  const created = await baseSelect().where('pi.id', id).first();
  return mapRow(created);
};

export const listProtocolIncidents = async ({ status, entryType, protocolId, employeeId } = {}) => {
  const query = baseSelect().orderBy('pi.created_at', 'desc');

  if (status) query.where('pi.status', status);
  if (entryType) query.where('pi.entry_type', entryType);
  if (protocolId) query.where('p.slug', protocolId);
  if (employeeId) query.where('pi.employee_id', employeeId);

  const rows = await query;
  return rows.map(mapRow);
};

export const getProtocolIncidentsSummary = async () => {
  const [totals] = await db('protocol_incidents')
    .count('id as total')
    .sum({ pending: db.raw(`CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END`) })
    .sum({ reviewed: db.raw(`CASE WHEN status = 'revisado' THEN 1 ELSE 0 END`) })
    .sum({ resolved: db.raw(`CASE WHEN status = 'resuelto' THEN 1 ELSE 0 END`) })
    .sum({ executions: db.raw(`CASE WHEN entry_type = 'ejecucion' THEN 1 ELSE 0 END`) })
    .sum({ suggestions: db.raw(`CASE WHEN entry_type = 'sugerencia' THEN 1 ELSE 0 END`) })
    .sum({ helpful: db.raw(`CASE WHEN was_helpful = true THEN 1 ELSE 0 END`) })
    .sum({ notHelpful: db.raw(`CASE WHEN was_helpful = false THEN 1 ELSE 0 END`) });

  const byProtocolRows = await db('protocol_incidents as pi')
    .innerJoin('protocols as p', 'p.id', 'pi.protocol_id')
    .select('p.slug as protocolId', 'p.code as protocolCode', 'p.name as protocolName')
    .count('pi.id as total')
    .sum({ notHelpful: db.raw(`CASE WHEN pi.was_helpful = false THEN 1 ELSE 0 END`) })
    .groupBy('p.slug', 'p.code', 'p.name')
    .orderBy('total', 'desc')
    .limit(8);

  const toNumber = (value) => Number(value || 0);
  return {
    total: toNumber(totals?.total),
    pending: toNumber(totals?.pending),
    reviewed: toNumber(totals?.reviewed),
    resolved: toNumber(totals?.resolved),
    executions: toNumber(totals?.executions),
    suggestions: toNumber(totals?.suggestions),
    helpful: toNumber(totals?.helpful),
    notHelpful: toNumber(totals?.notHelpful),
    byProtocol: byProtocolRows.map((row) => ({
      protocolId: row.protocolId,
      protocolCode: row.protocolCode,
      protocolName: row.protocolName,
      total: toNumber(row.total),
      notHelpful: toNumber(row.notHelpful),
    })),
  };
};

export const updateProtocolIncidentStatus = async ({ id, status, reviewNotes, reviewerUserId }) => {
  const existing = await db('protocol_incidents').where({ id }).first('id');
  if (!existing) {
    throw new Error('Incidencia no encontrada');
  }

  await db('protocol_incidents')
    .where({ id })
    .update({
      status,
      review_notes: reviewNotes?.trim() || null,
      reviewed_by_user_id: reviewerUserId,
      reviewed_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

  const updated = await baseSelect().where('pi.id', id).first();
  return mapRow(updated);
};