"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listOpportunities,
  createOpportunity,
  createProposal,
  getProposalById,
} from "./repository";

export function useOpportunities() {
  const queryClient = useQueryClient();

  const opportunitiesQuery = useQuery({
    queryKey: ["collab", "opportunities"],
    queryFn: () => listOpportunities(),
    staleTime: 30_000,
  });

  const createOpportunityMutation = useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collab", "opportunities"] });
    },
  });

  return {
    opportunities: opportunitiesQuery.data ?? [],
    isLoading: opportunitiesQuery.isLoading,
    isError: opportunitiesQuery.isError,
    error: opportunitiesQuery.error,
    refetch: opportunitiesQuery.refetch,
    createOpportunity: createOpportunityMutation.mutateAsync,
    isCreating: createOpportunityMutation.isPending,
  };
}

export function useProposal(id: string) {
  const queryClient = useQueryClient();

  const proposalQuery = useQuery({
    queryKey: ["collab", "proposals", id],
    queryFn: () => getProposalById(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: (data) => {
      queryClient.setQueryData(["collab", "proposals", data.id], data);
    },
  });

  return {
    proposal: proposalQuery.data ?? null,
    isLoading: proposalQuery.isLoading,
    isError: proposalQuery.isError,
    error: proposalQuery.error,
    createProposal: createProposalMutation.mutateAsync,
    isCreating: createProposalMutation.isPending,
  };
}
