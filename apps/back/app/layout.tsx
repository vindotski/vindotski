import type { Metadata } from "next";
import { env } from "@/lib/env";
import "./globals.css";

/*
 * No openGraph or twitter metadata, and no sitemap (ADR 0005): link
 * previews and discovery are exactly what ski.vin doesn't want.
 */
export function generateMetadata(): Metadata {
  return {
    title: env.SITE_NAME,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
    referrer: "no-referrer",
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
