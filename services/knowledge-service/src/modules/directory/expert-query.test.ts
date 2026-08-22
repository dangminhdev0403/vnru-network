import test from 'node:test';
import assert from 'node:assert';
import {
  parseExpertQuery,
  parseCursor,
  serializeCursor
} from './expert-query';

test('1. Limit validation and parsing', async (t) => {
  await t.test('uses default limit of 20 when limit is not provided', () => {
    const res1 = parseExpertQuery({});
    assert.strictEqual(res1.limit, 20);

    const res2 = parseExpertQuery(undefined);
    assert.strictEqual(res2.limit, 20);
  });

  await t.test('accepts custom limits within [1, 50]', () => {
    const res1 = parseExpertQuery({ limit: 1 });
    assert.strictEqual(res1.limit, 1);

    const res2 = parseExpertQuery({ limit: 25 });
    assert.strictEqual(res2.limit, 25);

    const res3 = parseExpertQuery({ limit: 50 });
    assert.strictEqual(res3.limit, 50);

    // Numeric strings
    const res4 = parseExpertQuery({ limit: "25" });
    assert.strictEqual(res4.limit, 25);
  });

  await t.test('rejects limit > 50', () => {
    assert.throws(() => parseExpertQuery({ limit: 51 }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "51" }), /limit/i);
  });

  await t.test('rejects limit < 1', () => {
    assert.throws(() => parseExpertQuery({ limit: 0 }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: -5 }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "0" }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "-1" }), /limit/i);
  });

  await t.test('rejects float limits', () => {
    assert.throws(() => parseExpertQuery({ limit: 20.5 }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "20.5" }), /limit/i);
  });

  await t.test('rejects malformed limit strings', () => {
    assert.throws(() => parseExpertQuery({ limit: "20abc" }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "abc" }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "" }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: "0x14" }), /limit/i);
  });

  await t.test('rejects invalid type for limit', () => {
    assert.throws(() => parseExpertQuery({ limit: true }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: [] }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: {} }), /limit/i);
    assert.throws(() => parseExpertQuery({ limit: null }), /limit/i);
  });
});

test('2. Optional filters and extra keys', async (t) => {
  await t.test('accepts valid optional string filters', () => {
    const res = parseExpertQuery({
      q: 'search term',
      country: 'VN',
      organization: 'e1d5a7d3-7d1a-47ef-b203-d2d89f7db387',
      topic: 'AI and bilateral research',
      language: 'vi'
    });
    assert.strictEqual(res.q, 'search term');
    assert.strictEqual(res.country, 'VN');
    assert.strictEqual(res.organization, 'e1d5a7d3-7d1a-47ef-b203-d2d89f7db387');
    assert.strictEqual(res.topic, 'AI and bilateral research');
    assert.strictEqual(res.language, 'vi');
    assert.strictEqual(res.limit, 20); // default
  });

  await t.test('omits filters that are undefined', () => {
    const res = parseExpertQuery({ q: 'test', country: undefined });
    assert.strictEqual(res.q, 'test');
    assert.strictEqual('country' in res, false);
  });

  await t.test('rejects invalid types for optional filters', () => {
    assert.throws(() => parseExpertQuery({ q: 123 }), /filter q/i);
    assert.throws(() => parseExpertQuery({ country: true }), /filter country/i);
    assert.throws(() => parseExpertQuery({ organization: {} }), /filter organization/i);
    assert.throws(() => parseExpertQuery({ topic: [] }), /filter topic/i);
    assert.throws(() => parseExpertQuery({ language: null }), /filter language/i);
  });

  await t.test('rejects extra keys in query object', () => {
    assert.throws(() => parseExpertQuery({ limit: 10, page: 2 }), /extra key/i);
    assert.throws(() => parseExpertQuery({ q: 'test', foo: 'bar' }), /extra key/i);
  });

  await t.test('rejects non-plain object inputs', () => {
    assert.throws(() => parseExpertQuery("limit=10"), /plain object/i);
    assert.throws(() => parseExpertQuery(null), /plain object/i);
    assert.throws(() => parseExpertQuery([]), /plain object/i);
    assert.throws(() => parseExpertQuery(123), /plain object/i);
  });
});

test('3. Cursor validation and parsing', async (t) => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';
  const validISO = '2026-08-20T00:42:57.000Z';

  await t.test('parses a valid base64url cursor', () => {
    const cursorObj = { createdAt: validISO, id: validUUID };
    const serialized = serializeCursor(cursorObj);
    const parsed = parseCursor(serialized);

    assert.strictEqual(parsed.createdAt, validISO);
    assert.strictEqual(parsed.id, validUUID);
  });

  await t.test('normalizes UUID to lowercase', () => {
    const upperUUID = '123E4567-E89B-12D3-A456-426614174000';
    const cursorObj = { createdAt: validISO, id: upperUUID };
    const serialized = serializeCursor(cursorObj);
    const parsed = parseCursor(serialized);

    assert.strictEqual(parsed.id, validUUID); // should be lowercase
  });

  await t.test('normalizes ISO date to UTC representation', () => {
    const offsetISO = '2026-08-20T07:42:57.000+07:00';
    const expectedUTC = new Date(offsetISO).toISOString();
    const cursorObj = { createdAt: offsetISO, id: validUUID };
    const serialized = serializeCursor(cursorObj);
    const parsed = parseCursor(serialized);

    assert.strictEqual(parsed.createdAt, expectedUTC);
  });

  await t.test('rejects standard base64 strings with padding/invalid characters', () => {
    // Normal base64 might have '+' or '/' or '='
    // Let's create an object that when encoded with standard base64 has padding
    // {"createdAt":"2026-08-20T00:42:57.000Z","id":"123e4567-e89b-12d3-a456-426614174000"}
    const jsonStr = JSON.stringify({ createdAt: validISO, id: validUUID });
    const stdBase64 = Buffer.from(jsonStr, 'utf8').toString('base64');

    if (stdBase64.includes('=') || stdBase64.includes('+') || stdBase64.includes('/')) {
      // The encoded string is highly likely to contain '=' or '+' or '/'
      assert.throws(() => parseCursor(stdBase64), /base64url/i);
    }
  });

  await t.test('rejects cursor with extra keys', () => {
    const extraCursorObj = { createdAt: validISO, id: validUUID, extra: 'forbidden' };
    assert.throws(() => serializeCursor(extraCursorObj as any), /fields/i);

    const jsonStr = JSON.stringify(extraCursorObj);
    const serialized = Buffer.from(jsonStr, 'utf8').toString('base64url');
    assert.throws(() => parseCursor(serialized), /fields/i);
  });

  await t.test('rejects cursor with missing keys', () => {
    const missingCursorObj = { createdAt: validISO };
    assert.throws(() => serializeCursor(missingCursorObj as any), /createdAt and id/i);

    const jsonStr = JSON.stringify(missingCursorObj);
    const serialized = Buffer.from(jsonStr, 'utf8').toString('base64url');
    assert.throws(() => parseCursor(serialized), /createdAt and id/i);
  });

  await t.test('rejects cursor with invalid type-invalid properties', () => {
    const badCursorObj = { createdAt: validISO, id: 12345 };
    assert.throws(() => serializeCursor(badCursorObj as any), /UUID/i);

    const jsonStr = JSON.stringify(badCursorObj);
    const serialized = Buffer.from(jsonStr, 'utf8').toString('base64url');
    assert.throws(() => parseCursor(serialized), /id must be a string/i);
  });

  await t.test('rejects invalid UUID formats', () => {
    const badUUIDs = [
      '123e4567-e89b-12d3-a456',
      'invalid-uuid-format-here',
      '123e4567-e89b-12d3-a456-42661417400g', // non-hex character 'g'
      ''
    ];
    for (const badUUID of badUUIDs) {
      assert.throws(() => serializeCursor({ createdAt: validISO, id: badUUID }), /UUID/i);
      const jsonStr = JSON.stringify({ createdAt: validISO, id: badUUID });
      const serialized = Buffer.from(jsonStr, 'utf8').toString('base64url');
      assert.throws(() => parseCursor(serialized), /UUID/i);
    }
  });

  await t.test('rejects invalid ISO dates', () => {
    const badDates = [
      '2026-02-30T00:00:00Z', // Feb 30th is invalid
      '2026-04-31T00:00:00Z', // April 31st is invalid
      '2026-08-20 00:42:57',  // Missing T and Z/offset
      '2026-08-20T25:00:00Z', // Hour 25 is invalid
      '2026-08-20T00:62:00Z', // Minute 62 is invalid
      'not-a-date'
    ];
    for (const badDate of badDates) {
      assert.throws(() => serializeCursor({ createdAt: badDate, id: validUUID }), /date/i);
      const jsonStr = JSON.stringify({ createdAt: badDate, id: validUUID });
      const serialized = Buffer.from(jsonStr, 'utf8').toString('base64url');
      assert.throws(() => parseCursor(serialized), /date/i);
    }
  });
});

test('4. Immutability and roundtrip validation', async (t) => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';
  const validISO = '2026-08-20T00:42:57.000Z';

  await t.test('returned objects are deeply frozen', () => {
    const cursorObj = { createdAt: validISO, id: validUUID };
    const serialized = serializeCursor(cursorObj);

    const queryResult = parseExpertQuery({
      limit: 15,
      cursor: serialized,
      q: 'ai'
    });

    assert.strictEqual(Object.isFrozen(queryResult), true);
    assert.strictEqual(Object.isFrozen(queryResult.cursor), true);

    // Attempting to modify properties should fail in strict mode (node tests run in strict mode)
    assert.throws(() => {
      (queryResult as any).limit = 30;
    });
    assert.throws(() => {
      (queryResult.cursor as any).id = 'new-id';
    });
  });

  await t.test('roundtrip serializes and parses back exactly', () => {
    const original = { createdAt: validISO, id: validUUID };
    const serialized = serializeCursor(original);
    const parsed = parseCursor(serialized);

    assert.deepStrictEqual(parsed, original);

    // Verify key ordering in serialization (createdAt, then id) is deterministic
    const serializedWithOtherOrder = serializeCursor({ id: validUUID, createdAt: validISO });
    assert.strictEqual(serializedWithOtherOrder, serialized);
  });
});
