import { Buffer } from 'node:buffer';

export interface ParsedExpertQuery {
  readonly limit: number;
  readonly cursor?: {
    readonly createdAt: string;
    readonly id: string;
  };
  readonly q?: string;
  readonly country?: string;
  readonly organization?: string;
  readonly topic?: string;
  readonly language?: string;
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    return false;
  }
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

function isValidISODate(str: string): boolean {
  // Regex matches standard ISO 8601 formats including UTC (Z) and timezone offsets (+/-HH:MM or +/-HHMM)
  const isoRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):?[0-5]\d)$/;
  if (!isoRegex.test(str)) {
    return false;
  }
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  // Rollover verification (e.g. Feb 30 -> March 2)
  const parts = str.split(/[-T:Z.+-]/);
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Date.UTC expects 0-indexed month
  const day = parseInt(parts[2], 10);
  const utcDate = new Date(Date.UTC(year, month, day));
  return utcDate.getUTCFullYear() === year && utcDate.getUTCMonth() === month && utcDate.getUTCDate() === day;
}

function parseAndValidateLimit(val: unknown): number {
  if (val === undefined) {
    return 20;
  }
  if (typeof val === 'number') {
    if (!Number.isInteger(val) || val < 1 || val > 50) {
      throw new Error("Limit must be an integer between 1 and 50");
    }
    return val;
  }
  if (typeof val === 'string') {
    if (!/^\d+$/.test(val)) {
      throw new Error("Limit must be an integer between 1 and 50");
    }
    const parsed = Number.parseInt(val, 10);
    if (parsed < 1 || parsed > 50) {
      throw new Error("Limit must be an integer between 1 and 50");
    }
    return parsed;
  }
  throw new Error("Limit must be an integer between 1 and 50");
}

export function parseCursor(cursorStr: string): { createdAt: string; id: string } {
  if (typeof cursorStr !== 'string') {
    throw new Error("Cursor must be a string");
  }

  // Strict base64url validation: only alphanumeric, '-' and '_' are allowed. No padding '='.
  if (!/^[A-Za-z0-9_-]+$/.test(cursorStr)) {
    throw new Error("Cursor must be a valid base64url string without padding");
  }

  let decoded: string;
  try {
    decoded = Buffer.from(cursorStr, 'base64url').toString('utf8');
  } catch {
    throw new Error("Cursor is not a valid base64url encoded string");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    throw new Error("Cursor decoded content is not valid JSON");
  }

  if (!isPlainObject(parsed)) {
    throw new Error("Cursor content must be a plain JSON object");
  }

  const keys = Object.keys(parsed);
  if (keys.length !== 2) {
    throw new Error("Cursor object must contain exactly two fields: createdAt and id");
  }

  if (!('createdAt' in parsed) || !('id' in parsed)) {
    throw new Error("Cursor object must contain exactly createdAt and id");
  }

  const { createdAt, id } = parsed;

  if (typeof createdAt !== 'string') {
    throw new Error("createdAt must be a string");
  }

  if (typeof id !== 'string') {
    throw new Error("id must be a string");
  }

  if (!uuidRegex.test(id)) {
    throw new Error("id must be a valid UUID");
  }

  if (!isValidISODate(createdAt)) {
    throw new Error("createdAt must be a valid ISO 8601 date string");
  }

  const normalizedCursor = {
    createdAt: new Date(createdAt).toISOString(),
    id: id.toLowerCase()
  };

  return Object.freeze(normalizedCursor);
}

export function serializeCursor(cursor: { createdAt: string; id: string }): string {
  if (!isPlainObject(cursor)) {
    throw new Error("Cursor must be a plain object");
  }

  const keys = Object.keys(cursor);
  if (keys.length !== 2) {
    throw new Error("Cursor object must contain exactly two fields: createdAt and id");
  }

  if (!('createdAt' in cursor) || !('id' in cursor)) {
    throw new Error("Cursor object must contain exactly createdAt and id");
  }

  const { createdAt, id } = cursor;

  if (typeof createdAt !== 'string' || !isValidISODate(createdAt)) {
    throw new Error("createdAt must be a valid ISO 8601 date string");
  }

  if (typeof id !== 'string' || !uuidRegex.test(id)) {
    throw new Error("id must be a valid UUID");
  }

  const normalized = {
    createdAt: new Date(createdAt).toISOString(),
    id: id.toLowerCase()
  };

  const jsonStr = JSON.stringify(normalized);
  return Buffer.from(jsonStr, 'utf8').toString('base64url');
}

export function parseExpertQuery(input: unknown): ParsedExpertQuery {
  if (input === undefined) {
    const res = { limit: 20 };
    return Object.freeze(res);
  }

  if (!isPlainObject(input)) {
    throw new Error("Query input must be a plain object");
  }

  const allowedKeys = new Set(['limit', 'cursor', 'q', 'country', 'organization', 'topic', 'language']);
  for (const key of Object.keys(input)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Extra key not allowed: ${key}`);
    }
  }

  const result: any = {};

  // Limit parsing
  if ('limit' in input) {
    result.limit = parseAndValidateLimit(input.limit);
  } else {
    result.limit = 20;
  }

  // Cursor parsing
  if ('cursor' in input && input.cursor !== undefined) {
    if (typeof input.cursor !== 'string') {
      throw new Error("Cursor must be a string");
    }
    result.cursor = parseCursor(input.cursor);
  }

  // Optional string parameters
  const stringFilters = ['q', 'country', 'organization', 'topic', 'language'] as const;
  for (const filter of stringFilters) {
    if (filter in input && input[filter] !== undefined) {
      if (typeof input[filter] !== 'string') {
        throw new Error(`Filter ${filter} must be a string`);
      }
      result[filter] = input[filter];
    }
  }

  return Object.freeze(result);
}
