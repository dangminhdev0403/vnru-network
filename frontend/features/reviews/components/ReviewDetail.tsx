"use client";

import * as React from "react";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/server-state";
import { useReviewAssignment } from "../hooks";
import type { EvaluationInput } from "../types";

const dimensions = ["scientificMerit", "feasibility", "bilateralValue", "impact"] as const;
export function ReviewDetail({ id }: { id: string }) {
  const { assignment, isLoading, isError, error, refetch, declareConflict, saveEvaluation, submitEvaluation, isPending } = useReviewAssignment(id);
  const { data: user } = useCurrentUser();
  const [evaluation, setEvaluation] = useState<Required<EvaluationInput>>({ scientificMerit: 1, feasibility: 1, bilateralValue: 1, impact: 1, comments: "" });

  if (isLoading) return <p className="p-8" aria-live="polite">Đang tải… / Loading…</p>;
  if (isError) return <section className="p-8"><p role="alert">{error instanceof Error ? error.message : "Request failed"}</p><button type="button" onClick={() => refetch()}>Retry</button></section>;
  if (!assignment) return <p className="p-8">Not found</p>;
  const caps = user?.capabilities ?? [];
  const readonly = assignment.status === "CONFLICT" || assignment.status === "SUBMITTED";
  const run = async (action: Promise<unknown>) => { await action; await refetch(); };
  return <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
    <header className="app-panel p-6"><p className="text-xs font-bold uppercase text-blue-600">{assignment.status}</p><h1 className="mt-2 text-2xl font-bold">Phản biện ẩn danh / Anonymous review</h1><p className="text-sm text-text-secondary">Assignment {assignment.id}</p></header>
    <section className="app-panel p-6"><h2 className="text-lg font-bold">Proposal snapshot</h2><dl className="mt-4 space-y-3">{Object.entries(assignment.snapshot?.snapshot ?? {}).map(([key, value]) => <div key={key}><dt className="text-xs font-bold uppercase text-text-secondary">{key}</dt><dd className="mt-1 whitespace-pre-wrap text-sm">{Array.isArray(value) ? value.join(", ") : value}</dd></div>)}</dl></section>
    {assignment.status === "PENDING" && caps.includes("reviews.assignments.view_assigned") && <section className="app-panel flex flex-wrap gap-2 p-6"><button type="button" disabled={isPending} onClick={() => run(declareConflict({ id, declaration: "NO_CONFLICT" }))} className="rounded-xl bg-blue-600 px-4 py-2 text-white">No conflict</button><button type="button" disabled={isPending} onClick={() => run(declareConflict({ id, declaration: "CONFLICT" }))} className="rounded-xl border border-rose-500 px-4 py-2 text-rose-600">Declare conflict</button></section>}
    {assignment.conflict?.declaration === "NO_CONFLICT" && <section className="app-panel space-y-4 p-6"><h2 className="text-lg font-bold">Evaluation rubric</h2><div className="grid gap-4 sm:grid-cols-2">{dimensions.map((dimension) => <label key={dimension} className="text-sm font-semibold">{dimension}<input type="number" min={1} max={5} required value={evaluation[dimension]} disabled={readonly || isPending} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEvaluation({ ...evaluation, [dimension]: Number(event.target.value) })} className="mt-1 block w-full rounded-xl border p-3" /></label>)}</div><label className="block text-sm font-semibold">Comments<textarea required value={evaluation.comments} disabled={readonly || isPending} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setEvaluation({ ...evaluation, comments: event.target.value })} className="mt-1 block min-h-32 w-full rounded-xl border p-3" /></label>{!readonly && <div className="flex gap-2">{caps.includes("reviews.evaluations.score") && <button type="button" disabled={isPending} onClick={() => run(saveEvaluation({ id, evaluation }))} className="rounded-xl border px-4 py-2">Save draft</button>}{caps.includes("reviews.evaluations.submit") && <button type="button" disabled={!evaluation.comments || isPending} onClick={() => run(submitEvaluation({ id, evaluation }))} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Submit evaluation</button>}</div>}</section>}
  </div>;
}
