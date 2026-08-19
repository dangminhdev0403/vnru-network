import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_PATH = path.join(__dirname, 'prisma', 'migrations', '20260820002000_initial', 'migration.sql');
const SEED_PATH = path.join(__dirname, 'prisma', 'dev-seed.sql');

const PG_URL = process.env.DATABASE_URL;
if (!PG_URL) throw new Error('DATABASE_URL is required');
const TEST_DB = 'vnru_org_seed_test';
const databaseUrl = (name) => {
  const url = new URL(PG_URL);
  url.pathname = `/${name}`;
  return url.href;
};

test('Dev Seed SQL Integration and Structural Verification', async (t) => {
  let client;

  t.before(async () => {
    // 1. Drop and recreate the test database
    const setupClient = new pg.Client({ connectionString: databaseUrl('postgres') });
    await setupClient.connect();
    try {
      await setupClient.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${TEST_DB}' AND pid <> pg_backend_pid();`);
      await setupClient.query(`DROP DATABASE IF EXISTS ${TEST_DB};`);
      await setupClient.query(`CREATE DATABASE ${TEST_DB};`);
    } finally {
      await setupClient.end();
    }

    // 2. Connect to the new test database
    client = new pg.Client({ connectionString: databaseUrl(TEST_DB) });
    await client.connect();

    // 3. Run the initial migration to create the tables
    const migrationSql = fs.readFileSync(MIGRATION_PATH, 'utf8');
    await client.query(migrationSql);
  });

  t.after(async () => {
    if (client) {
      await client.end();
    }
    // Clean up test database
    const cleanupClient = new pg.Client({ connectionString: databaseUrl('postgres') });
    await cleanupClient.connect();
    try {
      await cleanupClient.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${TEST_DB}' AND pid <> pg_backend_pid();`);
      await cleanupClient.query(`DROP DATABASE IF EXISTS ${TEST_DB};`);
    } finally {
      await cleanupClient.end();
    }
  });

  await t.test('Seed Execution and Idempotency', async () => {
    const seedSql = fs.readFileSync(SEED_PATH, 'utf8');

    // Run the seed for the first time
    await assert.doesNotReject(async () => {
      await client.query(seedSql);
    }, 'First seed run should succeed');

    // Count records after first run
    const orgs1 = await client.query('SELECT COUNT(*)::int as count FROM "Organization";');
    const profiles1 = await client.query('SELECT COUNT(*)::int as count FROM "ResearcherProfile";');
    const expertise1 = await client.query('SELECT COUNT(*)::int as count FROM "ExpertiseArea";');
    const links1 = await client.query('SELECT COUNT(*)::int as count FROM "ResearcherExpertise";');

    assert.ok(orgs1.rows[0].count >= 2, 'Should insert at least 2 organizations');
    assert.ok(profiles1.rows[0].count >= 4, 'Should insert at least 4 expert profiles');
    assert.ok(expertise1.rows[0].count >= 3, 'Should insert at least 3 expertise areas');

    // Run the seed for the second time to check idempotency
    await assert.doesNotReject(async () => {
      await client.query(seedSql);
    }, 'Second seed run should succeed (idempotency)');

    // Count records after second run
    const orgs2 = await client.query('SELECT COUNT(*)::int as count FROM "Organization";');
    const profiles2 = await client.query('SELECT COUNT(*)::int as count FROM "ResearcherProfile";');
    const expertise2 = await client.query('SELECT COUNT(*)::int as count FROM "ExpertiseArea";');
    const links2 = await client.query('SELECT COUNT(*)::int as count FROM "ResearcherExpertise";');

    // Verify row counts are exactly the same
    assert.strictEqual(orgs2.rows[0].count, orgs1.rows[0].count, 'Organization count must remain unchanged');
    assert.strictEqual(profiles2.rows[0].count, profiles1.rows[0].count, 'ResearcherProfile count must remain unchanged');
    assert.strictEqual(expertise2.rows[0].count, expertise1.rows[0].count, 'ExpertiseArea count must remain unchanged');
    assert.strictEqual(links2.rows[0].count, links1.rows[0].count, 'ResearcherExpertise count must remain unchanged');
  });

  await t.test('Country Coverage and Public/Private Access Control', async () => {
    // VN and RU public organizations exist
    const vnOrgs = await client.query('SELECT * FROM "Organization" WHERE country = \'VN\' AND visibility = \'PUBLIC\';');
    const ruOrgs = await client.query('SELECT * FROM "Organization" WHERE country = \'RU\' AND visibility = \'PUBLIC\';');

    assert.ok(vnOrgs.rows.length >= 1, 'At least one public VN organization should exist');
    assert.ok(ruOrgs.rows.length >= 1, 'At least one public RU organization should exist');

    // At least 3 public experts and 1 private expert
    const publicExperts = await client.query('SELECT * FROM "ResearcherProfile" WHERE visibility = \'PUBLIC\';');
    const privateExperts = await client.query('SELECT * FROM "ResearcherProfile" WHERE visibility = \'PRIVATE\';');

    assert.ok(publicExperts.rows.length >= 3, 'Should have at least 3 public experts');
    assert.ok(privateExperts.rows.length >= 1, 'Should have at least 1 private expert');
  });

  await t.test('Multilingual Label Compliance (vi, en, ru)', async () => {
    const expertise = await client.query('SELECT * FROM "ExpertiseArea";');
    for (const row of expertise.rows) {
      const labels = typeof row.labels === 'string' ? JSON.parse(row.labels) : row.labels;
      assert.ok(labels.vi, `Expertise Area ${row.slug} should have a Vietnamese label`);
      assert.ok(labels.en, `Expertise Area ${row.slug} should have an English label`);
      assert.ok(labels.ru, `Expertise Area ${row.slug} should have a Russian label`);
    }
  });

  await t.test('Deterministic Shared and Distinct Expertise Match Fixture', async () => {
    // Nguyen Van A (VNU - VN) specializes in AI and Material Science
    // Dmitry Petrov (MSU - RU) specializes in AI and Nuclear Physics
    // Elena Sidorova (MSU - RU) specializes in Material Science
    // Tran Thi B (VNU - VN) specializes in Nuclear Physics

    // Let's check deterministic matches by shared expertise
    const aiMatches = await client.query(`
      SELECT p1."displayName" as exp1, p2."displayName" as exp2
      FROM "ResearcherExpertise" re1
      JOIN "ResearcherExpertise" re2 ON re1."expertiseId" = re2."expertiseId" AND re1."profileId" < re2."profileId"
      JOIN "ResearcherProfile" p1 ON re1."profileId" = p1.id
      JOIN "ResearcherProfile" p2 ON re2."profileId" = p2.id
      JOIN "ExpertiseArea" ea ON re1."expertiseId" = ea.id
      WHERE ea.slug = 'ai-machine-learning'
    `);

    assert.strictEqual(aiMatches.rows.length, 1, 'Should be exactly one pair sharing AI & ML expertise');
    const match = aiMatches.rows[0];
    const names = [match.exp1, match.exp2].sort();
    assert.deepStrictEqual(names, ['Dmitry Petrov', 'Nguyen Van A'], 'AI match must be Dmitry Petrov and Nguyen Van A');

    // Nuclear Physics match between Tran Thi B and Dmitry Petrov
    const physicsMatches = await client.query(`
      SELECT p1."displayName" as exp1, p2."displayName" as exp2
      FROM "ResearcherExpertise" re1
      JOIN "ResearcherExpertise" re2 ON re1."expertiseId" = re2."expertiseId" AND re1."profileId" < re2."profileId"
      JOIN "ResearcherProfile" p1 ON re1."profileId" = p1.id
      JOIN "ResearcherProfile" p2 ON re2."profileId" = p2.id
      JOIN "ExpertiseArea" ea ON re1."expertiseId" = ea.id
      WHERE ea.slug = 'nuclear-physics'
    `);
    assert.strictEqual(physicsMatches.rows.length, 1, 'Should be exactly one pair sharing Nuclear Physics expertise');
    const pNames = [physicsMatches.rows[0].exp1, physicsMatches.rows[0].exp2].sort();
    assert.deepStrictEqual(pNames, ['Dmitry Petrov', 'Tran Thi B'], 'Nuclear physics match must be Dmitry Petrov and Tran Thi B');

    // Material Science match between Nguyen Van A and Elena Sidorova (private expert)
    const materialMatches = await client.query(`
      SELECT p1."displayName" as exp1, p2."displayName" as exp2
      FROM "ResearcherExpertise" re1
      JOIN "ResearcherExpertise" re2 ON re1."expertiseId" = re2."expertiseId" AND re1."profileId" < re2."profileId"
      JOIN "ResearcherProfile" p1 ON re1."profileId" = p1.id
      JOIN "ResearcherProfile" p2 ON re2."profileId" = p2.id
      JOIN "ExpertiseArea" ea ON re1."expertiseId" = ea.id
      WHERE ea.slug = 'material-science'
    `);
    assert.strictEqual(materialMatches.rows.length, 1, 'Should be exactly one pair sharing Material Science expertise');
    const mNames = [materialMatches.rows[0].exp1, materialMatches.rows[0].exp2].sort();
    assert.deepStrictEqual(mNames, ['Elena Sidorova', 'Nguyen Van A'], 'Material science match must be Elena Sidorova and Nguyen Van A');
  });

  await t.test('Sanity check that no real person/email/identifier is seeded', async () => {
    const profiles = await client.query('SELECT * FROM "ResearcherProfile";');
    for (const p of profiles.rows) {
      assert.doesNotMatch(p.displayName, /@/, 'Name should not contain an email');
      assert.doesNotMatch(p.bio || '', /@/, 'Bio should not contain an email');
      assert.doesNotMatch(p.displayName, /real/i, 'No real indicators');
    }
  });
});
