export interface ReviewAssignment {
  id: string;
  proposalRef: string;
  reviewerId: string;
  boardRef: string;
  status: "PENDING" | "CONFLICT" | "DRAFT" | "SUBMITTED";
  snapshot?: { snapshot: Record<string, string | string[]> } | null;
  conflict?: { declaration: "CONFLICT" | "NO_CONFLICT" } | null;
  reviewRecord?: {
    status: "DRAFT" | "SUBMITTED";
    comments?: string | null;
    scores?: Array<{ dimension: keyof EvaluationScores; score: number }>;
  } | null;
}

export interface EvaluationScores {
  scientificMerit?: number;
  feasibility?: number;
  bilateralValue?: number;
  impact?: number;
}

export type EvaluationInput = EvaluationScores & { comments?: string };
export interface AssignmentList { items: ReviewAssignment[]; total: number }
export interface CreateReviewAssignmentInput {
  proposalRef: string;
  reviewerId: string;
  boardRef: string;
  proposalSnapshot: { title: string; abstract: string };
}
