# apps/back: ski.vin

Next.js App Router, TypeScript, Tailwind and shadcn/ui. The alt site: online, but never listed.
Ivan works here most; the style is free, but the robots rules below are not.

## Next.js

- App Router only (`app/`). Server Components by default; add `"use client"` only where a component
  needs state, effects or browser APIs, and keep those components small.
- Data comes from the CMS client (`lib/cms.ts`) with `revalidate` and tags; content updates arrive
  through `app/api/revalidate/route.ts`, which checks a secret from env.
- Use the `vercel-react-best-practices` skill for React and Next.js code, and the `shadcn` skill for
  components. Shared tokens come from `@vindotski/theme`; this app overrides only `--primary`/`--ring`.
- Env only: no hardcoded domains, URLs or tokens.
- `/_style` exists only when `PUBLIC_ENV=preview` (`notFound()` otherwise).

## Robots rules (never weaken them)

- Every response, pages and static assets alike, sends
  `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` and
  `Referrer-Policy: no-referrer`, set in `next.config.ts` `headers()` for `/:path*`.
- The root layout's `metadata.robots` is noindex, nofollow and nocache. No page overrides it.
- `app/robots.ts` allows `*` and disallows AI and scraper bots by name (GPTBot, ClaudeBot, CCBot,
  Google-Extended, Bytespider and others). **Never `Disallow: /` for search engines:** they must be able
  to crawl to see the noindex, or the bare URL can still get listed.
  (In preview, `PUBLIC_ENV=preview`, robots.txt may disallow everything.)
- No `sitemap.ts`, no `openGraph` or `twitter` metadata, no OG images.
- After touching config, layouts or middleware, check `curl -I` on `/`, a page and a static asset.
