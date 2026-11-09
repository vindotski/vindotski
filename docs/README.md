# vindotski

The source of two websites and the CMS behind them, kept in one repository. It's the owner's own setup, and it's public as a template you can reuse.

| App | Domain | What it is |
| --- | --- | --- |
| [`apps/front`](../apps/front/README.md) | vin.ski | The main site, for recruiters, LinkedIn and search. SvelteKit, prerendered |
| [`apps/back`](../apps/back/README.md) | ski.vin | The alt site, for creative work. Next.js, never listed by search engines |
| [`apps/cms`](../apps/cms/README.md) | vinski.xyz | Strapi, the content for both sites |

Both sites look the same, apart from their brand color, and the main site hides a way to reach the alt one.

## Pages

- [Concept](concept.md): the Surface and the Underground, and how you move between them.
- [Architecture](architecture.md): how the apps, domains, content and environments fit together.
- [Getting started](getting-started.md): running it locally.
- [Roadmap](roadmap.md): what's built, and what's next.
- [Releasing](releasing.md): pull requests into `dev`, and fast-forwarding `main`.
- [Decisions](decisions/README.md): why it's built this way.

## About these docs

This folder is the source of the repository's GitHub wiki. Every push to `main` mirrors it there ([decision 1](decisions/0001-adrs-and-wiki.md)), so edit the files here, not in the wiki.

## License

The code is under the [GNU AGPL, version 3 only](../LICENSE) (`AGPL-3.0-only`). Content about Ivan Vinski (his name, likeness, writing, art, the vin.ski and ski.vin names, and everything in the CMS) is all rights reserved. See [NOTICE](../NOTICE) and [decision 20](decisions/0020-license.md).
