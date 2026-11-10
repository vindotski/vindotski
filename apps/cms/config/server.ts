import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  // Loopback by default: in production, only the reverse proxy reaches Strapi.
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 3000),
  // The public URL (https://vinski.xyz in production), for admin links and uploads.
  url: env('PUBLIC_URL'),
  // Behind Caddy or a Cloudflare Tunnel: trust X-Forwarded-*, so requests count
  // as https (secure admin cookies) and rate limits see the visitor's IP.
  // Strapi only reads `proxy.koa`; a bare boolean is ignored.
  proxy: { koa: env.bool('IS_PROXIED', false) },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
