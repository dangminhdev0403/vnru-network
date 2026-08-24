"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export function WorkspaceSectionSync() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  React.useEffect(() => {
    if (!view || !/^[a-z-]+$/.test(view)) return;
    const target = document.querySelector<HTMLElement>(`[data-workspace-view="${view}"]`);
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  }, [view]);

  return null;
}
