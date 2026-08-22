import { createResource, defineMutation, defineQuery } from "@dangminhdev04032005/query-resource";
import { projectRepository } from "./repository";
import type { AddMemberInput, CreateMilestoneInput, CreateReportInput, OutcomeInput, Project, ProjectMember, ReviewInput, SubmitInput, TerminateInput, UpdateMilestoneInput, UpdateReportInput } from "./types";

export const projectResource = createResource<void>()({
  namespace: ["vnru", "projects"], name: "projects", scopeKey: () => ["current-context"],
  queries: {
    list: defineQuery({ inputKey: (input: undefined) => ["list", input], queryFn: ({ signal }) => projectRepository.list(signal) }),
    detail: defineQuery({ inputKey: (id: string) => ["detail", id], queryFn: ({ input, signal }) => projectRepository.getDetail(input, signal) }),
    members: defineQuery({ inputKey: (id: string) => ["members", id], queryFn: ({ input, signal }) => projectRepository.getMembers(input, signal) }),
  },
  mutations: {
    addMember: defineMutation<void, { id: string; input: AddMemberInput }, ProjectMember>({ mutationFn: ({ variables }) => projectRepository.addMember(variables.id, variables.input) }),
    createMilestone: defineMutation<void, { id: string; input: CreateMilestoneInput }, Project>({ mutationFn: ({ variables }) => projectRepository.createMilestone(variables.id, variables.input) }),
    updateMilestone: defineMutation<void, { id: string; milestoneId: string; input: UpdateMilestoneInput }, Project>({ mutationFn: ({ variables }) => projectRepository.updateMilestone(variables.id, variables.milestoneId, variables.input) }),
    submitMilestone: defineMutation<void, { id: string; milestoneId: string; input: SubmitInput }, Project>({ mutationFn: ({ variables }) => projectRepository.submitMilestone(variables.id, variables.milestoneId, variables.input) }),
    reviewMilestone: defineMutation<void, { id: string; milestoneId: string; input: ReviewInput }, Project>({ mutationFn: ({ variables }) => projectRepository.reviewMilestone(variables.id, variables.milestoneId, variables.input) }),
    createReport: defineMutation<void, { id: string; input: CreateReportInput }, Project>({ mutationFn: ({ variables }) => projectRepository.createReport(variables.id, variables.input) }),
    updateReport: defineMutation<void, { id: string; reportId: string; input: UpdateReportInput }, Project>({ mutationFn: ({ variables }) => projectRepository.updateReport(variables.id, variables.reportId, variables.input) }),
    submitReport: defineMutation<void, { id: string; reportId: string; input: SubmitInput }, Project>({ mutationFn: ({ variables }) => projectRepository.submitReport(variables.id, variables.reportId, variables.input) }),
    reviewReport: defineMutation<void, { id: string; reportId: string; input: ReviewInput }, Project>({ mutationFn: ({ variables }) => projectRepository.reviewReport(variables.id, variables.reportId, variables.input) }),
    addOutcome: defineMutation<void, { id: string; input: OutcomeInput }, Project>({ mutationFn: ({ variables }) => projectRepository.addOutcome(variables.id, variables.input) }),
    complete: defineMutation<void, { id: string; input: SubmitInput }, Project>({ mutationFn: ({ variables }) => projectRepository.complete(variables.id, variables.input) }),
    terminate: defineMutation<void, { id: string; input: TerminateInput }, Project>({ mutationFn: ({ variables }) => projectRepository.terminate(variables.id, variables.input) }),
  },
});
