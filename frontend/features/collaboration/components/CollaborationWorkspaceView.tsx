"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { useCurrentUser } from "@/features/auth/server-state";
import Link from "next/link";
import React, { useState } from "react";
import type { ResearchOpportunity, CollaborationProposal } from "../types";

interface Copy {
  kicker: string;
  title: string;
  description: string;
  tabs: {
    opportunities: string;
    proposals: string;
    screening: string;
    decisions: string;
  };
  createOpportunity: string;
  submitProposal: string;
  noOpportunities: string;
  noProposals: string;
  statusLabels: Record<string, string>;
  budgetCap: string;
  timeline: string;
  lead: string;
  counterpart: string;
  endorsements: string;
  pipelineTitle: string;
  pipelineDesc: string;
  phases: [string, string, string][];
}

const collabCopy: Record<Locale, Copy> = {
  vi: {
    kicker: "Hợp tác KH&CN Việt – Nga",
    title: "Không gian Cộng tác Nghiên cứu Song phương",
    description:
      "Quy trình phối hợp toàn diện từ công bố cơ hội, bắt cặp đề xuất song phương, xác nhận tổ chức, bình duyệt chuyên gia đến quyết định của Quỹ và triển khai dự án.",
    tabs: {
      opportunities: "Cơ hội cộng tác",
      proposals: "Hồ sơ đề xuất",
      screening: "Sàng lọc hồ sơ",
      decisions: "Quyết định của Quỹ",
    },
    createOpportunity: "Tạo cơ hội mới",
    submitProposal: "Nộp đề xuất mới",
    noOpportunities: "Chưa có cơ hội nghiên cứu nào được công bố.",
    noProposals: "Chưa có đề xuất nghiên cứu song phương nào.",
    statusLabels: {
      DRAFT: "Bản nháp",
      PUBLISHED: "Đang mở nhận hồ sơ",
      CLOSED: "Đã đóng",
      COUNTERPART_PENDING: "Chờ đối tác Nga xác nhận",
      COUNTERPART_CONFIRMED: "Đối tác đã xác nhận",
      ENDORSED: "Tổ chức đã xác nhận",
      SUBMITTED: "Đã nộp chính thức",
      SCREENING: "Đang sàng lọc hợp lệ",
      ELIGIBLE: "Hợp lệ",
      INELIGIBLE: "Không hợp lệ",
      IN_REVIEW: "Đang bình duyệt",
      REVIEWED: "Đã có kết quả phản biện",
      ACCEPTED: "Quỹ phê duyệt tài trợ",
      REJECTED: "Không chấp thuận",
    },
    budgetCap: "Ngân sách tối đa",
    timeline: "Thời hạn nộp",
    lead: "Chủ nhiệm VN",
    counterpart: "Chủ nhiệm Nga",
    endorsements: "Xác nhận tổ chức",
    pipelineTitle: "Quy trình Phê duyệt Song phương Chuẩn hóa",
    pipelineDesc: "Mỗi đề xuất trải qua 6 chặng kiểm soát nghiêm ngặt với trách nhiệm phân định rõ ràng.",
    phases: [
      ["01", "Cơ hội Nghiên cứu", "Công bố cơ hội & tiêu chí ưu tiên song phương."],
      ["02", "Bắt cặp Song phương", "Chủ nhiệm VN & RU hoàn thiện hồ sơ và xác nhận liên danh."],
      ["03", "Xác nhận Tổ chức", "Đại diện viện/trường phê duyệt cam kết cơ sở vật chất."],
      ["04", "Sàng lọc Hồ sơ", "Kiểm tra tính hợp lệ trước khi chuyển hội đồng bình duyệt."],
      ["05", "Bình duyệt Chuyên gia", "Chấm điểm độc lập, ẩn danh và ngăn chặn xung đột lợi ích."],
      ["06", "Quyết định & Dự án", "Quỹ ban hành quyết định và tự động khởi tạo dự án PMS."],
    ],
  },
  en: {
    kicker: "VN–RU S&T Collaboration",
    title: "Bilateral Research Collaboration Workspace",
    description:
      "End-to-end governance lifecycle from opportunity publishing, bilateral counterpart pairing, institutional endorsements, double-blind peer review to foundation decisions and PMS tracking.",
    tabs: {
      opportunities: "Opportunities",
      proposals: "Proposals",
      screening: "Screening",
      decisions: "Foundation Decisions",
    },
    createOpportunity: "Create Opportunity",
    submitProposal: "Submit Proposal",
    noOpportunities: "No research opportunities published yet.",
    noProposals: "No bilateral proposals found.",
    statusLabels: {
      DRAFT: "Draft",
      PUBLISHED: "Open for Proposals",
      CLOSED: "Closed",
      COUNTERPART_PENDING: "Awaiting Russian Counterpart",
      COUNTERPART_CONFIRMED: "Counterpart Confirmed",
      ENDORSED: "Institution Endorsed",
      SUBMITTED: "Officially Submitted",
      SCREENING: "Under Eligibility Screening",
      ELIGIBLE: "Eligible",
      INELIGIBLE: "Ineligible",
      IN_REVIEW: "Under Peer Review",
      REVIEWED: "Peer Reviewed",
      ACCEPTED: "Foundation Approved",
      REJECTED: "Rejected",
    },
    budgetCap: "Budget Cap",
    timeline: "Submission Timeline",
    lead: "VN Lead PI",
    counterpart: "RU Counterpart PI",
    endorsements: "Endorsements",
    pipelineTitle: "Standardized Bilateral Governance Pipeline",
    pipelineDesc: "Each proposal undergoes 6 verification gates with rigorous separation of duties.",
    phases: [
      ["01", "Research Opportunity", "Publish bilateral thematic priorities and eligibility rules."],
      ["02", "Counterpart Pairing", "VN & RU PIs co-author and confirm partnership binding."],
      ["03", "Institutional Endorsement", "Organization representatives endorse institutional commitments."],
      ["04", "Eligibility Screening", "Administrative verification before peer review assignment."],
      ["05", "Double-blind Review", "Independent scoring with strict COI enforcement."],
      ["06", "Decision & PMS Launch", "Foundation issues joint decision, automatically bootstrapping PMS."],
    ],
  },
  ru: {
    kicker: "Научное сотрудничество РФ — СРВ",
    title: "Рабочее пространство научного сотрудничества",
    description:
      "Сквозной жизненный цикл: публикация конкурсов, двустороннее сопряжение заявок, институциональное подтверждение, независимая экспертиза, решения Фонда и запуск проектов.",
    tabs: {
      opportunities: "Конкурсы",
      proposals: "Заявки",
      screening: "Экспертиза соответствия",
      decisions: "Решения Фонда",
    },
    createOpportunity: "Создать конкурс",
    submitProposal: "Подать заявку",
    noOpportunities: "Нет опубликованных конкурсов.",
    noProposals: "Двусторонние заявки не найдены.",
    statusLabels: {
      DRAFT: "Черновик",
      PUBLISHED: "Приём заявок открыт",
      CLOSED: "Закрыт",
      COUNTERPART_PENDING: "Ожидает подтверждения партнёра",
      COUNTERPART_CONFIRMED: "Партнёр подтверждён",
      ENDORSED: "Организация подтвердила",
      SUBMITTED: "Официально подана",
      SCREENING: "Проверка соответствия",
      ELIGIBLE: "Соответствует",
      INELIGIBLE: "Не соответствует",
      IN_REVIEW: "На рецензировании",
      REVIEWED: "Рецензирование завершено",
      ACCEPTED: "Одобрено Фондом",
      REJECTED: "Отклонено",
    },
    budgetCap: "Лимит финансирования",
    timeline: "Сроки приёма",
    lead: "Руководитель (СРВ)",
    counterpart: "Руководитель (РФ)",
    endorsements: "Подтверждения",
    pipelineTitle: "Стандартизированный регламент двустороннего отбора",
    pipelineDesc: "Каждая заявка проходит 6 контрольных рубежей с чётким разграничением ответственности.",
    phases: [
      ["01", "Конкурс сотрудничества", "Публикация приоритетных направлений и условий финансирования."],
      ["02", "Сопряжение партнёров", "Совместная подготовка и обоюдное подтверждение заявки."],
      ["03", "Подтверждение институтов", "Согласование участия руководящими организациями."],
      ["04", "Формальная проверка", "Контроль соответствия регламенту перед направлением экспертам."],
      ["05", "Двойное рецензирование", "Независимая анонимная оценка с контролем конфликта интересов."],
      ["06", "Решение и запуск", "Принятие совместного решения Фонда и автоматический запуск в PMS."],
    ],
  },
};

export default function CollaborationWorkspaceView() {
  const { locale } = useLocale();
  const t = collabCopy[locale] || collabCopy.vi;
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"opportunities" | "proposals" | "screening" | "decisions">("opportunities");

  const capabilities = currentUser.data?.capabilities ?? [];
  const canCreateOpp = capabilities.includes("collab.opportunities.create");
  const canCreateProp = capabilities.includes("collab.proposals.create");
  const canScreen = capabilities.includes("collab.proposals.screen");
  const canDecide = capabilities.includes("collab.decisions.issue_foundation");

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="module-kicker inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="size-1.5 rounded-full bg-[var(--accent-network)]" />
            <span>{t.kicker}</span>
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-text-primary">
            {t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
            {t.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canCreateOpp && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>{t.createOpportunity}</span>
            </button>
          )}
          {canCreateProp && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-text-primary transition hover:bg-[var(--surface-secondary)]"
            >
              <span className="material-symbols-outlined text-lg">edit_document</span>
              <span>{t.submitProposal}</span>
            </button>
          )}
        </div>
      </div>

      {/* 6-Stage Governance Pipeline Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="pointer-events-none absolute right-8 top-8 size-24 opacity-[.035] [background:radial-gradient(circle,var(--accent-primary)_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-primary)]">
            Module 03 · Research Collaboration Lifecycle
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-text-primary">
            {t.pipelineTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
            {t.pipelineDesc}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {t.phases.map(([num, name, desc]) => (
            <div
              key={num}
              className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3.5 transition hover:border-[var(--accent-primary)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-xs font-black text-blue-600 dark:text-blue-400">
                  {num}
                </span>
                <span className="material-symbols-outlined text-base text-text-tertiary">arrow_forward</span>
              </div>
              <strong className="mt-2 block text-xs font-bold text-text-primary">{name}</strong>
              <p className="mt-1 text-[11px] leading-4 text-text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-8 flex border-b border-[var(--border)] gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("opportunities")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
            activeTab === "opportunities"
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          <span>{t.tabs.opportunities}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("proposals")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
            activeTab === "proposals"
              ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">contract</span>
          <span>{t.tabs.proposals}</span>
        </button>

        {canScreen && (
          <button
            type="button"
            onClick={() => setActiveTab("screening")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
              activeTab === "screening"
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">fact_check</span>
            <span>{t.tabs.screening}</span>
          </button>
        )}

        {canDecide && (
          <button
            type="button"
            onClick={() => setActiveTab("decisions")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
              activeTab === "decisions"
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-lg">gavel</span>
            <span>{t.tabs.decisions}</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === "opportunities" && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="material-symbols-outlined text-4xl text-text-tertiary">campaign</span>
            <p className="mt-3 text-sm font-semibold text-text-secondary">{t.noOpportunities}</p>
          </div>
        )}

        {activeTab === "proposals" && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="material-symbols-outlined text-4xl text-text-tertiary">description</span>
            <p className="mt-3 text-sm font-semibold text-text-secondary">{t.noProposals}</p>
          </div>
        )}

        {activeTab === "screening" && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="material-symbols-outlined text-4xl text-text-tertiary">fact_check</span>
            <p className="mt-3 text-sm font-semibold text-text-secondary">Không có hồ sơ nào đang chờ sàng lọc.</p>
          </div>
        )}

        {activeTab === "decisions" && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="material-symbols-outlined text-4xl text-text-tertiary">gavel</span>
            <p className="mt-3 text-sm font-semibold text-text-secondary">Chưa có quyết định tài trợ nào được ban hành.</p>
          </div>
        )}
      </div>
    </div>
  );
}
