"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { reviewResource } from "./resource";

const reviews = reviewResource.bind(undefined);
export function useReviewAssignments(offset = 0, limit = 20) {
  const query = useQuery(reviews.queries.assignments.options({ offset, limit }));
  return { assignments: query.data?.items ?? [], total: query.data?.total ?? 0, isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch };
}
export function useCreateReviewAssignment() {
  const mutation = useMutation(reviews.mutations.createAssignment.options());
  return { createAssignment: mutation.mutateAsync, isPending: mutation.isPending };
}
export function useReviewAssignment(id: string) {
  const query = useQuery({ ...reviews.queries.assignment.options(id), enabled: Boolean(id) });
  const conflict = useMutation(reviews.mutations.declareConflict.options());
  const save = useMutation(reviews.mutations.saveEvaluation.options());
  const submit = useMutation(reviews.mutations.submitEvaluation.options());
  return { assignment: query.data ?? null, isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch, declareConflict: conflict.mutateAsync, saveEvaluation: save.mutateAsync, submitEvaluation: submit.mutateAsync, isPending: conflict.isPending || save.isPending || submit.isPending };
}
