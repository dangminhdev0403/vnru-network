import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePublicationQuery, decodeCursor, encodeCursor } from './publication-query.ts';
import type { Cursor } from './publication-query.ts';

test('Limit validation and defaults', () => {
  // Default value when limit is not specified
  const q1 = parsePublicationQuery({});
  assert.equal(q1.limit, 20);
  assert.ok(Object.isFrozen(q1));

  // Valid limits
  const q2 = parsePublicationQuery({ limit: 1 });
  assert.equal(q2.limit, 1);

  const q3 = parsePublicationQuery({ limit: 50 });
  assert.equal(q3.limit, 50);

  const q4 = parsePublicationQuery({ limit: '35' });
  assert.equal(q4.limit, 35);

  // Reject invalid limits
  assert.throws(() => parsePublicationQuery({ limit: 0 }));
  assert.throws(() => parsePublicationQuery({ limit: 51 }));
  assert.throws(() => parsePublicationQuery({ limit: -5 }));
  assert.throws(() => parsePublicationQuery({ limit: 20.5 }));
  assert.throws(() => parsePublicationQuery({ limit: 'abc' }));
  assert.throws(() => parsePublicationQuery({ limit: '20.5' }));
  assert.throws(() => parsePublicationQuery({ limit: ' 20 ' }));
  assert.throws(() => parsePublicationQuery({ limit: null }));
  assert.throws(() => parsePublicationQuery({ limit: {} }));
  assert.throws(() => parsePublicationQuery({ limit: [] }));
});

test('Optional filters validations', () => {
  const currentYear = new Date().getFullYear();

  // Valid optional parameters
  const q1 = parsePublicationQuery({
    q: 'search term',
    country: 'VN',
    organization: 'Institute A',
    topic: 'Machine Learning',
    language: 'vi',
    year: 2026,
  });
  assert.equal(q1.q, 'search term');
  assert.equal(q1.country, 'VN');
  assert.equal(q1.organization, 'Institute A');
  assert.equal(q1.topic, 'Machine Learning');
  assert.equal(q1.language, 'vi');
  assert.equal(q1.year, 2026);
  assert.ok(Object.isFrozen(q1));

  // Year range constraints (1000..current year)
  const q2 = parsePublicationQuery({ year: 1000 });
  assert.equal(q2.year, 1000);

  const q3 = parsePublicationQuery({ year: currentYear });
  assert.equal(q3.year, currentYear);

  const q4 = parsePublicationQuery({ year: '2020' });
  assert.equal(q4.year, 2020);

  // Invalid year checks
  assert.throws(() => parsePublicationQuery({ year: 999 }));
  assert.throws(() => parsePublicationQuery({ year: currentYear + 1 }));
  assert.throws(() => parsePublicationQuery({ year: 2020.5 }));
  assert.throws(() => parsePublicationQuery({ year: 'abc' }));
  assert.throws(() => parsePublicationQuery({ year: '2020.5' }));
  assert.throws(() => parsePublicationQuery({ year: {} }));

  // Non-string checks for optional filters
  assert.throws(() => parsePublicationQuery({ q: 123 }));
  assert.throws(() => parsePublicationQuery({ country: {} }));
  assert.throws(() => parsePublicationQuery({ organization: [] }));
  assert.throws(() => parsePublicationQuery({ topic: true }));
  assert.throws(() => parsePublicationQuery({ language: null }));
});

test('Cursor encoding/decoding and strict boundary validations', () => {
  const validCursor: Cursor = {
    createdAt: '2026-08-20T00:00:00.000Z',
    id: '3bf53200-caed-4d8a-85f2-76bb0a1ec18e',
  };

  // Encode/decode roundtrip
  const encoded = encodeCursor(validCursor);
  // Verify standard base64url characters only (no +, /, = padding)
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  
  const decoded = decodeCursor(encoded);
  assert.deepEqual(decoded, validCursor);
  assert.ok(Object.isFrozen(decoded));

  // Decode inside query parsing
  const queryWithCursorStr = parsePublicationQuery({ cursor: encoded });
  assert.deepEqual(queryWithCursorStr.cursor, validCursor);
  assert.ok(Object.isFrozen(queryWithCursorStr.cursor));

  // Accept valid pre-decoded cursor object
  const queryWithCursorObj = parsePublicationQuery({ cursor: validCursor });
  assert.deepEqual(queryWithCursorObj.cursor, validCursor);

  // Reject malformed/type-invalid cursor structures
  // 1. Extra property
  assert.throws(() => decodeCursor(Buffer.from(JSON.stringify({ ...validCursor, extra: 1 }), 'utf8').toString('base64url')));
  // 2. Missing property
  assert.throws(() => decodeCursor(Buffer.from(JSON.stringify({ createdAt: '2026-08-20T00:00:00Z' }), 'utf8').toString('base64url')));
  // 3. Invalid createdAt format
  assert.throws(() => decodeCursor(Buffer.from(JSON.stringify({ createdAt: '2026/08/20 00:00:00', id: validCursor.id }), 'utf8').toString('base64url')));
  assert.throws(() => decodeCursor(Buffer.from(JSON.stringify({ createdAt: '2026-02-30T00:00:00Z', id: validCursor.id }), 'utf8').toString('base64url')));
  // 4. Invalid UUID id format
  assert.throws(() => decodeCursor(Buffer.from(JSON.stringify({ createdAt: validCursor.createdAt, id: 'invalid-uuid-format' }), 'utf8').toString('base64url')));
  // 5. Non-base64url characters in cursor string
  assert.throws(() => decodeCursor(encoded + '='));
  assert.throws(() => decodeCursor(''));
  assert.throws(() => decodeCursor(' '));
  // 6. Malformed JSON
  assert.throws(() => decodeCursor('not-json'));
});

test('Unknown/extra properties on query object must be rejected', () => {
  assert.throws(() => parsePublicationQuery({ limit: 10, extraFilter: 'something' }));
  assert.throws(() => parsePublicationQuery({ limit: 10, offset: 20 }));
});
