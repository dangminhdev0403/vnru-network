"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { projectResource } from "./resource";

const projects = projectResource.bind(undefined);
export function useProjects() {
  const query = useQuery(projects.queries.list.options(undefined));
  return { projects: query.data?.items ?? [], nextCursor: query.data?.nextCursor ?? null, isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch };
}
export function useProject(id: string) {
  const detail = useQuery({ ...projects.queries.detail.options(id), enabled: Boolean(id) });
  const members = useQuery({ ...projects.queries.members.options(id), enabled: Boolean(id) });
  const addMember = useMutation(projects.mutations.addMember.options());
  const createMilestone = useMutation(projects.mutations.createMilestone.options());
  const updateMilestone = useMutation(projects.mutations.updateMilestone.options());
  const submitMilestone = useMutation(projects.mutations.submitMilestone.options());
  const reviewMilestone = useMutation(projects.mutations.reviewMilestone.options());
  const createReport = useMutation(projects.mutations.createReport.options());
  const updateReport = useMutation(projects.mutations.updateReport.options());
  const submitReport = useMutation(projects.mutations.submitReport.options());
  const reviewReport = useMutation(projects.mutations.reviewReport.options());
  const addOutcome = useMutation(projects.mutations.addOutcome.options());
  const complete = useMutation(projects.mutations.complete.options());
  const terminate = useMutation(projects.mutations.terminate.options());
  return { project: detail.data ?? null, members: members.data ?? [], isLoading: detail.isLoading || members.isLoading, isError: detail.isError || members.isError, error: detail.error ?? members.error, refetch: detail.refetch, addMember: addMember.mutateAsync, createMilestone: createMilestone.mutateAsync, updateMilestone: updateMilestone.mutateAsync, submitMilestone: submitMilestone.mutateAsync, reviewMilestone: reviewMilestone.mutateAsync, createReport: createReport.mutateAsync, updateReport: updateReport.mutateAsync, submitReport: submitReport.mutateAsync, reviewReport: reviewReport.mutateAsync, addOutcome: addOutcome.mutateAsync, complete: complete.mutateAsync, terminate: terminate.mutateAsync, isPending: [addMember, createMilestone, updateMilestone, submitMilestone, reviewMilestone, createReport, updateReport, submitReport, reviewReport, addOutcome, complete, terminate].some((mutation) => mutation.isPending) };
}
