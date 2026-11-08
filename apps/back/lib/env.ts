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
};

export const isPreview = () => env.PUBLIC_ENV === "preview";
