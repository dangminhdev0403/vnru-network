import { createResource, defineQuery, defineMutation } from "@dangminhdev04032005/query-resource";
import { reviewRepository } from "./repository";
import type { CreateReviewAssignmentInput, EvaluationInput, ReviewAssignment } from "./types";

export const reviewResource = createResource<void>()({
  namespace: ["vnru", "reviews"],
  name: "reviews",
  scopeKey: () => ["current-context"],
  queries: {
    assignments: defineQuery({
      inputKey: (filters: { offset: number; limit: number }) => ["assignments", filters],
      queryFn: ({ input, signal }) => reviewRepository.listAssignments(input.offset, input.limit, signal),
    }),
    assignment: defineQuery({
      inputKey: (id: string) => ["assignment", id],
      queryFn: ({ input, signal }) => reviewRepository.getAssignmentDetail(input, signal),
    }),
  },
  mutations: {
    createAssignment: defineMutation<void, CreateReviewAssignmentInput, ReviewAssignment>({
      mutationFn: ({ variables }) => reviewRepository.createAssignment(variables),
    }),
    declareConflict: defineMutation<void, { id: string; declaration: 'CONFLICT' | 'NO_CONFLICT' }, ReviewAssignment>({
      mutationFn: ({ variables }) => reviewRepository.declareConflict(variables.id, variables.declaration),
    }),
    saveEvaluation: defineMutation<void, { id: string; evaluation: EvaluationInput }, ReviewAssignment>({
      mutationFn: ({ variables }) => reviewRepository.saveEvaluation(variables.id, variables.evaluation),
    }),
    submitEvaluation: defineMutation<void, { id: string; evaluation: Required<EvaluationInput> }, ReviewAssignment>({
      mutationFn: ({ variables }) => reviewRepository.submitEvaluation(variables.id, variables.evaluation),
    })
  }
});
