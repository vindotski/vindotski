/**
 * The CMS client (Strapi 5 REST at vinski.xyz), server-only. Every read is
 * cached under the `cms` tag: pages are prerendered with their content, and a
 * Strapi webhook to /api/revalidate refreshes them when content changes.
 *
 * It asks Strapi for the fields the pages use and maps each response onto the
 * types below, so nothing else ends up in the pages. Production reads
 * published content; previews read drafts (ADR 0013).
 */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { env, isPreview } from "@/lib/env";

export const CMS_TAG = "cms";

export type Profile = {
  name: string;
  headline: string | null;
  role: string | null;
};

export type Project = {
  documentId: string;
  title: string;
  summary: string | null;
};

/** What a fragment is (ADR 0019): the Underground's kinds of things. */
export type FragmentKind = "process" | "note" | "art" | "music" | "photo" | "project";

export type Fragment = {
  documentId: string;
  title: string;
  /** Null for fragments created before `kind` existed. */
  kind: FragmentKind | null;
};

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  "use cache";
  cacheTag(CMS_TAG);
  // Webhooks keep content fresh; this is only the fallback.
  cacheLife("hours");

  const url = new URL(path, env.CMS_URL);
  url.search = new URLSearchParams({ ...params, status: isPreview() ? "draft" : "published" }).toString();

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${env.CMS_TOKEN}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`CMS ${url.pathname} answered ${response.status}`);
  return ((await response.json()) as { data: T }).data;
}

/** `fields[0]=a&fields[1]=b…`, as Strapi expects. */
const fields = (names: string[]) => Object.fromEntries(names.map((name, i) => [`fields[${i}]`, name]));

export const getProfile = async (): Promise<Profile> => {
  const raw = await get<Profile>("/api/profile", fields(["name", "headline", "role"]));
  return { name: raw.name, headline: raw.headline ?? null, role: raw.role ?? null };
};

/** Projects for ski.vin: those marked `back` or `both`, in their set order. */
export const getProjects = async (): Promise<Project[]> => {
  const raw = await get<Project[]>("/api/projects", {
    ...fields(["title", "summary"]),
    "filters[site][$in][0]": "back",
    "filters[site][$in][1]": "both",
    sort: "order:asc",
    "pagination[pageSize]": "100",
  });
  return raw.map(({ documentId, title, summary }) => ({ documentId, title, summary: summary ?? null }));
};

export const getFragments = async (): Promise<Fragment[]> => {
  const raw = await get<Fragment[]>("/api/fragments", {
    ...fields(["title", "kind"]),
    sort: "createdAt:desc",
    "pagination[pageSize]": "100",
  });
  return raw.map(({ documentId, title, kind }) => ({ documentId, title, kind: kind ?? null }));
};
