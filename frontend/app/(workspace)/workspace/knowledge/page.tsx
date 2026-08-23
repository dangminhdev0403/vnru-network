import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, getCurrentSession } from "@/features/auth/server";
import KnowledgeWorkspaceView from "@/features/knowledge/components/KnowledgeWorkspaceView";
import { getExperts, getPublications } from "@/features/knowledge/repositories/module2.repository";
import React from "react";
import Link from "next/link";
import type { Locale } from "@/app/HomeMotion";

const deniedCopy: Record<Locale, { title: string; description: string; back: string }> = {
  vi: { title: "Quyền truy cập bị từ chối", description: "Bạn không có quyền truy cập không gian làm việc này. Yêu cầu quyền `knowledge.workspace.view`.", back: "Quay lại tổng quan" },
  en: { title: "Access denied", description: "You do not have access to this workspace. The `knowledge.workspace.view` permission is required.", back: "Back to overview" },
  ru: { title: "Доступ запрещён", description: "У вас нет доступа к этому рабочему пространству. Требуется право `knowledge.workspace.view`.", back: "Вернуться к обзору" },
};

type Params = Record<string, string | string[] | undefined>;
const one = (value: string | string[] | undefined) => typeof value === "string" ? value : undefined;
type AuthSession = Readonly<{
  activeContext: { contextType: string; contextId: string };
  capabilities: string[];
}>;
const isAuthSession = (value: unknown): value is AuthSession => {
  if (!value || typeof value !== "object") return false;
  const session = value as Record<string, unknown>;
  return Array.isArray(session.capabilities) && session.capabilities.every((item) => typeof item === "string") && !!session.activeContext && typeof session.activeContext === "object";
};

export default async function KnowledgeWorkspacePage({ searchParams }: { searchParams: Promise<Params> }) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("vnru_locale")?.value ?? "vi") as Locale;
  const denied = deniedCopy[locale] ?? deniedCopy.vi;
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    redirect("/api/auth/login?returnTo=/workspace/knowledge");
  }

  const session = await getCurrentSession(sessionToken);
  if (!isAuthSession(session)) {
    redirect("/api/auth/login?returnTo=/workspace/knowledge");
  }

  const capabilities = session.capabilities;
  if (!capabilities.includes("knowledge.workspace.view")) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#f5f7fb] dark:bg-slate-950 p-6">
        <section className="w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 p-8 text-center shadow-xl">
          <span className="material-symbols-outlined text-4xl text-rose-700 dark:text-rose-500">gpp_maybe</span>
          <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">{denied.title}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {denied.description}
          </p>
          <Link href="/workspace" className="mt-6 inline-flex rounded-xl bg-[#10203b] hover:bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition">
            {denied.back}
          </Link>
        </section>
      </main>
    );
  }

  const raw = await searchParams;
  const query = {
    q: one(raw.q),
    country: one(raw.country),
    organization: one(raw.organization),
    topic: one(raw.topic),
    language: one(raw.language),
    year: one(raw.year),
    publicationCursor: one(raw.publicationCursor),
    expertCursor: one(raw.expertCursor)
  };

  const [publications, experts] = await Promise.all([
    getPublications({ ...query, cursor: query.publicationCursor, publicationCursor: undefined, expertCursor: undefined, limit: "20" }),
    getExperts({ ...query, year: undefined, cursor: query.expertCursor, publicationCursor: undefined, expertCursor: undefined, limit: "20" })
  ]);

  const canViewMatches = capabilities.includes("experts.matches.view");

  return (
    <KnowledgeWorkspaceView
      publications={publications}
      experts={experts}
      query={query}
      canViewMatches={canViewMatches}
    />
  );
}
