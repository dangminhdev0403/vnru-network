"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ConstellationField = dynamic(
  () =>
    import("@designcodeio/threeui/components/ConstellationField").then(
      ({ ConstellationField: Component }) => Component,
    ),
  { ssr: false },
);

export function ThreeHeroBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(desktop.matches && !reducedMotion.matches);

    sync();
    desktop.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  if (!enabled) return null;

  return (
    <ConstellationField
      variant="constellation-field"
      mode="dark"
      speed={0.35}
      size={0.7}
      density={0.55}
      strokeWidth={0.65}
      opacity={0.32}
      hue={18}
      saturation={0.8}
      brightness={0.8}
      className="size-full"
    />
  );
}
