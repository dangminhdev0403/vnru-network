"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { collabResource } from "./resource";

const collab = collabResource.bind(undefined);

export function useOpportunities(cursor?: string, limit = 20) {
  const query = useQuery(collab.queries.opportunities.options({ cursor, limit }));
  const create = useMutation(collab.mutations.createOpportunity.options({ onSuccess: ({ client, cache }) => { cache.queries.opportunities.invalidateAll(client); } }));
  const publish = useMutation(collab.mutations.publishOpportunity.options({ onSuccess: ({ client, cache }) => { cache.queries.opportunities.invalidateAll(client); } }));
  const close = useMutation(collab.mutations.closeOpportunity.options({ onSuccess: ({ client, cache }) => { cache.queries.opportunities.invalidateAll(client); } }));
  return {
    opportunities: query.data?.items ?? [],
    nextCursor: query.data?.nextCursor ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createOpportunity: create.mutateAsync,
    isCreating: create.isPending,
    publishOpportunity: publish.mutateAsync,
    isPublishing: publish.isPending,
    closeOpportunity: close.mutateAsync,
    isClosing: close.isPending,
  };
}

export function useProposal(id: string) {
  const query = useQuery({ ...collab.queries.proposal.options(id), enabled: Boolean(id) });
  const create = useMutation(collab.mutations.createProposal.options());
  return { proposal: query.data ?? null, isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch, createProposal: create.mutateAsync, isCreating: create.isPending };
}

export function useProposalMutations() {
  const revise = useMutation(collab.mutations.reviseProposal.options());
  const confirm = useMutation(collab.mutations.confirmProposal.options());
  const endorse = useMutation(collab.mutations.endorseProposal.options());
  const submit = useMutation(collab.mutations.submitProposal.options());
  const screen = useMutation(collab.mutations.screenProposal.options());
  const decision = useMutation(collab.mutations.decisionProposal.options());
  return { revise: revise.mutateAsync, confirm: confirm.mutateAsync, endorse: endorse.mutateAsync, submit: submit.mutateAsync, screen: screen.mutateAsync, decision: decision.mutateAsync, isPending: [revise, confirm, endorse, submit, screen, decision].some((mutation) => mutation.isPending) };
}
