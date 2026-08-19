export interface Expertise {
  id: string | number;
  slug: string;
  label: string;
}

export interface Expert {
  id: string | number;
  visibility: string;
  expertise: Expertise[];
}

export interface MatchResult {
  candidateId: string | number;
  reasons: Expertise[];
}

/**
 * Deterministic explainable expert matching helper.
 * Filters candidates to exclude self and non-PUBLIC profiles.
 * Matches by intersecting expertise IDs.
 * Excludes candidates with zero overlap.
 * Sorts by shared count descending, then candidate ID ascending.
 * Caps the result list by limit (validated to be between 1 and 50).
 */
export function matchExperts(
  currentExpert: Expert,
  candidates: Expert[],
  limit: number = 50
): MatchResult[] {
  // Validate limit (must be an integer between 1 and 50)
  if (
    typeof limit !== 'number' ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 50
  ) {
    throw new Error('Limit must be an integer between 1 and 50');
  }

  // Map current expert's expertise IDs into a Set for O(1) checks
  const currentExpertiseIds = new Set(
    currentExpert.expertise.map((exp) => exp.id)
  );

  const matchedCandidates: {
    candidateId: string | number;
    reasons: Expertise[];
    sharedCount: number;
  }[] = [];

  for (const candidate of candidates) {
    // Exclude self (same ID as currentExpert)
    if (candidate.id === currentExpert.id) {
      continue;
    }

    // Exclude non-PUBLIC profiles
    if (candidate.visibility !== 'PUBLIC') {
      continue;
    }

    // Intersect by expertise id
    const sharedExpertise = candidate.expertise.filter((exp) =>
      currentExpertiseIds.has(exp.id)
    );

    // Exclude zero overlap
    if (sharedExpertise.length === 0) {
      continue;
    }

    matchedCandidates.push({
      candidateId: candidate.id,
      reasons: sharedExpertise,
      sharedCount: sharedExpertise.length,
    });
  }

  // Sort by shared count desc, then candidate id asc
  matchedCandidates.sort((a, b) => {
    if (b.sharedCount !== a.sharedCount) {
      return b.sharedCount - a.sharedCount;
    }
    // Candidate ID asc (handle numbers and strings appropriately)
    const idA = a.candidateId;
    const idB = b.candidateId;
    if (typeof idA === 'number' && typeof idB === 'number') {
      return idA - idB;
    }
    return String(idA).localeCompare(String(idB));
  });

  // Cap the results with limit and map to MatchResult (no percentage/score persistence)
  return matchedCandidates.slice(0, limit).map((match) => ({
    candidateId: match.candidateId,
    reasons: match.reasons,
  }));
}
