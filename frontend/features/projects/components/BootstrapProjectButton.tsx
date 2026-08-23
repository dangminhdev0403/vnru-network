"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/server-state";
import { useBootstrapProject } from "../hooks";
import { confirmAction, showError } from "@/lib/alerts";
import type { CollaborationProposal } from "@/features/collaboration/types";
import { useLocale, type Locale } from "@/app/HomeMotion";

const copy: Record<Locale, { confirm: string; title: string; error: string; requestFailed: string; loading: string; action: string }> = {
  vi: { confirm: "Xác nhận khởi tạo dự án?", title: "Dự án", error: "Khởi tạo dự án thất bại", requestFailed: "Yêu cầu thất bại", loading: "Đang khởi tạo…", action: "Khởi tạo dự án từ quyết định đã duyệt" },
  en: { confirm: "Create this project?", title: "Project", error: "Failed to create project", requestFailed: "Request failed", loading: "Creating…", action: "Create project from approved decision" },
  ru: { confirm: "Создать проект?", title: "Проект", error: "Не удалось создать проект", requestFailed: "Запрос не выполнен", loading: "Создание…", action: "Создать проект по одобренному решению" },
};

export function BootstrapProjectButton({ proposal }: { proposal: CollaborationProposal }) {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const caps = (user as { capabilities?: string[] })?.capabilities ?? [];
  const canBootstrap = caps.includes("collab.decisions.issue_foundation") || caps.includes("projects.projects.manage");
  const { bootstrap, isPending } = useBootstrapProject();
  const decision = proposal.decisions?.find((item) => item.approved);
  const lead = proposal.participants.find((item) => item.country === "VN");
  if (!decision || !lead || !canBootstrap) return null;

  return <button type="button" disabled={isPending} onClick={async () => {
    if (!(await confirmAction({ title: t.confirm })).isConfirmed) return;
    try {
      const project = await bootstrap({
        decisionRef: decision.id,
        proposalRef: proposal.id,
        title: `${t.title} ${proposal.id}`,
        description: proposal.content,
        leadId: lead.userId,
        approved: true,
      });
      router.push(`/workspace/collaboration/projects/${project.id}`);
    } catch (error) {
      showError(t.error, error instanceof Error ? error.message : t.requestFailed);
    }
  }} aria-busy={isPending} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
    {isPending ? t.loading : t.action}
  </button>;
}
