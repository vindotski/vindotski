import type { NextConfig } from "next";

/*
 * ski.vin is online but never listed (ADR 0005). Every response, pages and
 * static assets alike, tells search engines not to index it, and no referrer
 * leaks the URL to the sites it links to. Search engines may still crawl, so
 * they see the noindex: robots.txt must never `Disallow: /` for them.
 */
const securityHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: new URL("../..", import.meta.url).pathname,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
