"use client";

// Pull past the end of the page to cross to vin.ski (ADR 0017). A bar fills at
// the bottom in vin.ski's blue, with a label once the pull is underway; at the
// end, the blue floods up and vin.ski takes over.
import { type CSSProperties, useEffect, useState } from "react";
import { attachCrossover } from "@vindotski/crossover";

export function Crossover({ url }: { url: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => attachCrossover({ getUrl: () => url, onProgress: setProgress }), [url]);

  return (
    <>
      <div
        className="crossover-bar"
        style={{ "--crossover-progress": progress } as CSSProperties}
        data-idle={progress === 0 ? "" : undefined}
        aria-hidden="true"
      />
      <p
        className="crossover-label pointer-events-none fixed bottom-14 left-1/2 z-60 -translate-x-1/2 bg-background/80 px-2 py-1 font-mono text-xs tracking-wider text-foreground uppercase backdrop-blur"
        data-show={progress > 0.3 ? "" : undefined}
        aria-hidden="true"
      >
        {progress > 0.7 ? `→ ${new URL(url).hostname}` : "Keep going"}
      </p>
    </>
  );
}
