/**
 * Server-side env, read when the app runs (not baked into the build).
 * Every variable is listed in .env.example.
 */
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

export const env = {
  /** `production` or `preview` (dev.ski.vin): preview-only routes like `/_style`. */
  get PUBLIC_ENV() {
    return oneOf("PUBLIC_ENV", ["production", "preview"] as const);
  },
  get SITE_NAME() {
    return required("SITE_NAME");
  },
  /** The Strapi origin, e.g. https://vinski.xyz. */
  get CMS_URL() {
    return required("CMS_URL");
  },
  /** A read-only Strapi API token for this site. */
  get CMS_TOKEN() {
    return required("CMS_TOKEN");
  },
  /** `published` (production) or `draft` (previews, which include unpublished changes). */
  get CMS_STATUS() {
    return oneOf("CMS_STATUS", ["published", "draft"] as const);
  },
  /** The shared secret the CMS webhook sends to /api/revalidate. */
  get REVALIDATE_SECRET() {
    return required("REVALIDATE_SECRET");
  },
};

export const isPreview = () => env.PUBLIC_ENV === "preview";
