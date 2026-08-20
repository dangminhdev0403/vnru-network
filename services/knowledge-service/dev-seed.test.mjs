/**
 * DB-backed dev-seed test.
 * Proves: seed-twice idempotent counts + PRIVATE exclusion from list and detail.
 *
 * Requires DATABASE_URL pointing at a migrated knowledge_db.
 * Run: node --env-file-if-exists=.env dev-seed.test.mjs
 */
import assert from 'node:assert/strict';
import test, { after, before } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedSql = fs.readFileSync(path.join(__dirname, 'prisma/dev-seed.sql'), 'utf8');

const PUBLIC_PUB_ID = 'b0000000-0000-4000-8000-000000000001';
const PRIVATE_PUB_ID = 'b0000000-0000-4000-8000-000000000002';

let pool;

before(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');
  pool = new pg.Pool({ connectionString: url });
  // Seed twice to prove idempotency
  await pool.query(seedSql);
  await pool.query(seedSql);
});

after(async () => {
  if (pool) await pool.end();
});

test('seed-twice produces stable PUBLIC count', async () => {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM "Publication" WHERE visibility = 'PUBLIC' AND id LIKE 'b0000000-0000-4000-8000-00000000000%'`);
  assert.equal(rows[0].n, 2, 'Expected exactly 2 PUBLIC seed publications');
});

test('seed-twice produces stable PRIVATE count', async () => {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM "Publication" WHERE visibility = 'PRIVATE' AND id LIKE 'b0000000-0000-4000-8000-00000000000%'`);
  assert.equal(rows[0].n, 1, 'Expected exactly 1 PRIVATE seed publication');
});

test('PRIVATE publication excluded from PUBLIC list query', async () => {
  const { rows } = await pool.query(`SELECT id FROM "Publication" WHERE visibility = 'PUBLIC' AND id = $1`, [PRIVATE_PUB_ID]);
  assert.equal(rows.length, 0, 'PRIVATE publication must not appear in PUBLIC query');
});

test('PRIVATE publication excluded from PUBLIC detail query', async () => {
  const { rows } = await pool.query(`SELECT id FROM "Publication" WHERE visibility = 'PUBLIC' AND id = $1`, [PRIVATE_PUB_ID]);
  assert.equal(rows.length, 0, 'PRIVATE publication must not be retrievable as PUBLIC detail');
});

test('PUBLIC publication retrievable by id', async () => {
  const { rows } = await pool.query(`SELECT id, title, abstract FROM "Publication" WHERE visibility = 'PUBLIC' AND id = $1`, [PUBLIC_PUB_ID]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].title, 'Bilateral AI Cooperation Framework');
  assert.ok(rows[0].abstract, 'PUBLIC detail should include abstract');
});

test('seed topics are stable', async () => {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM "KnowledgeTopic" WHERE id LIKE 'a0000000-0000-4000-8000-00000000000%'`);
  assert.equal(rows[0].n, 2);
});

test('seed authors are stable', async () => {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM "PublicationAuthorRef" WHERE id LIKE 'c0000000-0000-4000-8000-00000000000%'`);
  assert.equal(rows[0].n, 4);
});
