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

The first visit to `/admin` creates the admin user.

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

| Token | Used by | `CMS_STATUS` |
|---|---|---|
| front | vin.ski | `published` |
| back | ski.vin | `published` |
| preview | dev.vin.ski, dev.ski.vin | `draft` |

Each goes into that app's `CMS_TOKEN`. The public role gets no permissions.
