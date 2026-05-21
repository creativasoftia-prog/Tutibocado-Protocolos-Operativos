import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/db.js';
import { authRouter } from './modules/auth/routes.js';
import { rolesRouter } from './modules/roles/routes.js';
import { protocolsRouter } from './modules/protocols/routes.js';
import { employeesRouter } from './modules/employees/routes.js';
import { hrReportsRouter } from './modules/hr_reports/routes.js';
import { protocolIncidentsRouter } from './modules/protocol_incidents/routes.js';
import { notificationsRouter } from './modules/notifications/routes.js';
import { stockReportsRouter } from './modules/stock_reports/routes.js';
import { operationalReportsRouter } from './modules/operational_reports/routes.js';

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', async (_req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({ status: 'ok', app: env.APP_NAME, db: dbStatus });
});

app.use('/api/auth', authRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/protocols', protocolsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/hr-reports', hrReportsRouter);
app.use('/api/protocol-incidents', protocolIncidentsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/stock-reports', stockReportsRouter);
app.use('/api/operational-reports', operationalReportsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});
