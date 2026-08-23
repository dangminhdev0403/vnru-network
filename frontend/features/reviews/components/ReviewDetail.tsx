"use client";

import * as React from "react";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/server-state";
import { useReviewAssignment } from "../hooks";
import type { EvaluationInput, EvaluationScores, ReviewAssignment } from "../types";
import { confirmAndRun, showError, showToast } from "@/lib/alerts";
import { useLocale, type Locale } from "@/app/HomeMotion";

const dimensions = [
  { key: "scientificMerit", vi: "Giá trị khoa học & Tính mới", en: "Scientific Merit & Novelty", ru: "Научная новизна и ценность" },
  { key: "feasibility", vi: "Tính khả thi & Phương pháp luận", en: "Feasibility & Methodology", ru: "Практическая реализуемость" },
  { key: "bilateralValue", vi: "Giá trị hợp tác song phương VN–RU", en: "Bilateral VN–RU Synergies", ru: "Двусторонняя значимость РФ–СРВ" },
  { key: "impact", vi: "Tác động khoa học & xã hội", en: "Scientific & Societal Impact", ru: "Научно-практический эффект" },
] as const;

type CopyType = {
  title: string;
  loading: string;
  retry: string;
  notFound: string;
  assignmentId: string;
  status: string;
  statusLabels: Record<string, string>;
  proposalSnapshot: string;
  coiSectionTitle: string;
  coiDesc: string;
  noConflict: string;
  declareConflict: string;
  conflictDeclaredBanner: string;
  submittedBanner: string;
  rubricTitle: string;
  rubricDesc: string;
  commentsLabel: string;
  commentsPlaceholder: string;
  saveDraft: string;
  submitEvaluation: string;
  actionSuccess: string;
  scoreScale: string;
  requestFailed: string;
  actionFailed: string;
  proposalRef: string;
  scale: [string, string, string];
};

const reviewDetailCopy: Record<Locale, CopyType> = {
  vi: {
    title: "Phản biện Khoa học Độc lập (Ẩn danh)",
    loading: "Đang tải chi tiết hồ sơ bình duyệt…",
    retry: "Thử lại",
    notFound: "Không tìm thấy phân công bình duyệt.",
    assignmentId: "Mã phân công",
    status: "Trạng thái",
    statusLabels: {
      PENDING: "Chờ xác nhận xung đột lợi ích",
      NO_CONFLICT: "Đã xác nhận không có xung đột",
      CONFLICT: "Đã khai báo xung đột lợi ích",
      DRAFT: "Đang lưu nháp",
      SUBMITTED: "Đã nộp kết quả đánh giá",
    },
    proposalSnapshot: "Bản tóm tắt Đề xuất Nghiên cứu (Ẩn danh)",
    coiSectionTitle: "Tuyên bố Xung đột Lợi ích (COI Declaration)",
    coiDesc: "Vui lòng xác nhận bạn không có mối quan hệ công tác, hợp tác trực tiếp hoặc xung đột lợi ích với nhóm tác giả đề xuất.",
    noConflict: "Xác nhận không có xung đột (Tiếp tục đánh giá)",
    declareConflict: "Khai báo có xung đột (Từ chối đánh giá)",
    conflictDeclaredBanner: "Bạn đã khai báo xung đột lợi ích cho hồ sơ này. Hồ sơ được lưu ở trạng thái chỉ đọc và không thể chấm điểm.",
    submittedBanner: "Kết quả đánh giá chuyên gia đã được nộp thành công và niêm phong bảo mật.",
    rubricTitle: "Tiêu chí & Thang điểm Đánh giá Chuyên gia",
    rubricDesc: "Chấm điểm độc lập theo thang điểm từ 1 (Kém) đến 5 (Xuất sắc) cho từng tiêu chí chuyên môn.",
    commentsLabel: "Nhận xét chi tiết & Ý kiến chuyên gia *",
    commentsPlaceholder: "Nhận xét cụ thể về ưu điểm, hạn chế và kiến nghị hoàn thiện...",
    saveDraft: "Lưu bản nháp",
    submitEvaluation: "Nộp kết quả đánh giá",
    actionSuccess: "Thực hiện thành công",
    scoreScale: "Điểm (1-5)",
    requestFailed: "Yêu cầu thất bại",
    actionFailed: "Không thể thực hiện tác vụ",
    proposalRef: "Mã đề xuất",
    scale: ["Thấp", "Đạt", "Xuất sắc"],
  },
  en: {
    title: "Independent Peer Review (Double-Blind)",
    loading: "Loading review assignment details…",
    retry: "Retry",
    notFound: "Review assignment not found.",
    assignmentId: "Assignment ID",
    status: "Status",
    statusLabels: {
      PENDING: "Pending Conflict of Interest Check",
      NO_CONFLICT: "No Conflict Declared",
      CONFLICT: "Conflict Declared",
      DRAFT: "Draft Evaluation",
      SUBMITTED: "Evaluation Submitted",
    },
    proposalSnapshot: "Proposal Snapshot (Anonymized)",
    coiSectionTitle: "Conflict of Interest (COI) Declaration",
    coiDesc: "Please certify whether you have any personal, financial, or direct professional conflict of interest with this proposal.",
    noConflict: "Certify No Conflict (Proceed to Scoring)",
    declareConflict: "Declare Conflict of Interest (Recuse)",
    conflictDeclaredBanner: "Conflict of interest has been declared for this assignment. Record is preserved in read-only state.",
    submittedBanner: "Evaluation has been officially submitted and sealed.",
    rubricTitle: "Evaluation Rubric & Scoring Dimensions",
    rubricDesc: "Rate each dimension independently from 1 (Unsatisfactory) to 5 (Outstanding).",
    commentsLabel: "Detailed Comments & Expert Recommendation *",
    commentsPlaceholder: "Provide substantive scientific feedback, strengths, weaknesses, and recommendations...",
    saveDraft: "Save Draft",
    submitEvaluation: "Submit Evaluation",
    actionSuccess: "Action completed successfully",
    scoreScale: "Score (1-5)",
    requestFailed: "Request failed",
    actionFailed: "Action failed",
    proposalRef: "Proposal reference",
    scale: ["Low", "Average", "Outstanding"],
  },
  ru: {
    title: "Независимая научная экспертиза (Анонимная)",
    loading: "Загрузка данных экспертизы…",
    retry: "Повторить",
    notFound: "Назначение экспертизы не найдено.",
    assignmentId: "Код назначения",
    status: "Статус",
    statusLabels: {
      PENDING: "Ожидает декларации конфликта интересов",
      NO_CONFLICT: "Конфликт интересов отсутствует",
      CONFLICT: "Заявлен конфликт интересов",
      DRAFT: "Черновик оценки",
      SUBMITTED: "Оценка официально отправлена",
    },
    proposalSnapshot: "Паспорт заявки (Обезличенный)",
    coiSectionTitle: "Декларация конфликта интересов (КИ)",
    coiDesc: "Подтвердите отсутствие конфликта интересов и прямой аффилированности с авторами заявки.",
    noConflict: "Подтвердить отсутствие конфликта (Перейти к оценке)",
    declareConflict: "Заявить конфликт интересов (Самоотвод)",
    conflictDeclaredBanner: "По данной заявке заявлен конфликт интересов. Запись доступна только для чтения.",
    submittedBanner: "Экспертная оценка успешно отправлена и зафиксирована.",
    rubricTitle: "Критерии и шкала экспертной оценки",
    rubricDesc: "Оцените каждый критерий по шкале от 1 (Неудовлетворительно) до 5 (Отлично).",
    commentsLabel: "Экспертное заключение и комментарии *",
    commentsPlaceholder: "Укажите научные достоинства, замечания и рекомендации по заявке...",
    saveDraft: "Сохранить черновик",
    submitEvaluation: "Отправить заключение",
    actionSuccess: "Успешно выполнено",
    scoreScale: "Балл (1-5)",
    requestFailed: "Запрос не выполнен",
    actionFailed: "Не удалось выполнить действие",
    proposalRef: "Код заявки",
    scale: ["Низко", "Средне", "Отлично"],
  },
};

function ReviewEvaluationForm({
  id,
  assignment,
  caps,
  locale,
  t,
  readonly,
  isPending,
  run,
  saveEvaluation,
  submitEvaluation,
}: Readonly<{
  id: string;
  assignment: ReviewAssignment;
  caps: string[];
  locale: Locale;
  t: CopyType;
  readonly: boolean;
  isPending: boolean;
  run: (action: () => Promise<unknown>) => Promise<void>;
  saveEvaluation: (input: { id: string; evaluation: Required<EvaluationInput> }) => Promise<unknown>;
  submitEvaluation: (input: { id: string; evaluation: Required<EvaluationInput> }) => Promise<unknown>;
}>) {
  const initialScores: Partial<EvaluationScores> = {};
  if (Array.isArray(assignment.reviewRecord?.scores)) {
    for (const s of assignment.reviewRecord.scores) {
      if (s.dimension) initialScores[s.dimension] = s.score;
    }
  }

  const [evaluation, setEvaluation] = useState<Required<EvaluationInput>>({
    scientificMerit: initialScores.scientificMerit ?? 4,
    feasibility: initialScores.feasibility ?? 4,
    bilateralValue: initialScores.bilateralValue ?? 4,
    impact: initialScores.impact ?? 4,
    comments: assignment.reviewRecord?.comments ?? "",
  });

  return (
    <section className="app-panel space-y-4 p-6">
      <div>
        <h2 className="text-base font-bold text-text-primary">{t.rubricTitle}</h2>
        <p className="mt-0.5 text-xs text-text-secondary">{t.rubricDesc}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {dimensions.map((dim) => {
          const label = dim[locale] || dim.vi;
          const val = evaluation[dim.key as keyof EvaluationInput] as number;
          return (
            <div
              key={dim.key}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-primary block">{label}</label>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {val} / 5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={val}
                disabled={readonly || isPending}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEvaluation({ ...evaluation, [dim.key]: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-text-tertiary">
                <span>1 ({t.scale[0]})</span>
                <span>3 ({t.scale[1]})</span>
                <span>5 ({t.scale[2]})</span>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <label className="block text-xs font-bold text-text-secondary mb-1">
          {t.commentsLabel}
        </label>
        <textarea
          required
          rows={4}
          placeholder={t.commentsPlaceholder}
          value={evaluation.comments}
          disabled={readonly || isPending}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setEvaluation({ ...evaluation, comments: e.target.value })
          }
          className="w-full rounded-xl border border-card-border bg-card-background p-3 text-sm text-text-primary outline-none focus:border-blue-500 disabled:opacity-75"
        />
      </div>

      {!readonly && (
        <div className="flex flex-wrap gap-2 pt-2">
          {caps.includes("reviews.evaluations.score") && (
            <button
              type="button"
              disabled={isPending} aria-busy={isPending}
              onClick={() => run(() => saveEvaluation({ id, evaluation }))}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-text-primary hover:bg-[var(--surface-secondary)] transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {t.saveDraft}
            </button>
          )}
          {caps.includes("reviews.evaluations.submit") && (
            <button
              type="button"
              disabled={!evaluation.comments.trim() || isPending} aria-busy={isPending}
              onClick={() => run(() => submitEvaluation({ id, evaluation }))}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {t.submitEvaluation}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export function ReviewDetail({ id }: Readonly<{ id: string }>) {
  const { locale } = useLocale();
  const t = reviewDetailCopy[locale] || reviewDetailCopy.vi;
  const {
    assignment,
    isLoading,
    isError,
    error,
    refetch,
    declareConflict,
    saveEvaluation,
    submitEvaluation,
    isPending,
  } = useReviewAssignment(id);
  const { data: user } = useCurrentUser();

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

  if (!assignment) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center">
        <p className="text-sm font-semibold text-text-secondary">{t.notFound}</p>
      </div>
    );
  }

  const caps = (user as { capabilities?: string[] })?.capabilities ?? [];
  const status = assignment.status;
  const isConflict = status === "CONFLICT" || assignment.conflict?.declaration === "CONFLICT";
  const isSubmitted = status === "SUBMITTED";
  const readonly = isConflict || isSubmitted;

  const run = async (action: () => Promise<unknown>) => {
    try {
      if (!(await confirmAndRun(action))) return;
      showToast({ title: t.actionSuccess, icon: "success" });
      await refetch();
    } catch (err) {
      showError(
        t.title,
        err instanceof Error ? err.message : t.actionFailed,
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {/* Header */}
      <header className="app-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isSubmitted
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : isConflict
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
            }`}
          >
            {t.statusLabels[status] || status}
          </span>
          <p className="font-mono text-xs text-text-tertiary">
            {t.assignmentId}: {assignment.id}
          </p>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">{t.title}</h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          {t.proposalRef}: {assignment.proposalRef}
        </p>
      </header>

      {/* Proposal Snapshot */}
      <section className="app-panel p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary">{t.proposalSnapshot}</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4">
          <dl className="space-y-3">
            {Object.entries(assignment.snapshot?.snapshot ?? {}).map(([key, value]) => (
              <div key={key} className="border-b border-[var(--border)] pb-2 last:border-0 last:pb-0">
                <dt className="text-[11px] font-bold uppercase text-text-secondary tracking-wider">{key}</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-sm text-text-primary">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* COI Conflict Gate */}
      {status === "PENDING" && caps.includes("reviews.assignments.view_assigned") && (
        <section className="app-panel p-6 space-y-3 border-2 border-blue-500/20">
          <h2 className="text-base font-bold text-text-primary">{t.coiSectionTitle}</h2>
          <p className="text-xs text-text-secondary">{t.coiDesc}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              disabled={isPending} aria-busy={isPending}
              onClick={() => run(() => declareConflict({ id, declaration: "NO_CONFLICT" }))}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              {t.noConflict}
            </button>
            <button
              type="button"
              disabled={isPending} aria-busy={isPending}
              onClick={() => run(() => declareConflict({ id, declaration: "CONFLICT" }))}
              className="rounded-xl border border-rose-500 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              {t.declareConflict}
            </button>
          </div>
        </section>
      )}

      {/* Conflict Declared Banner */}
      {isConflict && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/20 p-4 text-xs font-medium text-rose-800 dark:text-rose-300">
          {t.conflictDeclaredBanner}
        </div>
      )}

      {/* Submitted Banner */}
      {isSubmitted && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          {t.submittedBanner}
        </div>
      )}

      {/* Evaluation Rubric */}
      {assignment.conflict?.declaration === "NO_CONFLICT" && (
        <ReviewEvaluationForm
          id={id}
          assignment={assignment}
          caps={caps}
          locale={locale}
          t={t}
          readonly={readonly}
          isPending={isPending}
          run={run}
          saveEvaluation={saveEvaluation}
          submitEvaluation={submitEvaluation}
        />
      )}
    </div>
  );
}
