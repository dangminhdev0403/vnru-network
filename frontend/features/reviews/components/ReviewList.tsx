"use client";

import Link from "next/link";
import { useReviewAssignments } from "../hooks";
import type { ReviewAssignment } from "../types";
import { useLocale, type Locale } from "@/app/HomeMotion";
import { ReviewAssignmentForm } from "./ReviewAssignmentForm";

const reviewListCopy: Record<Locale, {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  retry: string;
  errorTitle: string;
  proposalRef: string;
  status: string;
  statusLabels: Record<string, string>;
  openDetail: string;
  requestFailed: string;
}> = {
  vi: {
    title: "Phân công Bình duyệt Chuyên gia",
    subtitle: "Danh sách hồ sơ nghiên cứu song phương được chỉ định phản biện độc lập.",
    loading: "Đang tải danh sách phân công bình duyệt…",
    empty: "Chưa có phân công bình duyệt nào.",
    retry: "Thử lại",
    errorTitle: "Không thể tải danh sách phân công bình duyệt",
    proposalRef: "Mã đề xuất",
    status: "Trạng thái",
    statusLabels: {
      PENDING: "Chờ xác nhận COI",
      NO_CONFLICT: "Đã xác nhận không xung đột",
      CONFLICT: "Có xung đột lợi ích",
      DRAFT: "Đang chấm điểm (Nháp)",
      SUBMITTED: "Đã nộp kết quả",
    },
    openDetail: "Xem chi tiết đánh giá →",
    requestFailed: "Yêu cầu thất bại",
  },
  en: {
    title: "Expert Peer Review Assignments",
    subtitle: "Bilateral research proposals assigned for independent peer review.",
    loading: "Loading review assignments…",
    empty: "No review assignments found.",
    retry: "Retry",
    errorTitle: "Failed to load review assignments",
    proposalRef: "Proposal Ref",
    status: "Status",
    statusLabels: {
      PENDING: "Pending COI Declaration",
      NO_CONFLICT: "No Conflict Confirmed",
      CONFLICT: "Conflict Declared",
      DRAFT: "Scoring in Progress",
      SUBMITTED: "Evaluation Submitted",
    },
    openDetail: "Open Review Detail →",
    requestFailed: "Request failed",
  },
  ru: {
    title: "Назначенные экспертные оценки",
    subtitle: "Двусторонние заявки, назначенные для независимой научной экспертизы.",
    loading: "Загрузка списка экспертиз…",
    empty: "Назначенные экспертизы отсутствуют.",
    retry: "Повторить",
    errorTitle: "Не удалось загрузить экспертизы",
    proposalRef: "Код заявки",
    status: "Статус",
    statusLabels: {
      PENDING: "Ожидает декларации КИ",
      NO_CONFLICT: "Конфликт интересов отсутствует",
      CONFLICT: "Заявлен конфликт интересов",
      DRAFT: "Оценка в процессе",
      SUBMITTED: "Оценка отправлена",
    },
    openDetail: "Перейти к экспертизе →",
    requestFailed: "Запрос не выполнен",
  },
};

export function ReviewList() {
  const { locale } = useLocale();
  const t = reviewListCopy[locale] || reviewListCopy.vi;
  const { assignments, isLoading, isError, error, refetch } = useReviewAssignments();

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
      <div className="mx-auto max-w-5xl p-8 text-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <h2 className="text-base font-bold">{t.errorTitle}</h2>
          <p className="mt-1 text-xs">{error instanceof Error ? error.message : t.requestFailed}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!assignments.length) {
    return (
      <div className="mx-auto max-w-5xl p-8">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">{t.title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t.subtitle}</p>
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
          <span className="material-symbols-outlined text-4xl text-text-tertiary">rate_review</span>
          <p className="mt-3 text-sm font-semibold text-text-secondary">{t.empty}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">{t.title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t.subtitle}</p>
      </div>

      <ReviewAssignmentForm onCreated={refetch} />

      <div className="grid gap-4">
        {assignments.map((a: unknown) => {
          const assignment = a as ReviewAssignment;
          const status = assignment.status;
          return (
            <Link
              key={assignment.id}
              href={`/workspace/collaboration/reviews/${encodeURIComponent(assignment.id)}`}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-primary)] hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    status === "SUBMITTED"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : status === "CONFLICT"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                  }`}
                >
                  {t.statusLabels[status] || status}
                </span>
                <span className="font-mono text-xs text-text-tertiary">ID: {assignment.id}</span>
              </div>

              <div className="mt-3">
                <h2 className="text-base font-bold text-text-primary group-hover:text-blue-600 transition">
                  {t.proposalRef}: {assignment.proposalRef}
                </h2>
                {assignment.snapshot?.snapshot?.title && (
                  <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                    {String(assignment.snapshot.snapshot.title)}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>{t.openDetail}</span>
                <span className="material-symbols-outlined text-base transition group-hover:translate-x-1">arrow_forward</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
