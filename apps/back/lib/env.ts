/**
 * Server-side env, server-only. Every variable is listed in .env.example.
 * Pages are static, so values they use (PUBLIC_ENV, SITE_NAME, FRONT_URL, the
 * CMS content) are fixed when they're rendered at build time: build once per
 * environment (production, preview). The CMS token is read from the
 * environment, never written into the build.
 */
import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set`);
  return value;
}

function oneOf<T extends string>(name: string, options: readonly T[]): T {
  const value = required(name);
  if (!options.includes(value as T)) {
    throw new Error(`${name} must be one of ${options.join(", ")} (got "${value}")`);
  }
  return value as T;
}

/** An absolute URL's origin; in production it must be https. */
function origin(name: string): string {
  let parsed: URL;
  try {
    parsed = new URL(required(name));
  } catch {
    throw new Error(`${name} must be an absolute URL`);
  }
  if (env.PUBLIC_ENV === "production" && parsed.protocol !== "https:" && !isLocal(parsed)) {
    throw new Error(`${name} must be https in production`);
  }
  return parsed.origin;
}

const isLocal = (url: URL) => ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

export const env = {
  /** `production` or `preview` (dev.ski.vin): preview-only routes like `/_style`, and drafts from the CMS. */
  get PUBLIC_ENV() {
    return oneOf("PUBLIC_ENV", ["production", "preview"] as const);
  },
  get SITE_NAME() {
    return required("SITE_NAME");
  },
  /** vin.ski's origin: where the Sun and pulling past the top lead (ADRs 0017, 0019). */
  get FRONT_URL() {
    return new URL(required("FRONT_URL")).origin;
  },
  /** The Strapi origin, e.g. https://vinski.xyz. https in production, so the token never travels in cleartext. */
  get CMS_URL() {
    return origin("CMS_URL");
  },
  /** A read-only Strapi API token for this site (the preview token on previews). */
  get CMS_TOKEN() {
    return required("CMS_TOKEN");
  },
  /** The shared secret the CMS webhook sends to /api/revalidate: at least 32 characters. */
  get REVALIDATE_SECRET() {
    const value = required("REVALIDATE_SECRET");
    if (value.length < 32) throw new Error("REVALIDATE_SECRET must be at least 32 characters");
    return value;
  },
};

export const isPreview = () => env.PUBLIC_ENV === "preview";
