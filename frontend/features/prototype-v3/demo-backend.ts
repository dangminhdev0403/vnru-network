"use client";

import React from "react";

export type DemoScope = "researcher" | "reviewer" | "organization";

export interface DemoActivity {
  id: string;
  scope: DemoScope;
  action: string;
  detail: string;
  createdAt: string;
}

const STORAGE_KEY = "vnru.demo-workspace.activity.v1";
const EVENT_NAME = "vnru-demo-backend-change";

function readActivity(): DemoActivity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as DemoActivity[];
  } catch {
    return [];
  }
}

export async function commitDemoMutation(
  scope: DemoScope,
  action: string,
  detail: string,
): Promise<DemoActivity> {
  await new Promise((resolve) => window.setTimeout(resolve, 320));
  const activity: DemoActivity = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    scope,
    action,
    detail,
    createdAt: new Date().toISOString(),
  };
  const next = [activity, ...readActivity()].slice(0, 30);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing or a full storage quota must not break the demo action.
  }
  window.dispatchEvent(new Event(EVENT_NAME));
  return activity;
}

export function useDemoActivity(scope: DemoScope): DemoActivity[] {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    window.addEventListener(EVENT_NAME, onStoreChange);
    window.addEventListener("storage", onStoreChange);
    return () => {
      window.removeEventListener(EVENT_NAME, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }, []);
  const getSnapshot = React.useCallback(
    () => JSON.stringify(readActivity().filter((item) => item.scope === scope)),
    [scope],
  );
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return React.useMemo(() => JSON.parse(snapshot) as DemoActivity[], [snapshot]);
}
