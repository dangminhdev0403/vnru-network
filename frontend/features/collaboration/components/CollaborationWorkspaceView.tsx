"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { useCurrentUser } from "@/features/auth/server-state";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOpportunities } from "../hooks";
import { confirmAction, showError, showToast } from "@/lib/alerts";
import { CollabApiError, collabRepository, getApiErrorMessage } from "../repository";
import type { ResearchOpportunity } from "../types";

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
  publish: string;
  publishing: string;
  close: string;
  startProposal: string;
  modalProposalTitle: string;
  modalProposalDesc: string;
  vnParticipantLabel: string;
  ruParticipantLabel: string;
  contentLabel: string;
  contentPlaceholder: string;
  submittingProposal: string;
  createProposalSuccess: string;
  lifecycle: string;
  count: (value: number) => string;
  loadError: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  opportunity: string;
  userId: string;
  organizationRef: string;
  confirmCreate: string;
  confirmPublish: string;
  confirmClose: string;
  confirmProposal: string;
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
      ["06", "Quyết định & Dự án", "Quỹ chấp thuận cộng tác và bàn giao quyết định cho quy trình PMS."],
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
    publish: "Công bố",
    publishing: "Đang công bố…",
    close: "Đóng cơ hội",
    startProposal: "Bắt đầu đề xuất cộng tác",
    modalProposalTitle: "Khởi tạo Đề xuất Nghiên cứu Song phương",
    modalProposalDesc: "Đăng ký đề xuất nghiên cứu bắt cặp giữa đối tác Việt Nam và Liên bang Nga.",
    vnParticipantLabel: "Thành viên Việt Nam (PI VN)",
    ruParticipantLabel: "Thành viên Liên bang Nga (PI RU)",
    contentLabel: "Kế hoạch nghiên cứu song phương",
    contentPlaceholder: "Mô tả mục tiêu nghiên cứu, phương pháp luận và kế hoạch phối hợp song phương...",
    submittingProposal: "Đang khởi tạo đề xuất…",
    createProposalSuccess: "Đã tạo đề xuất thành công",
    lifecycle: "Vòng đời Cộng tác Nghiên cứu",
    count: (value) => `${value} mục`,
    loadError: "Không thể tải các cơ hội nghiên cứu",
    titlePlaceholder: "Ví dụ: Nghiên cứu ứng dụng trí tuệ nhân tạo trong y học biển",
    descriptionPlaceholder: "Chi tiết mục tiêu hợp tác nghiên cứu song phương…",
    opportunity: "Cơ hội nghiên cứu",
    userId: "Mã người dùng (UUID)",
    organizationRef: "Mã tổ chức",
    confirmCreate: "Xác nhận tạo cơ hội?",
    confirmPublish: "Xác nhận công bố cơ hội?",
    confirmClose: "Xác nhận đóng cơ hội?",
    confirmProposal: "Xác nhận tạo hồ sơ đề xuất?",
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
      ["06", "Decision & PMS Handoff", "Foundation issues the joint decision for the PMS workflow."],
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
    publish: "Publish",
    publishing: "Publishing…",
    close: "Close Opportunity",
    startProposal: "Start collaboration proposal",
    modalProposalTitle: "Initiate Bilateral Research Proposal",
    modalProposalDesc: "Register a paired research collaboration proposal between VN and RU partners.",
    vnParticipantLabel: "Vietnam Participant (VN PI)",
    ruParticipantLabel: "Russian Federation Participant (RU PI)",
    contentLabel: "Bilateral Research Plan Content",
    contentPlaceholder: "Detail research objectives, methodology, and bilateral division of work...",
    submittingProposal: "Initiating proposal…",
    createProposalSuccess: "Proposal initiated successfully",
    lifecycle: "Research Collaboration Lifecycle",
    count: (value) => `${value} items`,
    loadError: "Failed to load research opportunities",
    titlePlaceholder: "Example: Applying artificial intelligence to marine medicine",
    descriptionPlaceholder: "Describe the bilateral research collaboration objectives…",
    opportunity: "Research opportunity",
    userId: "User ID (UUID)",
    organizationRef: "Organization reference",
    confirmCreate: "Create this opportunity?",
    confirmPublish: "Publish this opportunity?",
    confirmClose: "Close this opportunity?",
    confirmProposal: "Create this proposal?",
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
      ["06", "Решение и передача", "Решение Фонда передаётся в процесс PMS."],
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
    publish: "Опубликовать",
    publishing: "Публикация…",
    close: "Закрыть конкурс",
    startProposal: "Подать совместную заявку",
    modalProposalTitle: "Инициация двусторонней научной заявки",
    modalProposalDesc: "Регистрация совместной научно-исследовательской заявки партнеров РФ и СРВ.",
    vnParticipantLabel: "Участник от Вьетнама (PI VN)",
    ruParticipantLabel: "Участник от РФ (PI RU)",
    contentLabel: "План совместных исследований",
    contentPlaceholder: "Описание целей исследований, методологии и двустороннего взаимодействия...",
    submittingProposal: "Создание заявки…",
    createProposalSuccess: "Заявка успешно создана",
    lifecycle: "Цикл научного сотрудничества",
    count: (value) => `${value} поз.`,
    loadError: "Не удалось загрузить научные возможности",
    titlePlaceholder: "Например: применение ИИ в морской медицине",
    descriptionPlaceholder: "Опишите цели двустороннего научного сотрудничества…",
    opportunity: "Научная возможность",
    userId: "Код пользователя (UUID)",
    organizationRef: "Код организации",
    confirmCreate: "Создать возможность?",
    confirmPublish: "Опубликовать возможность?",
    confirmClose: "Закрыть возможность?",
    confirmProposal: "Создать заявку?",
  },
};

export default function CollaborationWorkspaceView() {
  const { locale } = useLocale();
  const t = collabCopy[locale] || collabCopy.vi;
  const router = useRouter();
  const currentUser = useCurrentUser();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const [localDrafts, setLocalDrafts] = useState<ResearchOpportunity[]>([]);

  // Proposal modal state
  const [selectedOppForProposal, setSelectedOppForProposal] = useState<ResearchOpportunity | null>(null);
  const [proposalContent, setProposalContent] = useState("");
  const [vnUserId, setVnUserId] = useState("7809a72b-8a8e-49b8-897b-aa663ee38001");
  const [vnOrgRef, setVnOrgRef] = useState("ORG_001");
  const [ruUserId, setRuUserId] = useState("7809a72b-8a8e-49b8-897b-bb663ee38021");
  const [ruOrgRef, setRuOrgRef] = useState("ORG_002");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const {
    opportunities,
    isLoading,
    isError,
    error,
    refetch,
    createOpportunity,
    isCreating,
    publishOpportunity,
    isPublishing,
    closeOpportunity,
    isClosing,
  } = useOpportunities();

  const userData = currentUser.data as { id?: string; userId?: string; capabilities?: string[]; activeContext?: { contextId?: string; contextType?: string } } | undefined;
  const capabilities: string[] = userData?.capabilities ?? [];
  const currentUserId = userData?.userId || userData?.id;
  const canCreateOpp = capabilities.includes("collab.opportunities.create");
  const canPublishOpp = capabilities.includes("collab.opportunities.publish");
  const canCreateProposal = capabilities.includes("collab.proposals.create");

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (!(await confirmAction({ title: t.confirmCreate })).isConfirmed) return;

    try {
      const created = await createOpportunity({
        title: formTitle.trim(),
        description: formDesc.trim() || undefined,
      });
      if (created) {
        setLocalDrafts((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      }
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
          : getApiErrorMessage(err, t.loadError),
      );
    }
  };

  const handlePublishOpportunity = async (id: string) => {
    if (!(await confirmAction({ title: t.confirmPublish })).isConfirmed) return;
    try {
      await publishOpportunity(id);
      setLocalDrafts((prev) => prev.filter((item) => item.id !== id));
      showToast({ title: t.publish, icon: "success" });
      refetch();
    } catch (err) {
      showError(
        t.publish,
        err instanceof CollabApiError
          ? err.message
          : getApiErrorMessage(err, t.loadError),
      );
    }
  };

  const handleCloseOpportunity = async (id: string) => {
    if (!(await confirmAction({ title: t.confirmClose, isDestructive: true })).isConfirmed) return;
    try {
      await closeOpportunity(id);
      showToast({ title: t.close, icon: "success" });
      refetch();
    } catch (err) {
      showError(
        t.close,
        err instanceof CollabApiError
          ? err.message
          : getApiErrorMessage(err, t.loadError),
      );
    }
  };

  const openProposalModal = (opp: ResearchOpportunity) => {
    setSelectedOppForProposal(opp);
    setProposalContent("");
    if (currentUserId && userData?.activeContext?.contextId === "ORG_001") {
      setVnUserId(currentUserId);
      setVnOrgRef("ORG_001");
    } else if (currentUserId && userData?.activeContext?.contextId === "ORG_002") {
      setRuUserId(currentUserId);
      setRuOrgRef("ORG_002");
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppForProposal || !proposalContent.trim()) return;
    if (!(await confirmAction({ title: t.confirmProposal })).isConfirmed) return;

    setIsSubmittingProposal(true);
    try {
      const created = await collabRepository.createProposal({
        opportunityId: selectedOppForProposal.id,
        content: proposalContent.trim(),
        vnParticipant: {
          userId: vnUserId.trim(),
          organizationRef: vnOrgRef.trim(),
        },
        ruParticipant: {
          userId: ruUserId.trim(),
          organizationRef: ruOrgRef.trim(),
        },
      });

      showToast({ title: t.createProposalSuccess, icon: "success" });
      setSelectedOppForProposal(null);
      router.push(`/workspace/collaboration/proposals/${encodeURIComponent(created.id)}`);
    } catch (err) {
      showError(
        t.startProposal,
        err instanceof CollabApiError
          ? err.message
          : getApiErrorMessage(err, t.loadError),
      );
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Combine local drafts and query results
  const allOpportunities = [
    ...localDrafts.filter((draft) => !opportunities.some((o) => o.id === draft.id)),
    ...opportunities,
  ];

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
            {t.lifecycle}
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
            {t.count(allOpportunities.length)}
          </span>
        </div>

        <div className="mt-6">
          {isLoading && allOpportunities.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-secondary">{t.loading}</div>
          ) : isError && allOpportunities.length === 0 ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
              {error instanceof Error ? error.message : t.loadError}
            </div>
          ) : allOpportunities.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
              <span className="material-symbols-outlined text-4xl text-text-tertiary">campaign</span>
              <p className="mt-3 text-sm font-semibold text-text-secondary">{t.noOpportunities}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allOpportunities.map((opp) => (
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
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
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

                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-text-secondary">{t.createdAt}</span>
                      <span className="text-xs font-mono font-medium text-text-primary">
                        {opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : "—"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {opp.state === "DRAFT" && canPublishOpp && (
                        <button
                          type="button"
                          disabled={isPublishing}
                          onClick={() => handlePublishOpportunity(opp.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm">publish</span>
                          <span>{isPublishing ? t.publishing : t.publish}</span>
                        </button>
                      )}

                      {opp.state === "PUBLISHED" && canPublishOpp && (
                        <button
                          type="button"
                          disabled={isClosing}
                          aria-busy={isClosing}
                          onClick={() => handleCloseOpportunity(opp.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-[var(--surface)] transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">lock</span>
                          <span>{t.close}</span>
                        </button>
                      )}

                      {opp.state === "PUBLISHED" && canCreateProposal && (
                        <button
                          type="button"
                          onClick={() => openProposalModal(opp)}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-700 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm">post_add</span>
                          <span>{t.startProposal}</span>
                        </button>
                      )}
                    </div>
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
                  placeholder={t.titlePlaceholder}
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">{t.fieldDesc}</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
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
                  aria-busy={isCreating}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isCreating ? t.creating : t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Proposal Modal */}
      {selectedOppForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl my-8">
            <h2 className="text-lg font-bold text-text-primary">{t.modalProposalTitle}</h2>
            <p className="mt-1 text-xs text-text-secondary">{t.modalProposalDesc}</p>

            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3.5 text-xs">
              <span className="font-bold text-text-secondary uppercase tracking-wider block">{t.opportunity}:</span>
              <span className="font-semibold text-text-primary text-sm mt-0.5 block">{selectedOppForProposal.title}</span>
              <span className="font-mono text-[11px] text-text-tertiary block mt-1">ID: {selectedOppForProposal.id}</span>
            </div>

            <form onSubmit={handleCreateProposal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">{t.contentLabel} *</label>
                <textarea
                  value={proposalContent}
                  onChange={(e) => setProposalContent(e.target.value)}
                  placeholder={t.contentPlaceholder}
                  rows={4}
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-[var(--border)] p-3 bg-[var(--surface-secondary)]">
                  <span className="text-xs font-bold text-text-primary block">{t.vnParticipantLabel}</span>
                  <div>
                    <label className="text-[11px] text-text-secondary block">{t.userId}</label>
                    <input
                      type="text"
                      value={vnUserId}
                      onChange={(e) => setVnUserId(e.target.value)}
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-xs font-mono text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary block">{t.organizationRef}</label>
                    <input
                      type="text"
                      value={vnOrgRef}
                      onChange={(e) => setVnOrgRef(e.target.value)}
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-xs font-mono text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2 rounded-xl border border-[var(--border)] p-3 bg-[var(--surface-secondary)]">
                  <span className="text-xs font-bold text-text-primary block">{t.ruParticipantLabel}</span>
                  <div>
                    <label className="text-[11px] text-text-secondary block">{t.userId}</label>
                    <input
                      type="text"
                      value={ruUserId}
                      onChange={(e) => setRuUserId(e.target.value)}
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-xs font-mono text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary block">{t.organizationRef}</label>
                    <input
                      type="text"
                      value={ruOrgRef}
                      onChange={(e) => setRuOrgRef(e.target.value)}
                      required
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-xs font-mono text-text-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOppForProposal(null)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-[var(--surface-secondary)] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  aria-busy={isSubmittingProposal}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isSubmittingProposal ? t.submittingProposal : t.startProposal}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
