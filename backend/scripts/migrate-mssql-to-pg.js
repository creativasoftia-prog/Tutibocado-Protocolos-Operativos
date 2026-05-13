import knex from 'knex';
import { createDatabaseConfig } from '../src/config/db.js';

const parseSqlServerTarget = (value) => {
  const normalized = String(value || '').replace(/\\+/g, '\\').trim();
  if (!normalized.includes('\\')) {
    return { server: normalized, instanceName: undefined };
  }

  const [server, instanceName] = normalized.split('\\');
  return { server, instanceName };
};

const sqlServerTarget = parseSqlServerTarget(
  process.env.MIGRATE_MSSQL_SERVER || 'ROBERTO\\ROBERTCH_SQL'
);

const sourceConfig = {
  client: 'mssql',
  connection: {
    server: sqlServerTarget.server,
    user: process.env.MIGRATE_MSSQL_USER || 'sa',
    password: process.env.MIGRATE_MSSQL_PASSWORD || 'roberto123',
    database: process.env.MIGRATE_MSSQL_DATABASE || 'tuttibocado sistema operativo',
    ...(sqlServerTarget.instanceName ? {} : { port: Number(process.env.MIGRATE_MSSQL_PORT || 1433) }),
    options: {
      encrypt: (process.env.MIGRATE_MSSQL_ENCRYPT || 'true') === 'true',
      trustServerCertificate: (process.env.MIGRATE_MSSQL_TRUST_CERT || 'true') === 'true',
      ...(sqlServerTarget.instanceName ? { instanceName: sqlServerTarget.instanceName } : {})
    }
  },
  pool: {
    min: 1,
    max: 5
  }
};

const targetConfig = createDatabaseConfig();
if (targetConfig.client !== 'pg') {
  throw new Error('El target actual no es PostgreSQL. Configura DB_CLIENT=pg antes de migrar.');
}

const sourceDb = knex(sourceConfig);
const targetDb = knex(targetConfig);

const tableOrder = [
  'roles',
  'users',
  'user_roles',
  'protocol_types',
  'protocols',
  'protocol_steps',
  'protocol_visibility_roles',
  'audit_logs',
  'employees',
  'hr_reports'
];

const tableIds = {
  roles: 'id',
  users: 'id',
  protocol_types: 'id',
  protocols: 'id',
  protocol_steps: 'id',
  audit_logs: 'id',
  employees: 'id',
  hr_reports: 'id'
};

const chunk = (rows, size) => {
  const out = [];
  for (let i = 0; i < rows.length; i += size) {
    out.push(rows.slice(i, i + size));
  }
  return out;
};

const readSourceRows = async (table) => {
  const idColumn = tableIds[table];
  if (idColumn) {
    return sourceDb(table).select('*').orderBy(idColumn, 'asc');
  }
  return sourceDb(table).select('*');
};

const resetSequenceIfNeeded = async (trx, table) => {
  const idColumn = tableIds[table];
  if (!idColumn) return;

  await trx.raw(`
    SELECT setval(
      pg_get_serial_sequence('${table}', '${idColumn}'),
      COALESCE((SELECT MAX(${idColumn}) FROM ${table}), 1),
      EXISTS (SELECT 1 FROM ${table})
    )
  `);
};

const migrate = async () => {
  console.log('Iniciando migracion de SQL Server -> PostgreSQL...');

  try {
    await sourceDb.raw('SELECT 1 AS ok');
    await targetDb.raw('SELECT 1 AS ok');
  } catch (error) {
    throw new Error(`No se pudo conectar a una de las bases: ${error.message}`);
  }

  await targetDb.transaction(async (trx) => {
    for (let i = tableOrder.length - 1; i >= 0; i -= 1) {
      const table = tableOrder[i];
      await trx(table).del();
    }

    for (const table of tableOrder) {
      const rows = await readSourceRows(table);
      console.log(`Copiando ${table}: ${rows.length} registros`);

      if (rows.length > 0) {
        const batches = chunk(rows, 200);
        for (const batch of batches) {
          await trx(table).insert(batch);
        }
      }

      await resetSequenceIfNeeded(trx, table);
    }
  });

  console.log('Migracion finalizada correctamente.');
};

try {
  await migrate();
} catch (error) {
  console.error('Error durante migracion:', error.message);
  process.exitCode = 1;
} finally {
  await Promise.all([sourceDb.destroy(), targetDb.destroy()]);
}
