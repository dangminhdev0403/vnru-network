import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Fixture topology: 8 acceptance actors are configured with exact contexts and capabilities", async () => {
  const accountJsonRaw = await read("services/auth-service/prisma/account.json");
  const accountData = JSON.parse(accountJsonRaw);

  const fixtures = accountData.fixtures;
  assert.equal(fixtures.length, 8, "Must contain exactly 8 acceptance fixtures");

  const roles = fixtures.map((f) => f.role.name);
  const emails = fixtures.map((f) => f.user.email);
  const contextTypes = fixtures.map((f) => f.roleAssignment.contextType);

  // 1. KNOWLEDGE_CURATOR
  assert(roles.includes("KNOWLEDGE_CURATOR"));
  assert(emails.includes("curator@vnru.network"));

  // 2. RESEARCHER VN
  assert(emails.includes("researcher@vnru.network"));
  const researcherVn = fixtures.find((f) => f.user.email === "researcher@vnru.network");
  assert.equal(researcherVn.roleAssignment.contextType, "ORGANIZATION");
  assert.equal(researcherVn.roleAssignment.contextId, "ORG_001");
  const resVnPerms = researcherVn.permissions.map((p) => p.key);
  assert(resVnPerms.includes("knowledge.workspace.view"));
  assert(resVnPerms.includes("collab.proposals.create"));
  assert(resVnPerms.includes("collab.proposals.confirm_paired"));
  assert(resVnPerms.includes("collab.proposals.submit"));

  // 3. RESEARCHER RU
  assert(emails.includes("researcher_ru@vnru.network"));
  const researcherRu = fixtures.find((f) => f.user.email === "researcher_ru@vnru.network");
  assert.equal(researcherRu.roleAssignment.contextType, "ORGANIZATION");
  assert.equal(researcherRu.roleAssignment.contextId, "ORG_002");
  const resRuPerms = researcherRu.permissions.map((p) => p.key);
  assert(resRuPerms.includes("knowledge.workspace.view"));
  assert(resRuPerms.includes("collab.proposals.create"));
  assert(resRuPerms.includes("collab.proposals.confirm_paired"));
  assert(resRuPerms.includes("collab.proposals.submit"));

  // 4. ORG REP VN
  assert(emails.includes("org_rep@vnru.network"));
  const orgRepVn = fixtures.find((f) => f.user.email === "org_rep@vnru.network");
  assert.equal(orgRepVn.roleAssignment.contextType, "ORGANIZATION");
  assert.equal(orgRepVn.roleAssignment.contextId, "ORG_001");
  assert(orgRepVn.permissions.map((p) => p.key).includes("collab.proposals.endorse"));

  // 5. ORG REP RU
  assert(emails.includes("org_rep_ru@vnru.network"));
  const orgRepRu = fixtures.find((f) => f.user.email === "org_rep_ru@vnru.network");
  assert.equal(orgRepRu.roleAssignment.contextType, "ORGANIZATION");
  assert.equal(orgRepRu.roleAssignment.contextId, "ORG_002");
  assert(orgRepRu.permissions.map((p) => p.key).includes("collab.proposals.endorse"));

  // 6. REVIEWER
  assert(roles.includes("REVIEWER"));
  const reviewer = fixtures.find((f) => f.role.name === "REVIEWER");
  assert.equal(reviewer.roleAssignment.contextType, "REVIEW_BOARD");
  assert.equal(reviewer.roleAssignment.contextId, "BOARD_001");
  assert(reviewer.permissions.map((p) => p.key).includes("reviews.evaluations.score"));

  // 7. COLLABORATION_MANAGER
  assert(roles.includes("COLLABORATION_MANAGER"));
  const collabMgr = fixtures.find((f) => f.role.name === "COLLABORATION_MANAGER");
  assert.equal(collabMgr.roleAssignment.contextType, "PLATFORM");
  assert(collabMgr.permissions.map((p) => p.key).includes("collab.opportunities.create"));
  assert(collabMgr.permissions.map((p) => p.key).includes("collab.opportunities.publish"));
  assert(collabMgr.permissions.map((p) => p.key).includes("collab.proposals.screen"));

  // 8. FOUNDATION_DECISION_MAKER
  assert(roles.includes("FOUNDATION_DECISION_MAKER"));
  const foundation = fixtures.find((f) => f.role.name === "FOUNDATION_DECISION_MAKER");
  assert.equal(foundation.roleAssignment.contextType, "PLATFORM");
  assert(foundation.permissions.map((p) => p.key).includes("collab.decisions.issue_foundation"));

  // Negative tests: Forbidden roles & contexts
  assert(!roles.includes("SUPER_ADMIN"), "Must NOT contain SUPER_ADMIN");
  assert(!roles.includes("PROGRAM_MANAGER"), "Must NOT contain PROGRAM_MANAGER");
  assert(!roles.includes("PROJECT_LEAD"), "Must NOT contain PROJECT_LEAD");
  assert(!contextTypes.includes("FUNDING_PROGRAM"), "Must NOT contain FUNDING_PROGRAM context");
});
