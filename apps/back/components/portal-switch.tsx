"use client";

// The light switch is the portal (ADR 0019): ski.vin is always dark, and
// "lights on" takes you up to vin.ski, its daylight pouring in from above.
import { SunIcon } from "lucide-react";
import { crossTo } from "@vindotski/crossover";
import { Button } from "@/components/ui/button";

export function PortalSwitch({ url, className }: { url: string; className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={() => crossTo(url, { direction: "up" })}
      aria-label="Lights on (leaves this site)"
      title="Lights on"
    >
      <SunIcon />
    </Button>
  );
}
