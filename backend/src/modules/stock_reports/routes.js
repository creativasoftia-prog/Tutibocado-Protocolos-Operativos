import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  listStockTypes, createStockType, updateStockType, deleteStockType,
  listStockReports, listMyStockReports, createStockReport, deleteStockReport,
} from './service.js';

export const stockReportsRouter = Router();

const isAdmin = (req, res, next) => {
  if (!req.user.roles?.includes('administrador')) return res.status(403).json({ message: 'Forbidden' });
  next();
};
const isAdminOrCH = (req, res, next) => {
  const roles = req.user.roles || [];
  if (!roles.includes('administrador') && !roles.includes('capital_humano') && !roles.includes('supervisor')) {
    return res.status(403).json({ message: 'Sin permiso' });
  }
  next();
};

// Types
stockReportsRouter.get('/types', authenticate, async (_req, res) => {
  try { res.json(await listStockTypes()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

stockReportsRouter.post('/types', authenticate, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'name requerido' });
  try { res.status(201).json(await createStockType({ name: name.trim() })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

stockReportsRouter.put('/types/:id', authenticate, isAdmin, async (req, res) => {
  try { res.json(await updateStockType(parseInt(req.params.id, 10), req.body)); }
  catch (e) { res.status(e.message.includes('encontrado') ? 404 : 500).json({ message: e.message }); }
});

stockReportsRouter.delete('/types/:id', authenticate, isAdmin, async (req, res) => {
  try { await deleteStockType(parseInt(req.params.id, 10)); res.json({ ok: true }); }
  catch (e) { res.status(e.message.includes('encontrado') ? 404 : 500).json({ message: e.message }); }
});

// Reports – /my MUST come before /
stockReportsRouter.get('/my', authenticate, async (req, res) => {
  try { res.json(await listMyStockReports(req.user.sub)); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

stockReportsRouter.get('/', authenticate, isAdminOrCH, async (_req, res) => {
  try { res.json(await listStockReports()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

stockReportsRouter.post('/', authenticate, async (req, res) => {
  const { items, generalNotes, reportDate } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Debes ingresar al menos un producto con cantidad' });
  }
  try {
    const report = await createStockReport(req.user.sub, {
      items,
      generalNotes: generalNotes || null,
      reportDate: reportDate || null,
    });
    res.status(201).json(report);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

stockReportsRouter.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try { await deleteStockReport(parseInt(req.params.id, 10)); res.json({ ok: true }); }
  catch (e) { res.status(e.message.includes('encontrado') ? 404 : 500).json({ message: e.message }); }
});
