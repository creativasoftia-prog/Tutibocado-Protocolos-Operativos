import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from './service.js';

export const notificationsRouter = Router();
notificationsRouter.use(authenticate);

notificationsRouter.get('/unread-count', async (req, res, next) => {
  try {
    const count = await getUnreadCount(req.user.sub);
    return res.json({ count });
  } catch (err) {
    next(err);
  }
});

// PATCH /read-all debe ir ANTES de PATCH /:id/read para evitar conflicto de rutas
notificationsRouter.patch('/read-all', async (req, res, next) => {
  try {
    await markAllAsRead(req.user.sub);
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.get('/', async (req, res, next) => {
  try {
    const notifications = await listNotifications(req.user.sub);
    return res.json(notifications);
  } catch (err) {
    next(err);
  }
});

notificationsRouter.patch('/:id/read', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || id < 1) return res.status(400).json({ message: 'ID inválido' });
    await markAsRead(id, req.user.sub);
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
