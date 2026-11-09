"use client";

// Pull past the top of the page to come up to vin.ski (ADRs 0017, 0019), like a
// pull-to-refresh. A bar fills along the top in vin.ski's blue, with a label once
// the pull is underway; at the end, its daylight pours in from above.
import { type CSSProperties, useEffect, useState } from "react";
import { attachCrossover } from "@vindotski/crossover";

export function Crossover({ url }: { url: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => attachCrossover({ getUrl: () => url, edge: "top", onProgress: setProgress }), [url]);

  return (
    <>
      <div
        className="crossover-bar"
        style={{ "--crossover-progress": progress } as CSSProperties}
        data-idle={progress === 0 ? "" : undefined}
        aria-hidden="true"
      />
      <p
        className="crossover-label bg-background/80 px-2 py-1 font-mono text-xs tracking-wider text-foreground uppercase backdrop-blur"
        data-show={progress > 0.3 ? "" : undefined}
        aria-hidden="true"
      >
        {progress > 0.7 ? `↑ ${new URL(url).hostname}` : "Keep going"}
      </p>
    </>
  );
}
