# apps/cms: vinski.xyz

Strapi 5 with Postgres. The content source for both sites, over REST (admin at `/admin`, API at `/api`).

## Content types

- **Change content types only through the schema files** (`src/api/*/content-types/*/schema.json`,
  `src/components/**`), committed with the change. Never create or edit them in the admin's
  Content-Type Builder on a deployed instance, and never by hand in the database.
- A schema change that renames or removes a field breaks the sites' CMS clients
  (`apps/front/src/lib/cms.ts`, `apps/back/lib/cms.ts`): update them, and their types, in the same change.
- Field `site` on shared types says where an entry shows: `front`, `back` or `both`.

## Rules

- Env only: database credentials, app keys, salts and URLs come from env; `.env.example` lists them.
- Each site reads with its own read-only API token. Production reads `status=published`; dev reads
  `status=draft` with a separate preview token.
- Strapi has no vetted agent skill; follow the Strapi 5 docs and keep plugins to a minimum
  (each new one needs an ADR and a pinned version).
