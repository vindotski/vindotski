---
title: "Strapi 5 with Postgres at vinski.xyz serves content to both sites over REST"
number: 6
status: accepted
implementation: partly-built
date: 2026-11-09
notes: "Strapi and the three content types run locally. The vinski.xyz deploy and the preview tokens come with stage 2."
---

## Context

Both sites need editable content: the owner's profile and projects, and loose creative pieces on the alt site. A designer and the owner should be able to change content without touching code.

## Decision

- **Strapi 5 with Postgres**, in `apps/cms`, served on the root of **vinski.xyz**: the admin at `/admin` and the REST API at `/api`.
- **Shared content types, filtered by site:**
  - `profile`: a single type with name, headline, bio and links.
  - `project`: a collection with a `site` enum (`front`, `back` or `both`).
  - `fragment`: a collection for the alt site, with title, slug, body (blocks) and media.
- **Draft & Publish is on.** Production builds read `status=published`, and preview builds read `status=draft` ([13](0013-environments.md)). Each site has its own read-only API token, with separate tokens for production and preview.
- **Each app has a small typed REST client** (`CMS_URL`, `CMS_TOKEN`, `CMS_STATUS`). There's no shared SDK package.
- **Content types change only through Strapi's schema files**, committed in `apps/cms`, never by clicking in production.

## Alternatives

- **Content in TypeScript or Markdown files:** simpler, but the designer and the owner would have to edit code.
- **A separate staging Strapi:** one instance with drafts covers previews.
- **Separate content types per site:** they would duplicate the shared profile and projects.

## Consequences

- Strapi and Postgres need hosting, backups and updates ([9](0009-one-vps-compose.md)).
- Strapi's admin Preview can point at the preview sites, so drafts are visible before they're published.
