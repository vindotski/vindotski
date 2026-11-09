import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/*
 * ski.vin is online but never listed (ADR 0005). Every response, pages and
 * static assets alike, tells search engines not to index it, and no referrer
 * leaks the URL to the sites it links to. Search engines may still crawl, so
 * they see the noindex: robots.txt must never `Disallow: /` for them.
 */
const indexingHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

/*
 * Browser hardening. Next inlines its own payload scripts, and the arrival
 * script (@vindotski/crossover) is inline too, so scripts need 'unsafe-inline';
 * nonces would make every page dynamic. Everything else is locked to this
 * origin. When the pages show CMS media, add the CMS origin to img-src and
 * media-src. HSTS comes from the proxy (Stage 2).
 */
const isDev = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
  async headers() {
    return [{ source: "/:path*", headers: [...indexingHeaders, ...securityHeaders] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
