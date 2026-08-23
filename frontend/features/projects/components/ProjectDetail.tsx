"use client";

import { useState } from "react";
import { useLocale, type Locale } from "@/app/HomeMotion";
import { useCurrentUser } from "@/features/auth/server-state";
import { confirmAndRun, showError } from "@/lib/alerts";
import { useProject } from "../hooks";

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    loading: "Đang tải…", retry: "Thử lại", notFound: "Không tìm thấy dự án", requestFailed: "Yêu cầu thất bại", actionFailed: "Không thể thực hiện tác vụ", version: "Phiên bản", team: "Nhóm dự án", userId: "Mã người dùng", userPlaceholder: "UUID người dùng", addMember: "Thêm thành viên", milestones: "Mốc tiến độ và sản phẩm", update: "Cập nhật", submit: "Nộp", approve: "Phê duyệt", milestoneTitle: "Tên mốc tiến độ", deliverableTitle: "Tên sản phẩm", createMilestone: "Tạo mốc tiến độ", reports: "Báo cáo tiến độ", reportTitle: "Tên báo cáo", reportContent: "Nội dung báo cáo", createReport: "Tạo báo cáo", outcomes: "Kết quả", outcomeType: "Loại kết quả", outcomeRef: "Mã tham chiếu kết quả", addOutcome: "Thêm kết quả", feedback: "Phản hồi / lý do chấm dứt", complete: "Hoàn thành dự án", terminate: "Chấm dứt",
  },
  en: {
    loading: "Loading…", retry: "Retry", notFound: "Project not found", requestFailed: "Request failed", actionFailed: "Unable to perform action", version: "Version", team: "Project team", userId: "User ID", userPlaceholder: "User UUID", addMember: "Add member", milestones: "Milestones and deliverables", update: "Update", submit: "Submit", approve: "Approve", milestoneTitle: "Milestone title", deliverableTitle: "Deliverable title", createMilestone: "Create milestone", reports: "Progress reports", reportTitle: "Report title", reportContent: "Report content", createReport: "Create report", outcomes: "Outcomes", outcomeType: "Outcome type", outcomeRef: "Outcome reference", addOutcome: "Add outcome", feedback: "Feedback / termination reason", complete: "Complete project", terminate: "Terminate",
  },
  ru: {
    loading: "Загрузка…", retry: "Повторить", notFound: "Проект не найден", requestFailed: "Запрос не выполнен", actionFailed: "Не удалось выполнить действие", version: "Версия", team: "Команда проекта", userId: "Код пользователя", userPlaceholder: "UUID пользователя", addMember: "Добавить участника", milestones: "Этапы и результаты", update: "Обновить", submit: "Отправить", approve: "Одобрить", milestoneTitle: "Название этапа", deliverableTitle: "Название результата", createMilestone: "Создать этап", reports: "Отчёты о ходе работ", reportTitle: "Название отчёта", reportContent: "Содержание отчёта", createReport: "Создать отчёт", outcomes: "Результаты", outcomeType: "Тип результата", outcomeRef: "Код результата", addOutcome: "Добавить результат", feedback: "Отзыв / причина прекращения", complete: "Завершить проект", terminate: "Прекратить",
  },
};

export function ProjectDetail({ id }: { id: string }) {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const data = useProject(id);
  const { data: user } = useCurrentUser();
  const [memberId, setMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [outcomeType, setOutcomeType] = useState("");
  const [outcomeRef, setOutcomeRef] = useState("");
  const [reason, setReason] = useState("");

  const run = async (action: () => Promise<unknown>) => {
    try {
      if (await confirmAndRun(action)) await data.refetch();
    } catch (error) {
      showError(t.actionFailed, error instanceof Error ? error.message : t.requestFailed);
    }
  };

  if (data.isLoading) return <p className="p-8" aria-live="polite">{t.loading}</p>;
  if (data.isError) return <section className="p-8"><p role="alert">{data.error instanceof Error ? data.error.message : t.requestFailed}</p><button type="button" onClick={() => data.refetch()}>{t.retry}</button></section>;
  const project = data.project;
  if (!project) return <p className="p-8">{t.notFound}</p>;

  const caps = user?.capabilities ?? [];
  const canUpdate = caps.includes("projects.milestones.update");
  const canSubmit = caps.includes("projects.reports.submit");
  const canApprove = caps.includes("projects.reports.approve");

  return <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
    <header className="app-panel p-6">
      <p className="text-xs font-bold uppercase text-blue-600">{project.status}</p>
      <h1 className="mt-2 text-2xl font-bold">{project.title}</h1>
      <p className="mt-2 text-sm text-text-secondary">{project.description}</p>
      <p className="text-xs">{t.version} {project.expectedVersion}</p>
    </header>

    <section className="app-panel p-6">
      <h2 className="text-lg font-bold">{t.team}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">{data.members.map((member) => <li key={member.id} className="rounded-xl border p-3 text-sm"><strong>{member.role}</strong><span className="ml-2 break-all">{member.userId}</span></li>)}</ul>
      {canApprove && <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); void run(() => data.addMember({ id, input: { userId: memberId, role: "MEMBER" } })).then(() => setMemberId("")); }}>
        <label className="sr-only" htmlFor="member-id">{t.userId}</label>
        <input id="member-id" name="memberId" required value={memberId} onChange={(event) => setMemberId(event.target.value)} placeholder={t.userPlaceholder} className="min-w-64 flex-1 rounded-xl border p-3" />
        <button type="submit" disabled={data.isPending} aria-busy={data.isPending} className="rounded-xl bg-blue-600 px-4 py-2 text-white">{t.addMember}</button>
      </form>}
    </section>

    <section className="app-panel p-6">
      <h2 className="text-lg font-bold">{t.milestones}</h2>
      <div className="mt-4 space-y-3">{project.milestones.map((milestone) => <article key={milestone.id} className="rounded-xl border p-4">
        <div className="flex flex-wrap justify-between gap-2"><div><h3 className="font-bold">{milestone.title}</h3><p className="text-sm text-text-secondary">{milestone.description}</p><p className="text-xs">{milestone.status} · {new Date(milestone.dueDate).toLocaleDateString(locale)}</p></div>
          <div className="flex flex-wrap gap-2">
            {canUpdate && milestone.status !== "APPROVED" && <><button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.updateMilestone({ id, milestoneId: milestone.id, input: { title: title || milestone.title, expectedVersion: milestone.expectedVersion } }))} className="rounded-lg border px-3 py-2">{t.update}</button><button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.submitMilestone({ id, milestoneId: milestone.id, input: { expectedVersion: milestone.expectedVersion } }))} className="rounded-lg bg-blue-600 px-3 py-2 text-white">{t.submit}</button></>}
            {canApprove && milestone.status === "SUBMITTED" && <button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.reviewMilestone({ id, milestoneId: milestone.id, input: { approved: true, feedback: reason || undefined, expectedVersion: milestone.expectedVersion } }))} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">{t.approve}</button>}
          </div>
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm">{milestone.deliverables.map((item, index) => <li key={item.id ?? `${item.title}-${index}`}>{item.url ? <a className="text-blue-600 underline" href={item.url}>{item.title}</a> : item.title}</li>)}</ul>
      </article>)}</div>
      {canUpdate && <form className="mt-4 grid gap-2 sm:grid-cols-4" onSubmit={(event) => { event.preventDefault(); void run(() => data.createMilestone({ id, input: { title, description: content || undefined, dueDate, deliverables: deliverableTitle ? [{ title: deliverableTitle }] : undefined } })); }}>
        <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t.milestoneTitle} className="rounded-xl border p-3" />
        <input type="date" required value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="rounded-xl border p-3" />
        <input value={deliverableTitle} onChange={(event) => setDeliverableTitle(event.target.value)} placeholder={t.deliverableTitle} className="rounded-xl border p-3" />
        <button type="submit" disabled={data.isPending} aria-busy={data.isPending} className="rounded-xl bg-blue-600 px-4 py-2 text-white">{t.createMilestone}</button>
      </form>}
    </section>

    <section className="app-panel p-6">
      <h2 className="text-lg font-bold">{t.reports}</h2>
      <div className="mt-4 space-y-3">{project.reports.map((report) => <article key={report.id} className="rounded-xl border p-4"><h3 className="font-bold">{report.title}</h3><p className="whitespace-pre-wrap text-sm">{report.content}</p><p className="text-xs">{report.status} · {t.version} {report.expectedVersion}</p><div className="mt-2 flex gap-2">{canSubmit && report.status !== "APPROVED" && <><button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.updateReport({ id, reportId: report.id, input: { content: content || report.content, expectedVersion: report.expectedVersion } }))} className="rounded-lg border px-3 py-2">{t.update}</button><button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.submitReport({ id, reportId: report.id, input: { expectedVersion: report.expectedVersion } }))} className="rounded-lg bg-blue-600 px-3 py-2 text-white">{t.submit}</button></>}{canApprove && report.status === "SUBMITTED" && <button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.reviewReport({ id, reportId: report.id, input: { approved: true, feedback: reason || undefined, expectedVersion: report.expectedVersion } }))} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">{t.approve}</button>}</div></article>)}</div>
      {canSubmit && <form className="mt-4 grid gap-2" onSubmit={(event) => { event.preventDefault(); void run(() => data.createReport({ id, input: { title, content } })); }}><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t.reportTitle} className="rounded-xl border p-3" /><textarea required value={content} onChange={(event) => setContent(event.target.value)} placeholder={t.reportContent} className="min-h-28 rounded-xl border p-3" /><button type="submit" disabled={data.isPending} aria-busy={data.isPending} className="justify-self-start rounded-xl bg-blue-600 px-4 py-2 text-white">{t.createReport}</button></form>}
    </section>

    <section className="app-panel p-6">
      <h2 className="text-lg font-bold">{t.outcomes}</h2>
      <ul className="mt-3 space-y-2">{project.outcomes.map((outcome) => <li key={outcome.id} className="rounded-xl border p-3 text-sm"><strong>{outcome.outcomeType}</strong> · {outcome.outcomeRef}</li>)}</ul>
      {canUpdate && <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); void run(() => data.addOutcome({ id, input: { outcomeType, outcomeRef } })); }}><input required value={outcomeType} onChange={(event) => setOutcomeType(event.target.value)} placeholder={t.outcomeType} className="rounded-xl border p-3" /><input required value={outcomeRef} onChange={(event) => setOutcomeRef(event.target.value)} placeholder={t.outcomeRef} className="min-w-64 flex-1 rounded-xl border p-3" /><button type="submit" disabled={data.isPending} aria-busy={data.isPending} className="rounded-xl bg-blue-600 px-4 py-2 text-white">{t.addOutcome}</button></form>}
    </section>

    {canApprove && project.status === "ACTIVE" && <section className="app-panel space-y-3 p-6"><label className="block text-sm font-semibold">{t.feedback}<textarea name="feedback" value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 block w-full rounded-xl border p-3" /></label><div className="flex gap-2"><button type="button" disabled={data.isPending} aria-busy={data.isPending} onClick={() => run(() => data.complete({ id, input: { expectedVersion: project.expectedVersion } }))} className="rounded-xl bg-blue-600 px-4 py-2 text-white">{t.complete}</button><button type="button" disabled={!reason || data.isPending} onClick={() => run(() => data.terminate({ id, input: { reason, expectedVersion: project.expectedVersion } }))} className="rounded-xl border border-rose-500 px-4 py-2 text-rose-600">{t.terminate}</button></div></section>}
  </div>;
}
