import type { Core } from '@strapi/strapi';

// Postgres only (ADR 0006). Every value comes from env; see .env.example.
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => ({
  connection: {
    client: 'postgres' as const,
    connection: {
      host: env('DATABASE_HOST')!,
      port: env.int('DATABASE_PORT')!,
      database: env('DATABASE_NAME')!,
      user: env('DATABASE_USERNAME')!,
      password: env('DATABASE_PASSWORD')!,
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
      schema: env('DATABASE_SCHEMA', 'public'),
    },
    pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
  },
});

export default config;
