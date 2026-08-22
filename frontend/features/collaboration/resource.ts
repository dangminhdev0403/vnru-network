import { createResource, defineQuery, defineMutation } from "@dangminhdev04032005/query-resource";
import { collabRepository } from "./repository";
import type { ResearchOpportunity, CollaborationProposal, CreateProposalInput } from "./types";

export const collabResource = createResource<void>()({
  namespace: ["vnru", "collaboration"],
  name: "collaboration",
  scopeKey: () => ["current-context"],
  queries: {
    opportunities: defineQuery({
      inputKey: (filters: { cursor?: string; limit: number }) => ["opportunities", filters],
      queryFn: ({ input, signal }) => collabRepository.listOpportunities(input.cursor, input.limit, signal),
    }),
    proposal: defineQuery({
      inputKey: (id: string) => ["proposal", id],
      queryFn: ({ input, signal }) => collabRepository.getProposal(input, signal),
    }),
  },
  mutations: {
    createOpportunity: defineMutation<void, { id?: string; title: string; description?: string }, ResearchOpportunity>({
      mutationFn: ({ variables }) => collabRepository.createOpportunity(variables),
    }),
    publishOpportunity: defineMutation<void, string, ResearchOpportunity>({
      mutationFn: ({ variables }) => collabRepository.publishOpportunity(variables),
    }),
    closeOpportunity: defineMutation<void, string, ResearchOpportunity>({
      mutationFn: ({ variables }) => collabRepository.closeOpportunity(variables),
    }),
    createProposal: defineMutation<void, CreateProposalInput, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.createProposal(variables),
    }),
    reviseProposal: defineMutation<void, { id: string; content: string; expectedRevision: number }, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.reviseProposal(variables.id, { content: variables.content, expectedRevision: variables.expectedRevision }),
    }),
    confirmProposal: defineMutation<void, string, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.confirmProposal(variables),
    }),
    endorseProposal: defineMutation<void, string, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.endorseProposal(variables),
    }),
    submitProposal: defineMutation<void, string, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.submitProposal(variables),
    }),
    screenProposal: defineMutation<void, { id: string; eligible: boolean; reason?: string }, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.screenProposal(variables.id, { eligible: variables.eligible, reason: variables.reason }),
    }),
    decisionProposal: defineMutation<void, { id: string; approved: boolean; reason?: string; requestRevision?: boolean }, CollaborationProposal>({
      mutationFn: ({ variables }) => collabRepository.decisionProposal(variables.id, { approved: variables.approved, reason: variables.reason, requestRevision: variables.requestRevision }),
    }),
  }
});
