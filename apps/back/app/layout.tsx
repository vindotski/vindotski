import type { Metadata } from "next";
import { arriveScript } from "@vindotski/crossover";
import { colorModeScript } from "@vindotski/theme/color-mode";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { Crossover } from "@/components/crossover";
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
    // Dark by default (ADR 0016), also without JavaScript. The head script swaps
    // the class for the visitor's stored choice before the first paint, so React
    // is told not to mind the difference.
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript("dark") }} />
        {/* Plays the reveal when arriving from vin.ski's pull-past-the-end (ADR 0017). */}
        <script dangerouslySetInnerHTML={{ __html: arriveScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ColorModeToggle className="fixed top-4 right-4 z-50" />
        {children}
        <Crossover url={env.FRONT_URL} />
      </body>
    </html>
  );
}
