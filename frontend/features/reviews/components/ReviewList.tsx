"use client";

import Link from "next/link";
import { useReviewAssignments } from "../hooks";
import type { ReviewAssignment } from "../types";

export function ReviewList() {
  const { assignments, isLoading } = useReviewAssignments();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!assignments.length) return <div className="p-8">No review assignments found.</div>;

  return (
    <div className="p-8 space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Review Assignments</h1>
      <div className="grid grid-cols-1 gap-4">
        {assignments.map((a: unknown) => {
          const assignment = a as ReviewAssignment;
          return (
            <Link key={assignment.id} href={`/workspace/collaboration/reviews/${assignment.id}`} className="block border p-4 rounded shadow-sm hover:shadow-md transition-shadow focus-visible:ring">
              <h2 className="font-semibold text-lg">Review {assignment.id}</h2>
              <p className="text-sm text-gray-500">Proposal: {assignment.proposalRef} | Status: {assignment.status}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
