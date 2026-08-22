const ALLOWED_KEYS = new Set(['title', 'abstract', 'objectives', 'methodology', 'expectedOutcomes', 'keywords']);
const IDENTIFIER_KEYS = /(author|person|user|email|organization|institution|country|name|phone|address|affiliation)/i;
const MAX_STRING = 10_000;
const MAX_ARRAY = 50;

export function validateProposalSnapshot(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const snapshot = value as Record<string, unknown>;
  return Object.entries(snapshot).every(([key, field]) => {
    if (!ALLOWED_KEYS.has(key) || IDENTIFIER_KEYS.test(key)) return false;
    if (typeof field === 'string') return field.trim().length > 0 && field.length <= MAX_STRING;
    return Array.isArray(field) && field.length <= MAX_ARRAY
      && field.every((item) => typeof item === 'string' && item.trim().length > 0 && item.length <= 255);
  });
}
