# Content Management System

Strapi 5 with Postgres, at vinski.xyz (admin at `/admin`, REST API at `/api`). It's the content
source for both vin.ski and ski.vin (ADR 0006).

## Run

```bash
cp .env.example .env            # then fill in the secrets and the database password
pnpm --filter cms db:up         # local Postgres (docker-compose.yml), on 127.0.0.1:$DATABASE_PORT
pnpm --filter cms dev           # http://localhost:3000/admin
pnpm --filter cms build && pnpm --filter cms start
pnpm --filter cms db:down
```

Locally, the first visit to `/admin` creates the admin user. **On a server, create it before the
site is reachable**, or whoever opens `/admin` first becomes the super admin:

```bash
pnpm --filter cms strapi admin:create-user --firstname=… --email=… --password=…
```

## Security

- **No public accounts:** there's no users-permissions plugin, so there's no sign-up, login or
  password reset on the API. The sites read with API tokens only, and the Public role has nothing.
- **Behind a proxy** (Caddy, Cloudflare): set `IS_PROXIED=true`, so Strapi trusts `X-Forwarded-*`.
  Requests then count as https, which marks the admin cookies secure, and rate limits see each
  visitor's IP. `HOST` defaults to `127.0.0.1`, so only the proxy reaches Strapi.
- **Production:** `NODE_ENV=production` for secure cookies and terse errors.
  `STRAPI_TELEMETRY_DISABLED=true` sends nothing to Strapi.
- **CORS** allows only `PUBLIC_URL`, the admin's own origin. The sites read server-side, so they
  need no CORS.
- **Uploads:** images, video and audio only, up to 50 MB each (`config/plugins.ts`,
  `config/middlewares.ts`). SVG and executables are refused.

## Content types

Change them through the schema files in `src/` (or the admin's Content-Type Builder in `dev`,
which writes the same files), never by hand in the database.

| Type | Kind | |
|---|---|---|
| `profile` | single | The person behind both sites: name, headline, role, availability, bio, location, avatar, links. |
| `project` | collection | Title, slug, summary, body, URLs, cover, `site` (`front`, `back` or `both`), order. |
| `fragment` | collection | Pieces of the Underground (ski.vin): title, slug, `kind` (`process`, `note`, `art`, `music`, `photo` or `project`), body, media. |
| `shared.link` | component | A label and a URL. |

All three have drafts. Production sites read `status=published`; previews read `status=draft`.

## API tokens

Create them in Settings → API Tokens, as **Read-only** tokens, one per site and environment:

| Token | Used by | Reads |
|---|---|---|
| front | vin.ski | published content |
| back | ski.vin | published content |
| preview | dev.vin.ski, dev.ski.vin | drafts |

Which one a site reads follows its `PUBLIC_ENV` (`production` or `preview`).

Each goes into that app's `CMS_TOKEN`.
