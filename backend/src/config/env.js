import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().default('Tutibocado Protocolos API'),
  PORT: z.coerce.number().default(4100),

  DB_SERVER: z.string().min(1),
  DB_INSTANCE: z.string().optional().default(''),
  DB_PORT: z.coerce.number().int().positive().default(1433),
  DB_DATABASE: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_ENCRYPT: z
    .string()
    .optional()
    .transform((value) => value === 'true')
    .default('false'),
  DB_TRUST_SERVER_CERTIFICATE: z
    .string()
    .optional()
    .transform((value) => value !== 'false')
    .default('true'),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default('12h'),

  ADMIN_NAME: z.string().default('Administrador General'),
  ADMIN_EMAIL: z.string().email().default('admin@tutibocado.local'),
  ADMIN_PASSWORD: z.string().min(6).default('Admin123!')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
