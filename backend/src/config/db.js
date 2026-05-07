import knex from 'knex';
import { env } from './env.js';

const parseLegacyServerValue = (serverValue) => {
  const normalizedServerValue = serverValue.replace(/\\+/g, '\\').trim();

  if (!normalizedServerValue.includes('\\')) {
    return {
      server: normalizedServerValue,
      instanceName: undefined
    };
  }

  const [server, instanceName] = normalizedServerValue.split('\\');
  return { server, instanceName };
};

const resolveSqlServerTarget = () => {
  if (env.DB_INSTANCE) {
    return {
      server: env.DB_SERVER.trim(),
      instanceName: env.DB_INSTANCE
    };
  }

  return parseLegacyServerValue(env.DB_SERVER);
};

export const createDatabaseConfig = () => {
  const target = resolveSqlServerTarget();

  return {
    client: 'mssql',
    connection: {
      server: target.server,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      ...(target.instanceName ? {} : { port: env.DB_PORT }),
      options: {
        encrypt: env.DB_ENCRYPT,
        trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE,
        ...(target.instanceName ? { instanceName: target.instanceName } : {})
      }
    },
    pool: {
      min: 1,
      max: 1,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 500
    },
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  };
};

export const db = knex(createDatabaseConfig());

export const checkDatabaseConnection = async () => {
  try {
    await db.raw('SELECT 1 AS ok');
    return 'ok';
  } catch {
    return 'error';
  }
};
