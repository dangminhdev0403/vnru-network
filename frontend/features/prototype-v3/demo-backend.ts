"use client";

import React from "react";

export type DemoScope = "researcher" | "reviewer" | "organization" | "manager" | "decision";

export interface DemoActivity {
  id: string;
  scope: DemoScope;
  action: string;
  detail: string;
  createdAt: string;
}

export interface DemoNotification {
  id: string;
  scope: DemoScope;
  title: string;
  detail: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

export interface DemoHandoff {
  id: string;
  from: DemoScope;
  to: DemoScope;
  entityCode: string;
  title: string;
  stage: string;
  createdAt: string;
}

export interface DemoMutationOptions {
  notifications?: Array<{
    scope: DemoScope;
    title: string;
    detail: string;
    href?: string;
  }>;
  handoffs?: Array<{
    to: DemoScope;
    entityCode: string;
    title: string;
    stage: string;
  }>;
}

const ACTIVITY_KEY = "vnru.demo-workspace.activity.v1";
const NOTIFICATION_KEY = "vnru.demo-workspace.notifications.v1";
const HANDOFF_KEY = "vnru.demo-workspace.handoffs.v1";
const EVENT_NAME = "vnru-demo-backend-change";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or a full storage quota must not break preview interactions.
  }
}

function emitChange() {
  window.dispatchEvent(new Event(EVENT_NAME));
}

function nowId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readDemoActivity(): DemoActivity[] {
  return readJson<DemoActivity[]>(ACTIVITY_KEY, []);
}

export function readDemoNotifications(): DemoNotification[] {
  return readJson<DemoNotification[]>(NOTIFICATION_KEY, []);
}

export function readDemoHandoffs(): DemoHandoff[] {
  return readJson<DemoHandoff[]>(HANDOFF_KEY, []);
}

export async function commitDemoMutation(
  scope: DemoScope,
  action: string,
  detail: string,
  options: DemoMutationOptions = {},
): Promise<DemoActivity> {
  await new Promise((resolve) => window.setTimeout(resolve, 320));
  const createdAt = new Date().toISOString();
  const activity: DemoActivity = {
    id: nowId("activity"),
    scope,
    action,
    detail,
    createdAt,
  };

  writeJson(ACTIVITY_KEY, [activity, ...readDemoActivity()].slice(0, 60));

  if (options.notifications?.length) {
    const additions: DemoNotification[] = options.notifications.map((item) => ({
      id: nowId("notification"),
      scope: item.scope,
      title: item.title,
      detail: item.detail,
      href: item.href,
      createdAt,
      read: false,
    }));
    writeJson(NOTIFICATION_KEY, [...additions, ...readDemoNotifications()].slice(0, 80));
  }

  if (options.handoffs?.length) {
    const additions: DemoHandoff[] = options.handoffs.map((item) => ({
      id: nowId("handoff"),
      from: scope,
      to: item.to,
      entityCode: item.entityCode,
      title: item.title,
      stage: item.stage,
      createdAt,
    }));
    writeJson(HANDOFF_KEY, [...additions, ...readDemoHandoffs()].slice(0, 80));
  }

  emitChange();
  return activity;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(EVENT_NAME, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useDemoActivity(scope: DemoScope): DemoActivity[] {
  const getSnapshot = React.useCallback(
    () => JSON.stringify(readDemoActivity().filter((item) => item.scope === scope)),
    [scope],
  );
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return React.useMemo(() => JSON.parse(snapshot) as DemoActivity[], [snapshot]);
}

export function useDemoNotifications(scope: DemoScope): DemoNotification[] {
  const getSnapshot = React.useCallback(
    () => JSON.stringify(readDemoNotifications().filter((item) => item.scope === scope)),
    [scope],
  );
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return React.useMemo(() => JSON.parse(snapshot) as DemoNotification[], [snapshot]);
}

export function useDemoHandoffs(scope: DemoScope): DemoHandoff[] {
  const getSnapshot = React.useCallback(
    () => JSON.stringify(readDemoHandoffs().filter((item) => item.to === scope)),
    [scope],
  );
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return React.useMemo(() => JSON.parse(snapshot) as DemoHandoff[], [snapshot]);
}

export function markDemoNotificationRead(id: string) {
  writeJson(
    NOTIFICATION_KEY,
    readDemoNotifications().map((item) => item.id === id ? { ...item, read: true } : item),
  );
  emitChange();
}

export function markAllDemoNotificationsRead(scope: DemoScope) {
  writeJson(
    NOTIFICATION_KEY,
    readDemoNotifications().map((item) => item.scope === scope ? { ...item, read: true } : item),
  );
  emitChange();
}
