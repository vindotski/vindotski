---
title: "One VPS runs everything in Docker Compose; the setup works on any VPS, with Hetzner preferred through an optional OpenTofu module"
number: 9
status: accepted
implementation: designed
date: 2026-11-09
notes: "Built in roadmap stage 2."
---

## Context

Strapi, Postgres and four site services (production and preview for each site, [13](0013-environments.md)) are small enough for one server. The owner prefers Hetzner, but template users may run any provider or a home server. Spotcraft's ADR 4 follows the same pattern.

## Decision

- **Three layers in `infra/`, and only the first one knows the provider:**
  - `infra/hetzner/` (OpenTofu, optional): an ARM (CAX) server, firewall, SSH key and backups. Its `user_data` runs the bootstrap.
  - `infra/bootstrap/` (`cloud-init.yaml` and `bootstrap.sh`): turns any Debian or Ubuntu VPS into a Docker host, with a deploy user, ufw and unattended upgrades.
  - `infra/stack/` (`compose.yaml` and `Caddyfile`): runs postgres, cms, front, front-dev, back, back-dev, caddy, an optional cloudflared and backups. It's the same on every host.
- **Caddy routes by host** and puts basic auth on the `dev.*` hosts.
- **Deploys run from GitHub Actions over SSH** (the `vps-compose-deploy` skill).

## Alternatives

- **Hetzner only:** simpler, but it locks the template to one provider.
- **Managed platforms (Vercel, Strapi Cloud):** less to run, but it costs more, and the hosting gets spread across vendors.

## Consequences

- Backups, updates and the restore check are the owner's job.
- Without the Hetzner module, the user creates the server and runs the bootstrap themselves.
