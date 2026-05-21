import { db } from '../../config/db.js';

const NOTIFY_ROLES = ['administrador', 'capital_humano', 'supervisor'];

const mapRow = (row) => ({
  id: row.id,
  type: row.type,
  title: row.title,
  body: row.body,
  entityType: row.entity_type,
  entityId: row.entity_id,
  isRead: row.is_read,
  createdAt: row.created_at,
});

/**
 * Crea una notificación para cada usuario activo con rol admin/capital_humano/supervisor.
 * Se llama de forma fire-and-forget; los errores no deben romper el flujo principal.
 */
export const createNotificationsForEntry = async ({ type, title, body, entityType, entityId }) => {
  const users = await db('users as u')
    .innerJoin('user_roles as ur', 'ur.user_id', 'u.id')
    .innerJoin('roles as r', 'r.id', 'ur.role_id')
    .whereIn('r.name', NOTIFY_ROLES)
    .where('u.is_active', true)
    .distinct('u.id as userId')
    .select('u.id as userId');

  if (users.length === 0) return;

  const rows = users.map((u) => ({
    user_id: u.userId,
    type,
    title,
    body: body || '',
    entity_type: entityType,
    entity_id: entityId,
    is_read: false,
  }));

  await db('notifications').insert(rows);
};

export const listNotifications = async (userId) => {
  const rows = await db('notifications')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(50);
  return rows.map(mapRow);
};

export const getUnreadCount = async (userId) => {
  const result = await db('notifications')
    .where({ user_id: userId, is_read: false })
    .count('id as count')
    .first();
  return Number(result?.count || 0);
};

export const markAsRead = async (notificationId, userId) => {
  // Eliminar al leer: las notificaciones no se acumulan
  await db('notifications')
    .where({ id: notificationId, user_id: userId })
    .delete();
};

export const markAllAsRead = async (userId) => {
  await db('notifications')
    .where({ user_id: userId })
    .delete();
};

/**
 * Crea una notificación para un usuario específico (ej. respuesta a un reporte).
 */
export const createNotificationForUser = async (userId, { type, title, body, entityType, entityId }) => {
  if (!userId) return;
  await db('notifications').insert({
    user_id: userId,
    type,
    title,
    body: body || '',
    entity_type: entityType,
    entity_id: entityId,
    is_read: false,
  });
};
