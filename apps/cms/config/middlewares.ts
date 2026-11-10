import type { Core } from '@strapi/strapi';

const megabytes = (n: number) => n * 1024 * 1024;

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  // The sites read the API server-side, so no browser needs CORS: only the
  // admin, on Strapi's own origin.
  { name: 'strapi::cors', config: { origin: [env('PUBLIC_URL')] } },
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '1mb',
      formLimit: '1mb',
      textLimit: '1mb',
      formidable: { maxFileSize: megabytes(50) },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
