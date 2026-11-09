/**
 * The CMS client (Strapi 5 REST at vinski.xyz), server-only. Every read is
 * cached under the `cms` tag: pages are prerendered with their content, and a
 * Strapi webhook to /api/revalidate refreshes them when content changes.
 * CMS_STATUS picks published content (production) or drafts (previews).
 */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "@/lib/env";

export const CMS_TAG = "cms";

export type Link = { label: string; url: string };

export type Media = { url: string; alternativeText: string | null; width: number; height: number };

export type Profile = {
  name: string;
  headline: string | null;
  role: string | null;
  availability: string | null;
  bio: string | null;
  location: string | null;
  avatar: Media | null;
  links: Link[];
};

export type Project = {
  documentId: string;
  title: string;
  slug: string;
  summary: string | null;
  url: string | null;
  repository: string | null;
  cover: Media | null;
  site: "front" | "back" | "both";
  order: number;
};

/** What a fragment is (ADR 0019): the Underground's kinds of things. */
export type FragmentKind = "process" | "note" | "art" | "music" | "photo" | "project";

export type Fragment = {
  documentId: string;
  title: string;
  slug: string;
  /** Null for fragments created before `kind` existed. */
  kind: FragmentKind | null;
  media: Media[] | null;
};

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  "use cache";
  cacheTag(CMS_TAG);
  // Webhooks keep content fresh; this is only the fallback.
  cacheLife("hours");

  const url = new URL(path, env.CMS_URL);
  url.search = new URLSearchParams({ ...params, status: env.CMS_STATUS }).toString();

  const response = await fetch(url, { headers: { Authorization: `Bearer ${env.CMS_TOKEN}` } });
  if (!response.ok) throw new Error(`CMS ${url.pathname} answered ${response.status}`);
  return ((await response.json()) as { data: T }).data;
}

/** Media URLs from Strapi are relative to the CMS. */
export const mediaUrl = (media: Media) => new URL(media.url, env.CMS_URL).href;

export const getProfile = () => get<Profile>("/api/profile", { populate: "*" });

/** Projects for ski.vin: those marked `back` or `both`, in their set order. */
export const getProjects = () =>
  get<Project[]>("/api/projects", {
    "filters[site][$in][0]": "back",
    "filters[site][$in][1]": "both",
    sort: "order:asc",
    populate: "cover",
    "pagination[pageSize]": "100",
  });

export const getFragments = () =>
  get<Fragment[]>("/api/fragments", {
    sort: "createdAt:desc",
    populate: "media",
    "pagination[pageSize]": "100",
  });
