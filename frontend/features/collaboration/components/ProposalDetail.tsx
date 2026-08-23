"use client";

import * as React from "react";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/server-state";
import { useProposal, useProposalMutations } from "../hooks";
import { useEvaluationRecommendation } from "@/features/reviews/hooks";
import { confirmAndRun, showError, showToast } from "@/lib/alerts";
import { CollabApiError, getApiErrorMessage } from "../repository";
import { useLocale, type Locale } from "@/app/HomeMotion";
import { BootstrapProjectButton } from "@/features/projects/components/BootstrapProjectButton";

const proposalDetailCopy: Record<Locale, {
  title: string;
  loading: string;
  retry: string;
  notFound: string;
  status: string;
  revision: string;
  participantsTitle: string;
  participant: string;
  confirmed: string;
  endorsed: string;
  yes: string;
  no: string;
  researchPlan: string;
  planContent: string;
  saveRevision: string;
  confirmPairing: string;
  endorseProposal: string;
  submitProposal: string;
  governanceDecision: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  eligible: string;
  ineligible: string;
  approve: string;
  reject: string;
  requestRevision: string;
  stateBadge: Record<string, string>;
  finalStateNotice: string;
  actionSuccess: string;
  requestFailed: string;
  opportunity: string;
  vietnam: string;
  russia: string;
  user: string;
  organization: string;
  reviewSummaryTitle: string;
  totalReviews: string;
  scientificMerit: string;
  feasibility: string;
  bilateralValue: string;
  impact: string;
  overallScore: string;
  pendingReviewNotice: string;
}> = {
  vi: {
    title: "Đề xuất Cộng tác Nghiên cứu Song phương",
    loading: "Đang tải chi tiết đề xuất…",
    retry: "Thử lại",
    notFound: "Không tìm thấy đề xuất nghiên cứu.",
    status: "Trạng thái",
    revision: "Phiên bản",
    participantsTitle: "Thành viên Liên danh Song phương",
    participant: "Thành viên",
    confirmed: "Xác nhận liên danh",
    endorsed: "Tổ chức bảo lãnh",
    yes: "Đã xác nhận",
    no: "Chưa xác nhận",
    researchPlan: "Kế hoạch Nghiên cứu",
    planContent: "Nội dung kế hoạch",
    saveRevision: "Lưu bản sửa đổi",
    confirmPairing: "Xác nhận liên danh bắt cặp",
    endorseProposal: "Phê duyệt bảo lãnh tổ chức",
    submitProposal: "Nộp hồ sơ chính thức",
    governanceDecision: "Quyết định Quy trình Phê duyệt",
    reasonLabel: "Lý do / Căn cứ thẩm định",
    reasonPlaceholder: "Nhập lý do hoặc căn cứ ra quyết định...",
    eligible: "Hồ sơ Hợp lệ (Đủ điều kiện)",
    ineligible: "Hồ sơ Không hợp lệ",
    approve: "Quỹ chấp thuận hợp tác",
    reject: "Không chấp thuận",
    requestRevision: "Yêu cầu chỉnh sửa hoàn thiện",
    stateBadge: {
      DRAFT: "Bản nháp",
      PAIRED_CONFIRMED: "Đã xác nhận cặp",
      SUBMITTED: "Đã nộp hồ sơ",
      ELIGIBLE: "Đủ điều kiện thẩm định",
      INELIGIBLE: "Không đủ điều kiện",
      REVISION_REQUESTED: "Yêu cầu chỉnh sửa",
      APPROVED: "Quỹ đã chấp thuận",
      REJECTED: "Đã từ chối",
    },
    finalStateNotice: "Đề xuất đã ở trạng thái quyết định cuối cùng. Không thể chỉnh sửa thêm.",
    actionSuccess: "Thực hiện tác vụ thành công",
    requestFailed: "Yêu cầu thất bại",
    opportunity: "Cơ hội",
    vietnam: "Việt Nam (VN)",
    russia: "Liên bang Nga (RU)",
    user: "Người dùng",
    organization: "Tổ chức",
    reviewSummaryTitle: "Báo cáo Tổng hợp Bình duyệt Độc lập (An toàn & Ẩn danh)",
    totalReviews: "Số lượt chuyên gia đã đánh giá",
    scientificMerit: "Giá trị khoa học",
    feasibility: "Tính khả thi",
    bilateralValue: "Giá trị song phương",
    impact: "Mức độ tác động",
    overallScore: "Điểm tổng hợp",
    pendingReviewNotice: "Chưa có kết quả phản biện hợp lệ. Quỹ chỉ có thể ra quyết định khi đã có báo cáo bình duyệt chuyên gia.",
  },
  en: {
    title: "Bilateral Research Collaboration Proposal",
    loading: "Loading proposal details…",
    retry: "Retry",
    notFound: "Proposal not found.",
    status: "Status",
    revision: "Revision",
    participantsTitle: "Bilateral Consortium Participants",
    participant: "Participant",
    confirmed: "Pairing Confirmed",
    endorsed: "Institutional Endorsement",
    yes: "Confirmed",
    no: "Pending",
    researchPlan: "Research Plan",
    planContent: "Plan Content",
    saveRevision: "Save Revision",
    confirmPairing: "Confirm Counterpart Pairing",
    endorseProposal: "Endorse Institutional Commitment",
    submitProposal: "Submit Official Proposal",
    governanceDecision: "Governance Workflow Decision",
    reasonLabel: "Decision Grounds / Rationale",
    reasonPlaceholder: "Enter justification or review rationale...",
    eligible: "Screen Eligible",
    ineligible: "Screen Ineligible",
    approve: "Approve Collaboration",
    reject: "Reject Proposal",
    requestRevision: "Request Revision",
    stateBadge: {
      DRAFT: "Draft",
      PAIRED_CONFIRMED: "Pairing Confirmed",
      SUBMITTED: "Submitted",
      ELIGIBLE: "Eligible for Review",
      INELIGIBLE: "Ineligible",
      REVISION_REQUESTED: "Revision Requested",
      APPROVED: "Foundation Approved",
      REJECTED: "Rejected",
    },
    finalStateNotice: "Proposal is in final decision state. No further mutations allowed.",
    actionSuccess: "Action performed successfully",
    requestFailed: "Request failed",
    opportunity: "Opportunity",
    vietnam: "Vietnam (VN)",
    russia: "Russian Federation (RU)",
    user: "User",
    organization: "Organization",
    reviewSummaryTitle: "Independent Review Aggregate Summary (Anonymized)",
    totalReviews: "Total Submitted Reviews",
    scientificMerit: "Scientific Merit",
    feasibility: "Feasibility",
    bilateralValue: "Bilateral Value",
    impact: "Impact",
    overallScore: "Overall Average Score",
    pendingReviewNotice: "No submitted reviews yet. Decision requires at least one submitted independent review.",
  },
  ru: {
    title: "Заявка на совместное научное сотрудничество",
    loading: "Загрузка данных заявки…",
    retry: "Повторить",
    notFound: "Заявка не найдена.",
    status: "Статус",
    revision: "Версия",
    participantsTitle: "Участники двустороннего консорциума",
    participant: "Участник",
    confirmed: "Сопряжение подтверждено",
    endorsed: "Институциональное согласие",
    yes: "Подтверждено",
    no: "Ожидается",
    researchPlan: "План исследований",
    planContent: "Содержание плана",
    saveRevision: "Сохранить изменения",
    confirmPairing: "Подтвердить сопряжение",
    endorseProposal: "Согласовать от организации",
    submitProposal: "Подать официальную заявку",
    governanceDecision: "Регламентное решение",
    reasonLabel: "Обоснование / Основание решения",
    reasonPlaceholder: "Укажите основание или комментарии к решению...",
    eligible: "Соответствует условиям",
    ineligible: "Не соответствует условиям",
    approve: "Одобрить сотрудничество",
    reject: "Отклонить заявку",
    requestRevision: "Запросить доработку",
    stateBadge: {
      DRAFT: "Черновик",
      PAIRED_CONFIRMED: "Сопряжение подтверждено",
      SUBMITTED: "Заявка подана",
      ELIGIBLE: "Допущена к экспертизе",
      INELIGIBLE: "Не допущена",
      REVISION_REQUESTED: "Требуется доработка",
      APPROVED: "Одобрено Фондом",
      REJECTED: "Отклонено",
    },
    finalStateNotice: "Заявка находится в финальном статусе. Изменения не допускаются.",
    actionSuccess: "Действие успешно выполнено",
    requestFailed: "Запрос не выполнен",
    opportunity: "Возможность",
    vietnam: "Вьетнам (VN)",
    russia: "Российская Федерация (RU)",
    user: "Пользователь",
    organization: "Организация",
    reviewSummaryTitle: "Сводный отчет независимой экспертизы (анонимный)",
    totalReviews: "Всего рецензий",
    scientificMerit: "Научная ценность",
    feasibility: "Практическая реализуемость",
    bilateralValue: "Двусторонняя значимость",
    impact: "Потенциал влияния",
    overallScore: "Итоговый средний балл",
    pendingReviewNotice: "Рецензии пока отсутствуют. Для принятия решения требуется как минимум одна экспертная оценка.",
  },
};

export function ProposalDetail({ id }: { id: string }) {
  const { locale } = useLocale();
  const t = proposalDetailCopy[locale] || proposalDetailCopy.vi;
  const { proposal, isLoading, isError, error, refetch } = useProposal(id);
  const actions = useProposalMutations();
  const { data: user } = useCurrentUser();

  const [content, setContent] = useState("");
  const [reason, setReason] = useState("");

  const caps = (user as { capabilities?: string[] })?.capabilities ?? [];
  const canViewRecommendation =
    caps.includes("collab.decisions.issue_foundation") ||
    caps.includes("reviews.recommendations.view") ||
    caps.includes("reviews.assignments.manage");
  const isPostScreeningState =
    proposal?.state === "ELIGIBLE" ||
    proposal?.state === "APPROVED" ||
    proposal?.state === "REJECTED" ||
    proposal?.state === "REVISION_REQUESTED";

  const { recommendation, isLoading: isRecLoading } = useEvaluationRecommendation(
    id,
    Boolean(proposal && isPostScreeningState && canViewRecommendation),
  );

  const run = async (action: () => Promise<unknown>) => {
    try {
      if (!(await confirmAndRun(action))) return;
      showToast({ title: t.actionSuccess, icon: "success" });
      await refetch();
    } catch (err) {
      showError(
        t.title,
        err instanceof CollabApiError ? err.message : getApiErrorMessage(err, t.requestFailed),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center" aria-live="polite">
        <span className="material-symbols-outlined animate-spin text-3xl text-blue-600">sync</span>
        <p className="mt-2 text-sm text-text-secondary">{t.loading}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-5xl p-8 text-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <p role="alert" className="font-semibold">
            {error instanceof Error ? error.message : t.requestFailed}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 cursor-pointer"
          >
            {t.retry}
          </button>
        </div>
      </section>
    );
  }

  if (!proposal) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center">
        <p className="text-sm font-semibold text-text-secondary">{t.notFound}</p>
      </div>
    );
  }

  const state = proposal.state;
  const isDraft = state === "DRAFT";
  const isPairedConfirmed = state === "PAIRED_CONFIRMED";
  const isSubmitted = state === "SUBMITTED";
  const isEligible = state === "ELIGIBLE";
  const isRevisionRequested = state === "REVISION_REQUESTED";
  const isFinal = state === "APPROVED" || state === "REJECTED" || state === "INELIGIBLE";

  const canSaveRevision = (isDraft || isRevisionRequested) && caps.includes("collab.proposals.create");
  const canConfirmPairing = isDraft && caps.includes("collab.proposals.confirm_paired");
  const canEndorse = isPairedConfirmed && caps.includes("collab.proposals.endorse");
  const canSubmit = isPairedConfirmed && caps.includes("collab.proposals.submit");
  const canScreen = isSubmitted && caps.includes("collab.proposals.screen");
  const canDecide = isEligible && caps.includes("collab.decisions.issue_foundation");

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {/* Header */}
      <header className="app-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
              state === "APPROVED"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : state === "REJECTED" || state === "INELIGIBLE"
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                : state === "ELIGIBLE"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                : state === "SUBMITTED"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
            }`}
          >
            {t.stateBadge[state] || state}
          </span>
          <p className="font-mono text-xs text-text-secondary">
            {t.revision}: #{proposal.revision}
          </p>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">{t.title}</h1>
        <p className="mt-1 font-mono text-xs text-text-tertiary">ID: {proposal.id}</p>
        {proposal.opportunityId && (
          <p className="mt-1 font-mono text-xs text-text-tertiary">{t.opportunity}: {proposal.opportunityId}</p>
        )}
      </header>

      {/* Bilateral Team */}
      <section className="space-y-3" aria-label={t.participantsTitle}>
        <h2 className="text-base font-bold text-text-primary">{t.participantsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {proposal.participants.map((participant) => {
            const hasConfirmed = proposal.confirmations.some(
              (item) => item.participantId === participant.userId && item.confirmed,
            );
            const hasEndorsed = proposal.endorsements.some(
              (item) => item.organizationRef === participant.organizationRef && item.endorsed,
            );

            return (
              <article
                className="app-panel p-5 space-y-2 border border-[var(--border)]"
                key={participant.userId}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-text-primary">
                    {participant.country === "VN" ? t.vietnam : t.russia}
                  </span>
                  <span className="text-xs font-bold text-blue-600 uppercase">{participant.country}</span>
                </div>
                <div className="text-xs space-y-1">
                  <p className="break-all font-mono text-text-secondary">{t.user}: {participant.userId}</p>
                  <p className="font-mono text-text-secondary">{t.organization}: {participant.organizationRef}</p>
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-3 text-xs">
                  <span className={hasConfirmed ? "text-emerald-600 font-semibold" : "text-amber-600 font-medium"}>
                    {t.confirmed}: {hasConfirmed ? t.yes : t.no}
                  </span>
                  <span className={hasEndorsed ? "text-emerald-600 font-semibold" : "text-amber-600 font-medium"}>
                    {t.endorsed}: {hasEndorsed ? t.yes : t.no}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Research Plan & Actions */}
      <section className="app-panel space-y-4 p-6">
        <h2 className="text-lg font-bold text-text-primary">{t.researchPlan}</h2>
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-1">
            {t.planContent}
          </label>
          <textarea
            className="w-full min-h-40 rounded-xl border border-card-border bg-card-background p-3 text-sm text-text-primary outline-none focus:border-blue-500 disabled:opacity-75"
            value={content || proposal.content}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
            disabled={!canSaveRevision || actions.isPending}
          />
        </div>

        {/* Action buttons gated by state and capability */}
        <div className="flex flex-wrap gap-2 pt-2">
          {canSaveRevision && (
            <button
              type="button"
              disabled={actions.isPending} aria-busy={actions.isPending}
              onClick={() =>
                run(
                  () => actions.revise({
                    id,
                    content: content || proposal.content,
                    expectedRevision: proposal.revision,
                  }),
                )
              }
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {t.saveRevision}
            </button>
          )}

          {canConfirmPairing && (
            <button
              type="button"
              disabled={actions.isPending} aria-busy={actions.isPending}
              onClick={() => run(() => actions.confirm(id))}
              className="rounded-xl border border-blue-600 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {t.confirmPairing}
            </button>
          )}

          {canEndorse && (
            <button
              type="button"
              disabled={actions.isPending} aria-busy={actions.isPending}
              onClick={() => run(() => actions.endorse(id))}
              className="rounded-xl border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {t.endorseProposal}
            </button>
          )}

          {canSubmit && (
            <button
              type="button"
              disabled={actions.isPending} aria-busy={actions.isPending}
              onClick={() => run(() => actions.submit(id))}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {t.submitProposal}
            </button>
          )}
        </div>
      </section>

      {/* Administrative Screening & Decision Gating */}
      {(canScreen || canDecide) && (
        <section className="app-panel space-y-4 p-6">
          <h2 className="text-lg font-bold text-text-primary">{t.governanceDecision}</h2>

          {canDecide && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">{t.reviewSummaryTitle}</h3>
                {recommendation && (
                  <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                    {t.totalReviews}: {recommendation.totalReviews}
                  </span>
                )}
              </div>

              {recommendation ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 pt-1 text-xs">
                  <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                    <span className="text-text-secondary block font-medium">{t.scientificMerit}</span>
                    <span className="text-base font-bold text-text-primary mt-1 block">
                      {recommendation.averageScientificMerit.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                    <span className="text-text-secondary block font-medium">{t.feasibility}</span>
                    <span className="text-base font-bold text-text-primary mt-1 block">
                      {recommendation.averageFeasibility.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                    <span className="text-text-secondary block font-medium">{t.bilateralValue}</span>
                    <span className="text-base font-bold text-text-primary mt-1 block">
                      {recommendation.averageBilateralValue.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                    <span className="text-text-secondary block font-medium">{t.impact}</span>
                    <span className="text-base font-bold text-text-primary mt-1 block">
                      {recommendation.averageImpact.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-2.5 border border-blue-200 dark:border-blue-800/50 col-span-2 sm:col-span-1">
                    <span className="text-blue-700 dark:text-blue-300 block font-bold">{t.overallScore}</span>
                    <span className="text-base font-black text-blue-700 dark:text-blue-300 mt-1 block">
                      {recommendation.overallAverage.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  {isRecLoading ? t.loading : t.pendingReviewNotice}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1">
              {t.reasonLabel} *
            </label>
            <textarea
              required
              placeholder={t.reasonPlaceholder}
              rows={3}
              className="w-full rounded-xl border border-card-border bg-card-background p-3 text-sm text-text-primary outline-none focus:border-blue-500"
              value={reason}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setReason(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {canScreen && (
              <>
                <button
                  type="button"
                  disabled={!reason.trim() || actions.isPending} aria-busy={actions.isPending}
                  onClick={() => run(() => actions.screen({ id, eligible: true, reason: reason.trim() }))}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {t.eligible}
                </button>
                <button
                  type="button"
                  disabled={!reason.trim() || actions.isPending} aria-busy={actions.isPending}
                  onClick={() => run(() => actions.screen({ id, eligible: false, reason: reason.trim() }))}
                  className="rounded-xl border border-rose-600 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {t.ineligible}
                </button>
              </>
            )}

            {canDecide && (
              <>
                <button
                  type="button"
                  disabled={!recommendation || !reason.trim() || actions.isPending} aria-busy={actions.isPending}
                  onClick={() => run(() => actions.decision({ id, approved: true, reason: reason.trim() }))}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {t.approve}
                </button>
                <button
                  type="button"
                  disabled={!recommendation || !reason.trim() || actions.isPending} aria-busy={actions.isPending}
                  onClick={() => run(() => actions.decision({ id, approved: false, reason: reason.trim() }))}
                  className="rounded-xl border border-rose-600 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {t.reject}
                </button>
                <button
                  type="button"
                  disabled={!recommendation || !reason.trim() || actions.isPending} aria-busy={actions.isPending}
                  onClick={() =>
                    run(
                      () => actions.decision({
                        id,
                        approved: false,
                        reason: reason.trim(),
                        requestRevision: true,
                      }),
                    )
                  }
                  className="rounded-xl border border-amber-600 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {t.requestRevision}
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Notice for finalized state */}
      {isFinal && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs text-text-secondary">
          {t.finalStateNotice}
          {state === "APPROVED" && caps.includes("collab.decisions.issue_foundation") && (
            <div className="mt-3"><BootstrapProjectButton proposal={proposal} /></div>
          )}
        </div>
      )}
    </div>
  );
}
