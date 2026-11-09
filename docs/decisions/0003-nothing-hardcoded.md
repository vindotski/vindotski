---
title: "Nothing is hardcoded: domains, URLs and tokens come from the environment"
number: 3
status: accepted
date: 2026-11-09
---

## Context

The repository runs the owner's own sites, but it's public as a template that others can copy. Domains, hosts and credentials must be easy to swap and must never be committed.

## Decision

- **Every domain, URL, size and name comes from configuration:** each app's `.env` (with a committed `.env.example`), OpenTofu `tfvars` (with a committed `terraform.tfvars.example`), and GitHub Environment variables.
- **Secrets come only from GitHub secrets and the server's `.env`.** They are never committed and never baked into images.
- **The owner's values appear only in examples and docs**, never in code.

## Alternatives

- **Constants in code:** quicker to write, but every template user would have to hunt them down, and a secret would eventually get committed.

## Consequences

- Every new setting needs a line in the matching `.env.example`, and a row in the app's README.
- Prerendered front builds bake public values in at build time. Changing one means a rebuild.
