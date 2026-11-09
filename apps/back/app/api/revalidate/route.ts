/*
 * On-demand revalidation: a Strapi webhook (Settings → Webhooks, on entry
 * publish, unpublish, update and delete) POSTs here with
 * `Authorization: Bearer <REVALIDATE_SECRET>`, and every page that reads the
 * CMS is refreshed on its next visit.
 */
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CMS_TAG } from "@/lib/cms";
import { env } from "@/lib/env";

function authorized(request: Request) {
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${env.REVALIDATE_SECRET}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(CMS_TAG, "max");
  return Response.json({ revalidated: true });
}
