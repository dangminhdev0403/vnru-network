import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "prisma/schema.prisma");
const migrationPath = path.join(__dirname, "prisma/migrations/20260820002000_initial/migration.sql");

const schemaContent = fs.readFileSync(schemaPath, "utf8");
const migrationContent = fs.readFileSync(migrationPath, "utf8");

test("Prisma schema and Migration SQL files exist and are readable", () => {
  assert.ok(schemaContent.length > 0, "Prisma schema is empty");
  assert.ok(migrationContent.length > 0, "Migration SQL is empty");
});

test("Prove matching model and table presence", () => {
  const models = ["Publication", "KnowledgeTopic", "PublicationTopic", "PublicationAuthorRef"];

  // Verify models are present in schema.prisma
  for (const model of models) {
    const modelRegex = new RegExp(`model\\s+${model}\\s*\\{`);
    assert.ok(modelRegex.test(schemaContent), `Model ${model} missing in schema.prisma`);
  }

  // Verify tables are created in migration.sql
  for (const model of models) {
    const tableRegex = new RegExp(`CREATE TABLE\\s+"${model}"`, "i");
    assert.ok(tableRegex.test(migrationContent), `Table ${model} missing in migration.sql`);
  }
});

test("Prove PUBLIC/PRIVATE visibility enum is correctly implemented", () => {
  // Assert enum in schema.prisma
  assert.match(schemaContent, /enum\s+Visibility\s*\{/, "Visibility enum not found in schema.prisma");
  assert.match(schemaContent, /PUBLIC/, "PUBLIC value not found in enum Visibility");
  assert.match(schemaContent, /PRIVATE/, "PRIVATE value not found in enum Visibility");

  // Assert field type in schema.prisma
  assert.match(schemaContent, /visibility\s+Visibility/, "visibility field does not reference Visibility enum");

  // Assert enum type and values in migration.sql
  assert.match(migrationContent, /CREATE TYPE "Visibility" AS ENUM\s*\(\s*'PUBLIC'\s*,\s*'PRIVATE'\s*\)/i);
});

test("Prove uniqueness constraints are properly established", () => {
  // KnowledgeTopic slug uniqueness
  assert.match(schemaContent, /slug\s+String\s+@unique/);
  assert.match(migrationContent, /CREATE UNIQUE INDEX "KnowledgeTopic_slug_key" ON "KnowledgeTopic"\("slug"\)/i);

  // PublicationTopic composite unique identifier
  assert.match(schemaContent, /@@id\(\s*\[\s*publicationId\s*,\s*topicId\s*\]\s*\)/);
  assert.match(migrationContent, /CONSTRAINT "PublicationTopic_pkey" PRIMARY KEY \("publicationId",\s*"topicId"\)/i);

  // PublicationAuthorRef publicationId + expertRef uniqueness
  assert.match(schemaContent, /@@unique\(\s*\[\s*publicationId\s*,\s*expertRef\s*\]\s*\)/);
  assert.match(migrationContent, /CREATE UNIQUE INDEX "PublicationAuthorRef_publicationId_expertRef_key" ON "PublicationAuthorRef"\("publicationId",\s*"expertRef"\)/i);
});

test("Prove cross-service references lack foreign keys", () => {
  // In Publication: organizationRef has no relation attributes
  assert.match(schemaContent, /organizationRef\s+String\?/);
  assert.doesNotMatch(schemaContent, /organizationRef[^\n]*@relation/);

  // In PublicationAuthorRef: expertRef has no relation attributes
  assert.match(schemaContent, /expertRef\s+String/);
  assert.doesNotMatch(schemaContent, /expertRef[^\n]*@relation/);

  // Ensure there are no foreign key constraints matching expertRef or organizationRef in migration.sql
  assert.doesNotMatch(migrationContent, /FOREIGN KEY[^\n]*expertRef/i);
  assert.doesNotMatch(migrationContent, /FOREIGN KEY[^\n]*organizationRef/i);
});

test("Prove cursor indexes are properly set up for public discovery", () => {
  // Publication index for visibility, createdAt, and id
  assert.match(schemaContent, /@@index\(\s*\[\s*visibility\s*,\s*createdAt\s*,\s*id\s*\]\s*\)/);
  assert.match(migrationContent, /CREATE INDEX "Publication_visibility_createdAt_id_idx" ON "Publication"\("visibility",\s*"createdAt",\s*"id"\)/i);

  // PublicationAuthorRef index for displayOrder
  assert.match(schemaContent, /@@index\(\s*\[\s*publicationId\s*,\s*displayOrder\s*\]\s*\)/);
  assert.match(migrationContent, /CREATE INDEX "PublicationAuthorRef_publicationId_displayOrder_idx" ON "PublicationAuthorRef"\("publicationId",\s*"displayOrder"\)/i);
});
