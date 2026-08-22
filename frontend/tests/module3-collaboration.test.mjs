import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Module 3 uses real envelopes, routes, capabilities, and fail-closed service URLs", async () => {
  const [repository, types, registry, server, proposal, review, project] = await Promise.all([
    read("features/collaboration/repository.ts"),
    read("features/collaboration/types.ts"),
    read("features/workspace/config/workspace-registry.ts"),
    read("features/auth/server.ts"),
    read("features/collaboration/components/ProposalDetail.tsx"),
    read("features/reviews/components/ReviewDetail.tsx"),
    read("features/projects/components/ProjectDetail.tsx"),
  ]);
  assert.match(repository, /items: ResearchOpportunity\[\]/);
  assert.doesNotMatch(repository, /request<any>/);
  assert.match(types, /revision: number/);
  assert.match(types, /"ELIGIBLE"/);
  for (const route of ["collaboration_opportunities", "collaboration_reviews", "collaboration_projects"]) assert.match(registry, new RegExp(route));
  for (const env of ["GRANT_SERVICE_URL is required", "REVIEW_SERVICE_URL is required", "PROJECT_SERVICE_URL is required"]) assert.match(server, new RegExp(env));
  assert.match(proposal, /collab\.decisions\.issue_foundation/);
  assert.match(review, /reviews\.evaluations\.submit/);
  assert.match(project, /projects\.reports\.approve/);
  assert.doesNotMatch(`${proposal}${review}${project}`, /as unknown as|\|\| true/);
});
