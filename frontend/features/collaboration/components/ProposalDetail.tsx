"use client";

import * as React from "react";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/server-state";
import { useProposal, useProposalMutations } from "../hooks";

const copy = { title: "Đề xuất cộng tác / Collaboration proposal", loading: "Đang tải… / Loading…", retry: "Tải lại / Retry" };
export function ProposalDetail({ id }: { id: string }) {
  const { proposal, isLoading, isError, error, refetch } = useProposal(id);
  const actions = useProposalMutations();
  const { data: user } = useCurrentUser();
  const [content, setContent] = useState("");
  const [reason, setReason] = useState("");
  const caps = user?.capabilities ?? [];
  const run = async (action: Promise<unknown>) => { await action; await refetch(); };
  if (isLoading) return <p className="p-8" aria-live="polite">{copy.loading}</p>;
  if (isError) return <section className="p-8"><p role="alert">{error instanceof Error ? error.message : "Request failed"}</p><button type="button" onClick={() => refetch()}>{copy.retry}</button></section>;
  if (!proposal) return <p className="p-8">Not found</p>;
  const canEdit = caps.includes("collab.proposals.create");
  return <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
    <header className="app-panel p-6"><p className="text-xs font-bold uppercase text-blue-600">{proposal.state}</p><h1 className="mt-2 text-2xl font-bold text-text-primary">{copy.title}</h1><p className="text-sm text-text-secondary">ID {proposal.id} · revision {proposal.revision}</p></header>
    <section className="grid gap-4 md:grid-cols-2" aria-label="Bilateral team">{proposal.participants.map((participant) => <article className="app-panel p-5" key={participant.userId}><h2 className="font-bold">{participant.country} participant</h2><p className="break-all text-sm">{participant.userId}</p><p className="break-all text-sm text-text-secondary">{participant.organizationRef}</p><p className="mt-2 text-xs">Confirmed: {proposal.confirmations.some((item) => item.participantId === participant.userId && item.confirmed) ? "Yes" : "No"} · Endorsed: {proposal.endorsements.some((item) => item.organizationRef === participant.organizationRef && item.endorsed) ? "Yes" : "No"}</p></article>)}</section>
    <section className="app-panel space-y-4 p-6"><h2 className="text-lg font-bold">Research plan</h2><label className="block text-sm font-semibold">Content<textarea className="mt-2 block min-h-40 w-full rounded-xl border border-card-border bg-card-background p-3" value={content || proposal.content} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)} disabled={!canEdit || actions.isPending} /></label><div className="flex flex-wrap gap-2">
      {canEdit && <button type="button" disabled={actions.isPending} onClick={() => run(actions.revise({ id, content: content || proposal.content, expectedRevision: proposal.revision }))} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Save revision</button>}
      {caps.includes("collab.proposals.confirm_paired") && <button type="button" disabled={actions.isPending} onClick={() => run(actions.confirm(id))} className="rounded-xl border px-4 py-2">Confirm pairing</button>}
      {caps.includes("collab.proposals.endorse") && <button type="button" disabled={actions.isPending} onClick={() => run(actions.endorse(id))} className="rounded-xl border px-4 py-2">Endorse</button>}
      {caps.includes("collab.proposals.submit") && <button type="button" disabled={actions.isPending} onClick={() => run(actions.submit(id))} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Submit</button>}
    </div></section>
    {(caps.includes("collab.proposals.screen") || caps.includes("collab.decisions.issue_foundation")) && <section className="app-panel space-y-3 p-6"><h2 className="text-lg font-bold">Workflow decision</h2><label className="block text-sm font-semibold">Reason<textarea required className="mt-2 block w-full rounded-xl border p-3" value={reason} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setReason(event.target.value)} /></label><div className="flex flex-wrap gap-2">
      {caps.includes("collab.proposals.screen") && <><button type="button" disabled={!reason || actions.isPending} onClick={() => run(actions.screen({ id, eligible: true, reason }))} className="rounded-xl bg-emerald-600 px-4 py-2 text-white">Eligible</button><button type="button" disabled={!reason || actions.isPending} onClick={() => run(actions.screen({ id, eligible: false, reason }))} className="rounded-xl border px-4 py-2">Ineligible</button></>}
      {caps.includes("collab.decisions.issue_foundation") && <><button type="button" disabled={!reason || actions.isPending} onClick={() => run(actions.decision({ id, approved: true, reason }))} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Approve</button><button type="button" disabled={!reason || actions.isPending} onClick={() => run(actions.decision({ id, approved: false, reason }))} className="rounded-xl border px-4 py-2">Reject</button><button type="button" disabled={!reason || actions.isPending} onClick={() => run(actions.decision({ id, approved: false, reason, requestRevision: true }))} className="rounded-xl border px-4 py-2">Request revision</button></>}
    </div></section>}
  </div>;
}
