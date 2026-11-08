// The style check: it should look the same as vin.ski/_style, apart from the primary color.
// The folder is `%5Fstyle` because Next.js treats `_folders` as private.
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isPreview } from "@/lib/env";

// PUBLIC_ENV is read when the page is prerendered at build time.
export default function StylePage() {
  if (!isPreview()) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <h1 className="font-heading text-3xl font-medium">Style</h1>

      <section className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description in the muted color.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Body text in the foreground color, on the card background.</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="outline">Outline</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
