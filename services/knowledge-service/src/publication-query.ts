const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BASE64URL_REGEX = /^[A-Za-z0-9_-]+$/;

export interface Cursor {
  readonly createdAt: string;
  readonly id: string;
}

export interface PublicationQuery {
  readonly limit: number;
  readonly q?: string;
  readonly country?: string;
  readonly organization?: string;
  readonly topic?: string;
  readonly language?: string;
  readonly year?: number;
  readonly cursor?: Cursor;
}

function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  for (const key of Object.keys(obj)) {
    const val = (obj as any)[key];
    if (val !== null && typeof val === 'object') {
      deepFreeze(val);
    }
  }
  return obj;
}

function parseLimit(value: unknown): number {
  if (value === undefined) {
    return 20;
  }
  let num: number;
  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    if (!/^\d+$/.test(value)) {
      throw new Error('Invalid limit: must be a positive integer string');
    }
    num = parseInt(value, 10);
  } else {
    throw new Error('Invalid limit: must be a number or string');
  }

  if (!Number.isInteger(num) || num < 1 || num > 50) {
    throw new Error('Invalid limit: must be an integer between 1 and 50');
  }
  return num;
}

function parseYear(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  let num: number;
  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    if (!/^\d+$/.test(value)) {
      throw new Error('Invalid year: must be a positive integer string');
    }
    num = parseInt(value, 10);
  } else {
    throw new Error('Invalid year: must be a number or string');
  }

  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(num) || num < 1000 || num > currentYear) {
    throw new Error(`Invalid year: must be an integer between 1000 and ${currentYear}`);
  }
  return num;
}

function parseStringParam(value: unknown, name: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${name}: must be a string`);
  }
  return value;
}

function validateCursorObject(obj: unknown): Cursor {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('Invalid cursor: must be an object');
  }

  const raw = obj as Record<string, unknown>;
  const keys = Object.keys(raw);
  if (keys.length !== 2) {
    throw new Error('Invalid cursor: must contain exactly createdAt and id');
  }
  if (!('createdAt' in raw) || !('id' in raw)) {
    throw new Error('Invalid cursor: missing required fields');
  }
  if (typeof raw.createdAt !== 'string' || typeof raw.id !== 'string') {
    throw new Error('Invalid cursor: fields must be strings');
  }
  if (!ISO_8601_REGEX.test(raw.createdAt)) {
    throw new Error('Invalid cursor: createdAt must be a valid ISO 8601 string');
  }

  const timestamp = Date.parse(raw.createdAt);
  if (Number.isNaN(timestamp)) {
    throw new Error('Invalid cursor: createdAt must be a valid ISO 8601 string');
  }

  // Validate real calendar date to avoid rollover (e.g. Feb 30 -> March 2)
  const dateMatch = raw.createdAt.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (dateMatch) {
    const y = parseInt(dateMatch[1], 10);
    const m = parseInt(dateMatch[2], 10) - 1;
    const d = parseInt(dateMatch[3], 10);
    const parsedDate = new Date(Date.UTC(y, m, d));
    if (
      parsedDate.getUTCFullYear() !== y ||
      parsedDate.getUTCMonth() !== m ||
      parsedDate.getUTCDate() !== d
    ) {
      throw new Error('Invalid cursor: createdAt is not a valid calendar date');
    }
  }

  if (!UUID_REGEX.test(raw.id)) {
    throw new Error('Invalid cursor: id must be a valid UUID');
  }

  return {
    createdAt: raw.createdAt,
    id: raw.id,
  };
}

export function decodeCursor(cursorStr: string): Cursor {
  if (typeof cursorStr !== 'string') {
    throw new Error('Invalid cursor: must be a string');
  }
  if (!BASE64URL_REGEX.test(cursorStr)) {
    throw new Error('Invalid cursor: not a valid base64url string');
  }

  let jsonStr: string;
  try {
    jsonStr = Buffer.from(cursorStr, 'base64url').toString('utf8');
  } catch {
    throw new Error('Invalid cursor: failed to decode base64url');
  }

  let obj: unknown;
  try {
    obj = JSON.parse(jsonStr);
  } catch {
    throw new Error('Invalid cursor: malformed JSON');
  }

  const validated = validateCursorObject(obj);
  return deepFreeze(validated);
}

export function encodeCursor(cursor: Cursor): string {
  if (!cursor || typeof cursor !== 'object') {
    throw new Error('Invalid cursor object');
  }
  if (typeof cursor.createdAt !== 'string' || typeof cursor.id !== 'string') {
    throw new Error('Invalid cursor fields: must be strings');
  }
  if (!ISO_8601_REGEX.test(cursor.createdAt)) {
    throw new Error('Invalid cursor field: createdAt must be a valid ISO 8601 string');
  }

  const timestamp = Date.parse(cursor.createdAt);
  if (Number.isNaN(timestamp)) {
    throw new Error('Invalid cursor field: createdAt must be a valid ISO 8601 string');
  }

  const dateMatch = cursor.createdAt.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (dateMatch) {
    const y = parseInt(dateMatch[1], 10);
    const m = parseInt(dateMatch[2], 10) - 1;
    const d = parseInt(dateMatch[3], 10);
    const parsedDate = new Date(Date.UTC(y, m, d));
    if (
      parsedDate.getUTCFullYear() !== y ||
      parsedDate.getUTCMonth() !== m ||
      parsedDate.getUTCDate() !== d
    ) {
      throw new Error('Invalid cursor field: createdAt is not a valid calendar date');
    }
  }

  if (!UUID_REGEX.test(cursor.id)) {
    throw new Error('Invalid cursor field: id must be a valid UUID');
  }
  const keys = Object.keys(cursor);
  if (keys.length !== 2) {
    throw new Error('Invalid cursor object: must contain exactly createdAt and id');
  }

  const jsonStr = JSON.stringify({
    createdAt: cursor.createdAt,
    id: cursor.id,
  });
  return Buffer.from(jsonStr, 'utf8').toString('base64url');
}

export function parsePublicationQuery(input: unknown): PublicationQuery {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Error('Invalid input: query must be an object');
  }

  const raw = input as Record<string, unknown>;

  const allowedKeys = new Set(['limit', 'q', 'country', 'organization', 'topic', 'language', 'year', 'cursor']);
  for (const key of Object.keys(raw)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Unknown query parameter: ${key}`);
    }
  }

  const limit = parseLimit(raw.limit);
  const q = parseStringParam(raw.q, 'q');
  const country = parseStringParam(raw.country, 'country');
  const organization = parseStringParam(raw.organization, 'organization');
  const topic = parseStringParam(raw.topic, 'topic');
  const language = parseStringParam(raw.language, 'language');
  const year = parseYear(raw.year);

  let cursor: Cursor | undefined;
  if (raw.cursor !== undefined && raw.cursor !== null) {
    if (typeof raw.cursor === 'string') {
      if (raw.cursor.trim() === '') {
        throw new Error('Invalid cursor: empty string');
      }
      cursor = decodeCursor(raw.cursor);
    } else if (typeof raw.cursor === 'object') {
      cursor = validateCursorObject(raw.cursor);
    } else {
      throw new Error('Invalid cursor: must be a string or Cursor object');
    }
  }

  const result: PublicationQuery = {
    limit,
    ...(q !== undefined && { q }),
    ...(country !== undefined && { country }),
    ...(organization !== undefined && { organization }),
    ...(topic !== undefined && { topic }),
    ...(language !== undefined && { language }),
    ...(year !== undefined && { year }),
    ...(cursor !== undefined && { cursor }),
  };

  return deepFreeze(result);
}
