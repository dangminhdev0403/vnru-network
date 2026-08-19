import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_PATH = path.join(__dirname, 'prisma', 'schema.prisma');
const MIGRATION_PATH = path.join(__dirname, 'prisma', 'migrations', '20260820002000_initial', 'migration.sql');

test('Schema and Migration Validation', async (t) => {
  const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const migrationContent = fs.readFileSync(MIGRATION_PATH, 'utf8');

  await t.test('1. Visibility PUBLIC/PRIVATE is defined and used', () => {
    // Check Visibility enum in schema
    assert.match(schemaContent, /enum\s+Visibility\s*\{[^}]*PUBLIC[^}]*PRIVATE[^}]*\}/s, 'Visibility enum should be defined in schema.prisma with PUBLIC and PRIVATE');

    // Check visibility field in Organization and ResearcherProfile in schema
    assert.match(schemaContent, /model\s+Organization\s*\{[^}]*visibility\s+Visibility[^}]*\}/s, 'Organization should have visibility field of type Visibility');
    assert.match(schemaContent, /model\s+ResearcherProfile\s*\{[^}]*visibility\s+Visibility[^}]*\}/s, 'ResearcherProfile should have visibility field of type Visibility');

    // Check Visibility type in migration
    assert.match(migrationContent, /CREATE\s+TYPE\s+"Visibility"\s+AS\s+ENUM\s*\(\s*'PUBLIC'\s*,\s*'PRIVATE'\s*\)/, 'Visibility type should be defined in migration.sql as an ENUM');

    // Check visibility column in migration
    assert.match(migrationContent, /CREATE\s+TABLE\s+"Organization"\s*\([^)]*"visibility"\s+"Visibility"[^)]*\)/s, 'Organization table should have visibility column of type Visibility in migration.sql');
    assert.match(migrationContent, /CREATE\s+TABLE\s+"ResearcherProfile"\s*\([^)]*"visibility"\s+"Visibility"[^)]*\)/s, 'ResearcherProfile table should have visibility column of type Visibility in migration.sql');
  });

  await t.test('2. Uniqueness constraints are enforced', () => {
    // ExpertiseArea slug uniqueness in schema
    assert.match(schemaContent, /model\s+ExpertiseArea\s*\{[^}]*slug\s+String\s+@unique[^}]*\}/s, 'slug should have @unique constraint in schema.prisma');

    // ExpertiseArea slug uniqueness in migration
    assert.match(migrationContent, /CREATE\s+UNIQUE\s+INDEX\s+"ExpertiseArea_slug_key"\s+ON\s+"ExpertiseArea"\s*\(\s*"slug"\s*\)/i, 'ExpertiseArea slug unique index should be created in migration.sql');

    // ResearcherExpertise primary key in schema
    assert.match(schemaContent, /model\s+ResearcherExpertise\s*\{[^}]*@@id\(\s*\[\s*profileId\s*,\s*expertiseId\s*\]\s*\)[^}]*\}/s, 'ResearcherExpertise should have composite primary key on profileId and expertiseId in schema.prisma');

    // ResearcherExpertise primary key in migration
    assert.match(migrationContent, /CREATE\s+TABLE\s+"ResearcherExpertise"\s*\([^)]*CONSTRAINT\s+"ResearcherExpertise_pkey"\s+PRIMARY\s+KEY\s*\(\s*"profileId"\s*,\s*"expertiseId"\s*\)[^)]*\)/s, 'ResearcherExpertise should have composite primary key in migration.sql');
  });

  await t.test('3. Local organization foreign key is defined', () => {
    // Local FK in schema
    assert.match(schemaContent, /organizationId\s+String\s+@db\.Uuid/i, 'organizationId should be local UUID FK');
    assert.match(schemaContent, /organization\s+Organization\s+@relation\(\s*fields:\s*\[\s*organizationId\s*\]\s*,\s*references:\s*\[\s*id\s*\]/s, 'organization relation should refer to Organization(id) in schema.prisma');

    // Local FK constraint in migration
    assert.match(migrationContent, /ALTER\s+TABLE\s+"ResearcherProfile"\s+ADD\s+CONSTRAINT\s+"ResearcherProfile_organizationId_fkey"\s+FOREIGN\s+KEY\s*\(\s*"organizationId"\s*\)\s+REFERENCES\s+"Organization"\s*\(\s*"id"\s*\)/i, 'ResearcherProfile organizationId FK should refer to Organization(id) in migration.sql');
  });

  await t.test('4. External userRef exists without database-level FK', () => {
    // Schema check: userRef exists on ResearcherProfile but is optional/immutable (no relation)
    assert.match(schemaContent, /model\s+ResearcherProfile\s*\{[^}]*userRef\s+String\?[^}]*\}/s, 'userRef should be an optional String in ResearcherProfile in schema.prisma');
    assert.doesNotMatch(schemaContent, /@relation\([^)]*userRef[^)]*\)/i, 'userRef should not have a relation decorator pointing to user table in schema.prisma');

    // Migration check: userRef column exists but no FK references userRef
    assert.match(migrationContent, /CREATE\s+TABLE\s+"ResearcherProfile"\s*\([^)]*"userRef"\s+TEXT[^)]*\)/s, 'userRef column should be defined in ResearcherProfile table in migration.sql');
    assert.doesNotMatch(migrationContent, /FOREIGN\s+KEY\s*\(\s*"userRef"\s*\)/i, 'userRef column should not have a foreign key constraint in migration.sql');
  });

  await t.test('5. Cursor and filtering indexes exist', () => {
    // Indexes on Organization and ResearcherProfile
    assert.match(schemaContent, /model\s+Organization\s*\{[^}]*@@index\(\s*\[\s*visibility\s*,\s*createdAt\s*,\s*id\s*\]\s*\)[^}]*\}/s, 'Organization should index visibility, createdAt, and id for cursoring/filtering');
    assert.match(schemaContent, /model\s+ResearcherProfile\s*\{[^}]*@@index\(\s*\[\s*visibility\s*,\s*createdAt\s*,\s*id\s*\]\s*\)[^}]*\}/s, 'ResearcherProfile should index visibility, createdAt, and id for cursoring/filtering');

    // Indexes in migration
    assert.match(migrationContent, /CREATE\s+INDEX\s+"Organization_visibility_createdAt_id_idx"\s+ON\s+"Organization"\s*\(\s*"visibility"\s*,\s*"createdAt"\s*,\s*"id"\s*\)/i, 'Organization cursor index should be created in migration.sql');
    assert.match(migrationContent, /CREATE\s+INDEX\s+"ResearcherProfile_visibility_createdAt_id_idx"\s+ON\s+"ResearcherProfile"\s*\(\s*"visibility"\s*,\s*"createdAt"\s*,\s*"id"\s*\)/i, 'ResearcherProfile cursor index should be created in migration.sql');
  });

  await t.test('6. MatchSignal and other unapproved models are absent', () => {
    // Absence of MatchSignal or score tables in schema
    assert.doesNotMatch(schemaContent, /model\s+MatchSignal/i, 'MatchSignal model should not exist in schema.prisma');
    assert.doesNotMatch(schemaContent, /model\s+Score/i, 'Score model should not exist in schema.prisma');

    // Absence of MatchSignal in migration
    assert.doesNotMatch(migrationContent, /CREATE\s+TABLE\s+"MatchSignal"/i, 'MatchSignal table should not be created in migration.sql');
    assert.doesNotMatch(migrationContent, /CREATE\s+TABLE\s+"Score"/i, 'Score table should not be created in migration.sql');
  });
});
