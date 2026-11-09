"use client";

// Cycles the color mode: system → light → dark (ADR 0016). ski.vin starts on
// dark. The choice is stored per site by @vindotski/theme/color-mode.
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type ColorMode,
  getColorMode,
  nextColorMode,
  setColorMode,
} from "@vindotski/theme/color-mode";
import { Button } from "@/components/ui/button";

const names: Record<ColorMode, string> = { system: "System", light: "Light", dark: "Dark" };

export function ColorModeToggle({ className }: { className?: string }) {
  // The real mode is only known in the browser, after the head script ran.
  const [mode, setMode] = useState<ColorMode>("dark");
  useEffect(() => setMode(getColorMode("dark")), []);

  const Icon = mode === "light" ? SunIcon : mode === "dark" ? MoonIcon : MonitorIcon;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={() => {
        const next = nextColorMode(mode);
        setMode(next);
        setColorMode(next);
      }}
      aria-label={`Color mode: ${names[mode]}. Switch to ${names[nextColorMode(mode)]}.`}
      title={`Color mode: ${names[mode]}`}
    >
      <Icon />
    </Button>
  );
}
