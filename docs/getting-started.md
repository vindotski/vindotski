# Getting started

## Running locally (designed, not built yet)

The apps aren't scaffolded yet ([roadmap](roadmap.md), stage 1). Once they are:

```bash
pnpm install
pnpm --filter cms dev      # Strapi on localhost:1337 (needs the local Postgres)
pnpm --filter front dev    # vin.ski on localhost:5173
pnpm --filter back dev     # ski.vin on localhost:3000
```

Each app reads its settings from `.env`. Copy its `.env.example` to begin.

## Using this as a template

- Replace the domains, tokens and names in the `.env` files and `terraform.tfvars`. None of them appear in the code ([3](decisions/0003-nothing-hardcoded.md)).
- Leave the root `README.md` alone, or replace it with your own: on the owner's repository, it's the GitHub profile README.

## One-time setup (designed, not built yet)

1. Buy the domains, and enable the GitHub wiki (create one page, so that the wiki repository exists).
2. Create the API tokens (Hetzner, plus a scoped Cloudflare token) and the R2 bucket that holds the OpenTofu state.
3. If a domain is already a zone in your Cloudflare account, put any records you want to keep (such as mail) into `infra/cloudflare` first, then delete the zone. The first apply creates it again ([15](decisions/0015-infrastructure-as-code.md)).
4. Set the `name_servers` output at your registrar.
