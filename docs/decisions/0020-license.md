---
title: "The code is AGPL-3.0-only, and Ivan Vinski's content is all rights reserved"
number: 20
status: accepted
implementation: built
date: 2026-11-09
---

## Context

The repository is public, and it doubles as a template others can reuse ([3](0003-nothing-hardcoded.md)). Until now it had no license, so nobody could legally reuse anything. Two different kinds of thing live in it, or are served by it: the code, which the owner is happy to share, and content about him (his name, likeness, writing, art and profile), which he isn't.

## Decision

- **The code is under the GNU Affero General Public License, version 3 only** (SPDX `AGPL-3.0-only`). The verbatim text is in `LICENSE`, and every `package.json` has `"license": "AGPL-3.0-only"`.
- **Content about Ivan Vinski is all rights reserved,** and isn't covered by the AGPL. That's his name, likeness, portraits and photos, biography, CV and profile text, written pieces, artwork, music, the vin.ski and ski.vin names and wordmarks, the root `README.md` (his GitHub profile), and everything served from the CMS. `NOTICE` says so.
- **Third-party code keeps its license.** `NOTICE` lists it:
  - The vendored skills (MIT), recorded in `skills-lock.json`.
  - The shadcn-svelte and shadcn/ui components and `apps/back/app/shadcn.css` (MIT). Their copyright and permission notices are reproduced in `NOTICE`, as MIT requires.

## Alternatives

- **MIT or Apache-2.0:** simpler for template users, but anyone could run a closed, improved version. The AGPL keeps improvements to a hosted copy open.
- **AGPL-3.0 "or later":** rejected for "only", so any future GNU license version is the owner's choice, not automatic.
- **One license for everything:** it would make his likeness, writing and art freely reusable.

## Consequences

- Anyone who runs a modified copy as a website has to offer its users that copy's source (AGPL section 13). As the copyright holder, the owner isn't bound by this for his own sites, though the source is public anyway.
- Template users have to replace the reserved content (the profile, the wordmarks, the CMS content) before publishing their own site. Most of it lives in Strapi, not in the repository.
- Contributions are accepted under the same license.
