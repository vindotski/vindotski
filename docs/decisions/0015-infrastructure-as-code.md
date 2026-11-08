---
title: "All Hetzner and Cloudflare configuration is OpenTofu, with encrypted state in R2, plan on pull requests and manual apply"
number: 15
status: accepted
implementation: designed
date: 2026-11-09
notes: "Built in roadmap stage 2."
---

## Context

Servers, DNS, the tunnel and cache rules set by hand drift and can't be reviewed. The template should be able to rebuild everything from code, for the owner's three domains and for any domain added later.

## Decision

- **OpenTofu** in `infra/hetzner` and `infra/cloudflare`, with the `hetznercloud/hcloud` and `cloudflare/cloudflare` (v5) providers pinned ([10](0010-pinned-dependencies.md)).
- **Zones are created, not imported:** a `cloudflare_zone` resource for each entry in `zones` (tfvars), with `prevent_destroy`. The `name_servers` output is what goes into the registrar.
  - A domain that already exists as a zone in the account is deleted in Cloudflare before the first apply, then pointed at the new nameservers.
  - Adding a domain later means adding one entry.
- **Everything else is code:** DNS records, the tunnel and its ingress (whose token goes to the stack's `.env` as an output), the cache and WAF rulesets, the zone settings, and on Hetzner the server, firewall, SSH key and backups.
- **State** lives in an S3 backend on an R2 bucket, with OpenTofu state encryption turned on. No `tfstate` is ever committed.
- **CI:** `infra.yml` runs `tofu fmt`, `validate` and `plan` on pull requests that touch `infra/`. `apply` is a manual `workflow_dispatch` against a GitHub Environment that requires approval. Values come from tfvars and Environment variables, and tokens come from secrets.

## Alternatives

- **Importing the existing zones:** it keeps today's nameservers, but every new domain would need the same special case. The owner chose create-only, accepting one nameserver change on the first run.
- **Terraform:** OpenTofu is open source and has built-in state encryption.

## Consequences

- One-time manual steps remain, kept in a checklist:
  - Buy the domains (the owner's are at GoDaddy).
  - Set their nameservers.
  - Create the first API tokens and the R2 state bucket.
- The first apply for an existing domain means a short window while its nameservers change, and any record not written in code (such as mail) is lost with the old zone. Add those records to `infra/cloudflare` before deleting the zone.
