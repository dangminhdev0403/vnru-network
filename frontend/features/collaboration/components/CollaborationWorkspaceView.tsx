"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { useCurrentUser } from "@/features/auth/server-state";
import React, { useState } from "react";
import { useOpportunities } from "../hooks";
import { showError, showToast } from "@/lib/alerts";
import { CollabApiError } from "../repository";

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
  timeline: string;
  lead: string;
  counterpart: string;
  endorsements: string;
  pipelineTitle: string;
  pipelineDesc: string;
  phases: [string, string, string][];
  modalCreateTitle: string;
  modalCreateDesc: string;
  fieldCode: string;
  fieldTitle: string;
  fieldDesc: string;
  fieldOpenDate: string;
  fieldCloseDate: string;
  cancel: string;
  submit: string;
  creating: string;
  loading: string;
  retry: string;
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
      ACCEPTED: "Quỹ phê duyệt",
      REJECTED: "Không chấp thuận",
    },
    timeline: "Thời hạn nhận hồ sơ",
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
    modalCreateTitle: "Tạo Cơ hội Cộng tác Nghiên cứu",
    modalCreateDesc: "Nhập thông tin chương trình và thiết lập khung thời gian tiếp nhận hồ sơ.",
    fieldCode: "Mã cơ hội (Code)",
    fieldTitle: "Tiêu đề cơ hội",
    fieldDesc: "Mô tả mục tiêu & định hướng nghiên cứu",
    fieldOpenDate: "Ngày mở tiếp nhận",
    fieldCloseDate: "Ngày đóng tiếp nhận",
    cancel: "Hủy",
    submit: "Tạo cơ hội",
    creating: "Đang tạo…",
    loading: "Đang tải dữ liệu cơ hội…",
    retry: "Làm mới",
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
    modalCreateTitle: "Create Research Opportunity",
    modalCreateDesc: "Provide opportunity metadata and define submission timeline windows.",
    fieldCode: "Opportunity Code",
    fieldTitle: "Opportunity Title",
    fieldDesc: "Research Objectives & Priorities",
    fieldOpenDate: "Open Date",
    fieldCloseDate: "Close Date",
    cancel: "Cancel",
    submit: "Create Opportunity",
    creating: "Creating…",
    loading: "Loading opportunities…",
    retry: "Refresh",
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
    timeline: "Сроки приёма",
    lead: "Руководитель (СРВ)",
    counterpart: "Руководитель (РФ)",
    endorsements: "Подтверждения",
    pipelineTitle: "Стандартизированный регламент двустороннего отбора",
    pipelineDesc: "Каждая заявка проходит 6 контрольных рубежей с чётким разграничением ответственности.",
    phases: [
      ["01", "Конкурс сотрудничества", "Публикация приоритетных направлений и условий."],
      ["02", "Сопряжение партнёров", "Совместная подготовка и обоюдное подтверждение заявки."],
      ["03", "Подтверждение институтов", "Согласование участия руководящими организациями."],
      ["04", "Формальная проверка", "Контроль соответствия регламенту перед направлением экспертам."],
      ["05", "Двойное рецензирование", "Независимая анонимная оценка с контролем конфликта интересов."],
      ["06", "Решение и запуск", "Принятие совместного решения Фонда и автоматический запуск в PMS."],
    ],
    modalCreateTitle: "Создать конкурс сотрудничества",
    modalCreateDesc: "Укажите параметры конкурса и установите временные рамки приёма заявок.",
    fieldCode: "Код конкурса",
    fieldTitle: "Название конкурса",
    fieldDesc: "Цели и направления исследований",
    fieldOpenDate: "Дата начала приёма",
    fieldCloseDate: "Дата окончания приёма",
    cancel: "Отмена",
    submit: "Создать",
    creating: "Создание…",
    loading: "Загрузка данных…",
    retry: "Обновить",
  },
};

export default function CollaborationWorkspaceView() {
  const { locale } = useLocale();
  const t = collabCopy[locale] || collabCopy.vi;
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"opportunities" | "proposals" | "screening" | "decisions">("opportunities");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formCode, setFormCode] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOpenDate, setFormOpenDate] = useState("");
  const [formCloseDate, setFormCloseDate] = useState("");

  const { opportunities, isLoading, isError, error, refetch, createOpportunity, isCreating } = useOpportunities();

  const capabilities: string[] = (currentUser.data as { capabilities?: string[] })?.capabilities ?? [];
  const canCreateOpp = capabilities.includes("collab.opportunities.create");
  const canCreateProp = capabilities.includes("collab.proposals.create");
  const canScreen = capabilities.includes("collab.proposals.screen");
  const canDecide = capabilities.includes("collab.decisions.issue_foundation");

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formTitle || !formDesc || !formOpenDate || !formCloseDate) return;

    try {
      await createOpportunity({
        code: formCode.trim(),
        title: formTitle.trim(),
        description: formDesc.trim(),
        openDate: new Date(formOpenDate).toISOString(),
        closeDate: new Date(formCloseDate).toISOString(),
      });
      showToast({ title: t.submit, icon: "success" });
      setIsCreateModalOpen(false);
      setFormCode("");
      setFormTitle("");
      setFormDesc("");
      setFormOpenDate("");
      setFormCloseDate("");
    } catch (err) {
      showError(t.submit, err instanceof CollabApiError ? err.message : "Create failed");
    }
  };

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
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold text-text-primary hover:bg-[var(--surface-secondary)] transition cursor-pointer"
          >
            <span className={`material-symbols-outlined text-base ${isLoading ? "animate-spin" : ""}`}>refresh</span>
            <span>{t.retry}</span>
          </button>
          {canCreateOpp && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-[14px] bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>{t.createOpportunity}</span>
            </button>
          )}
          {canCreateProp && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-text-primary transition hover:bg-[var(--surface-secondary)] cursor-pointer"
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
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
            Cộng tác Nghiên cứu Song phương · Research Collaboration Lifecycle
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
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition cursor-pointer ${
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
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition cursor-pointer ${
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
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition cursor-pointer ${
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
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition cursor-pointer ${
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
          <div>
            {isLoading ? (
              <div className="p-8 text-center text-sm text-text-secondary">{t.loading}</div>
            ) : isError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                {error?.message || "Failed to load opportunities"}
              </div>
            ) : opportunities.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
                <span className="material-symbols-outlined text-4xl text-text-tertiary">campaign</span>
                <p className="mt-3 text-sm font-semibold text-text-secondary">{t.noOpportunities}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-primary)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-text-secondary">
                          {opp.code}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            opp.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : opp.status === "CLOSED"
                              ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                          }`}
                        >
                          {t.statusLabels[opp.status] || opp.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-text-primary">{opp.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-text-secondary line-clamp-3">{opp.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <span className="text-[11px] font-semibold text-text-secondary block">{t.timeline}</span>
                      <span className="text-xs font-mono font-medium text-text-primary">
                        {new Date(opp.openDate).toLocaleDateString()} — {new Date(opp.closeDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <p className="mt-3 text-sm font-semibold text-text-secondary">Chưa có quyết định nào được ban hành.</p>
          </div>
        )}
      </div>

      {/* Create Opportunity Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-text-primary">{t.modalCreateTitle}</h2>
            <p className="mt-1 text-xs text-text-secondary">{t.modalCreateDesc}</p>

            <form onSubmit={handleCreateOpportunity} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">{t.fieldCode}</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="e.g. VNRU-2026-AI"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">{t.fieldTitle}</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Nghiên cứu ứng dụng Trí tuệ Nhân tạo trong Y học Biển"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">{t.fieldDesc}</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Chi tiết về mục tiêu hợp tác nghiên cứu song phương..."
                  rows={3}
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">{t.fieldOpenDate}</label>
                  <input
                    type="date"
                    value={formOpenDate}
                    onChange={(e) => setFormOpenDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">{t.fieldCloseDate}</label>
                  <input
                    type="date"
                    value={formCloseDate}
                    onChange={(e) => setFormCloseDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-[var(--surface-secondary)] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isCreating ? t.creating : t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
