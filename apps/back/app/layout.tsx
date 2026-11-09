import type { Metadata } from "next";
import { arriveScript } from "@vindotski/crossover";
import { Crossover } from "@/components/crossover";
import { PortalSwitch } from "@/components/portal-switch";
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
    // The Underground: always dark (ADR 0019), also without JavaScript. The
    // arrival script may add a class to <html> before React hydrates, so React
    // is told not to mind the difference.
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Plays the reveal when arriving from vin.ski (ADRs 0017, 0019). */}
        <script dangerouslySetInnerHTML={{ __html: arriveScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <PortalSwitch url={env.FRONT_URL} className="fixed top-4 right-4 z-50" />
        {children}
        <Crossover url={env.FRONT_URL} />
      </body>
    </html>
  );
}
