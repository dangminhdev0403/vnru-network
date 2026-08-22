"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { useCurrentUser } from "@/features/auth/server-state";
import React, { useState } from "react";
import { useOpportunities } from "../hooks";
import { showError, showToast } from "@/lib/alerts";
import { CollabApiError, getApiErrorMessage } from "../repository";

interface Copy {
  kicker: string;
  title: string;
  description: string;
  opportunitiesTab: string;
  createOpportunity: string;
  noOpportunities: string;
  statusLabels: Record<string, string>;
  createdAt: string;
  pipelineTitle: string;
  pipelineDesc: string;
  phases: [string, string, string][];
  modalCreateTitle: string;
  modalCreateDesc: string;
  fieldTitle: string;
  fieldDesc: string;
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
      "Quy trình phối hợp toàn diện từ công bố cơ hội, bắt cặp đề xuất song phương, xác nhận tổ chức, bình duyệt chuyên gia đến chấp thuận cộng tác và triển khai dự án.",
    opportunitiesTab: "Cơ hội cộng tác nghiên cứu",
    createOpportunity: "Tạo cơ hội mới",
    noOpportunities: "Chưa có cơ hội nghiên cứu nào được công bố.",
    statusLabels: {
      DRAFT: "Bản nháp",
      PUBLISHED: "Đang mở tiếp nhận",
      CLOSED: "Đã đóng",
      ACCEPTED: "Quỹ chấp thuận cộng tác",
      REJECTED: "Không chấp thuận",
    },
    createdAt: "Ngày tạo",
    pipelineTitle: "Quy trình Phê duyệt Song phương Chuẩn hóa",
    pipelineDesc: "Mỗi đề xuất trải qua 6 chặng kiểm soát nghiêm ngặt với trách nhiệm phân định rõ ràng.",
    phases: [
      ["01", "Cơ hội Nghiên cứu", "Công bố cơ hội & tiêu chí ưu tiên song phương."],
      ["02", "Bắt cặp Song phương", "Chủ nhiệm VN & RU hoàn thiện hồ sơ và xác nhận liên danh."],
      ["03", "Xác nhận Tổ chức", "Đại diện viện/trường phê duyệt cam kết cơ sở vật chất."],
      ["04", "Sàng lọc Hồ sơ", "Kiểm tra tính hợp lệ trước khi chuyển hội đồng bình duyệt."],
      ["05", "Bình duyệt Chuyên gia", "Chấm điểm độc lập, ẩn danh và ngăn chặn xung đột lợi ích."],
      ["06", "Quyết định & Dự án", "Quỹ chấp thuận cộng tác và tự động khởi tạo dự án PMS."],
    ],
    modalCreateTitle: "Tạo Cơ hội Cộng tác Nghiên cứu",
    modalCreateDesc: "Nhập thông tin tiêu đề và định hướng nghiên cứu ưu tiên.",
    fieldTitle: "Tiêu đề cơ hội",
    fieldDesc: "Mô tả mục tiêu & định hướng nghiên cứu",
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
      "End-to-end governance lifecycle from opportunity publishing, bilateral counterpart pairing, institutional endorsements, double-blind peer review to joint collaboration decisions and PMS tracking.",
    opportunitiesTab: "Research Opportunities",
    createOpportunity: "Create Opportunity",
    noOpportunities: "No research opportunities published yet.",
    statusLabels: {
      DRAFT: "Draft",
      PUBLISHED: "Open for Proposals",
      CLOSED: "Closed",
      ACCEPTED: "Foundation Collaboration Approved",
      REJECTED: "Rejected",
    },
    createdAt: "Created on",
    pipelineTitle: "Standardized Bilateral Governance Pipeline",
    pipelineDesc: "Each proposal undergoes 6 verification gates with rigorous separation of duties.",
    phases: [
      ["01", "Research Opportunity", "Publish bilateral thematic priorities and eligibility rules."],
      ["02", "Counterpart Pairing", "VN & RU PIs co-author and confirm partnership binding."],
      ["03", "Institutional Endorsement", "Organization representatives endorse institutional commitments."],
      ["04", "Eligibility Screening", "Administrative verification before peer review assignment."],
      ["05", "Double-blind Review", "Independent scoring with strict COI enforcement."],
      ["06", "Decision & PMS Launch", "Foundation issues joint collaboration decision, bootstrapping PMS."],
    ],
    modalCreateTitle: "Create Research Opportunity",
    modalCreateDesc: "Provide opportunity metadata and research objective priorities.",
    fieldTitle: "Opportunity Title",
    fieldDesc: "Research Objectives & Priorities",
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
    opportunitiesTab: "Конкурсы сотрудничества",
    createOpportunity: "Создать конкурс",
    noOpportunities: "Нет опубликованных конкурсов.",
    statusLabels: {
      DRAFT: "Черновик",
      PUBLISHED: "Приём заявок открыт",
      CLOSED: "Закрыт",
      ACCEPTED: "Одобрено Фондом",
      REJECTED: "Отклонено",
    },
    createdAt: "Дата создания",
    pipelineTitle: "Стандартизированный регламент двустороннего отбора",
    pipelineDesc: "Каждая заявка проходит 6 контрольных рубежей с чётким разграничением ответственности.",
    phases: [
      ["01", "Конкурс сотрудничества", "Публикация приоритетных направлений и условий."],
      ["02", "Сопряжение партнёров", "Совместная подготовка и обоюдное подтверждение заявки."],
      ["03", "Подтверждение институтов", "Согласование участия руководящими организациями."],
      ["04", "Формальная проверка", "Контроль соответствия регламенту перед направлением экспертам."],
      ["05", "Двойное рецензирование", "Независимая анонимная оценка с контролем конфликта интересов."],
      ["06", "Решение и запуск", "Принятие совместного решения Фонда и запуск в PMS."],
    ],
    modalCreateTitle: "Создать конкурс сотрудничества",
    modalCreateDesc: "Укажите название и приоритетные направления исследований.",
    fieldTitle: "Название конкурса",
    fieldDesc: "Цели и направления исследований",
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const { opportunities, isLoading, isError, error, refetch, createOpportunity, isCreating } = useOpportunities();

  const capabilities: string[] = (currentUser.data as { capabilities?: string[] })?.capabilities ?? [];
  const canCreateOpp = capabilities.includes("collab.opportunities.create");

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      await createOpportunity({
        title: formTitle.trim(),
        description: formDesc.trim() || undefined,
      });
      showToast({ title: t.submit, icon: "success" });
      setIsCreateModalOpen(false);
      setFormTitle("");
      setFormDesc("");
      refetch();
    } catch (err) {
      showError(
        t.submit,
        err instanceof CollabApiError
          ? err.message
          : getApiErrorMessage(err, "Create failed"),
      );
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

      {/* Opportunities Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-primary)]">
            <span className="material-symbols-outlined text-lg">campaign</span>
            <span>{t.opportunitiesTab}</span>
          </div>
          <span className="text-xs font-medium text-text-secondary">
            {opportunities.length} mục
          </span>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-text-secondary">{t.loading}</div>
          ) : isError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
              {error instanceof Error ? error.message : "Failed to load opportunities"}
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
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          opp.state === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : opp.state === "CLOSED"
                            ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                        }`}
                      >
                        {t.statusLabels[opp.state] || opp.state}
                      </span>
                      <span className="text-[11px] font-mono text-text-secondary">
                        {opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-text-primary">{opp.title}</h3>
                    {opp.description && (
                      <p className="mt-2 text-xs leading-5 text-text-secondary line-clamp-3">
                        {opp.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-secondary">{t.createdAt}</span>
                    <span className="text-xs font-mono font-medium text-text-primary">
                      {opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Opportunity Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-text-primary">{t.modalCreateTitle}</h2>
            <p className="mt-1 text-xs text-text-secondary">{t.modalCreateDesc}</p>

            <form onSubmit={handleCreateOpportunity} className="mt-4 space-y-4">
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
                  rows={4}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                />
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
