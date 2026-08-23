const ALLOWED_KEYS = new Set(['title', 'abstract', 'objectives', 'methodology', 'expectedOutcomes', 'keywords']);
const IDENTIFIER_KEYS = /(author|person|user|email|organization|institution|country|name|phone|address|affiliation|contact|lead|participant)/i;
const MAX_STRING = 10_000;
const MAX_ARRAY = 50;

const EMAIL_REGEX = /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g;
const UUID_REGEX = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const ORG_REF_REGEX = /\bORG_[A-Z0-9_]+\b/gi;

const EMAIL_CHECK = /[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}/i;
const UUID_CHECK = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const ORG_REF_CHECK = /ORG_[A-Z0-9_]+/i;

export function sanitizeText(text: string, forbiddenIdentifiers: string[] = []): string {
  if (!text || typeof text !== 'string') return '';
  let result = text.replace(EMAIL_REGEX, '[ANONYMIZED_EMAIL]').replace(UUID_REGEX, '[ANONYMIZED_ID]').replace(ORG_REF_REGEX, '[ANONYMIZED_ORG]');
  for (const ident of forbiddenIdentifiers) {
    if (ident && ident.trim().length > 1) {
      const escaped = ident.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
      result = result.replace(new RegExp(escaped, 'gi'), '[ANONYMIZED]');
    }
  }
  return result.trim();
}

export function buildSanitizedSnapshot(
  proposal: {
    content: string;
    opportunity?: { title?: string; description?: string | null };
    participants?: Array<{ userId: string; organizationRef: string }>;
  },
): Record<string, string | string[]> {
  const forbidden = (proposal.participants || []).flatMap((p) => [p.userId, p.organizationRef]).filter(Boolean);

  let title = proposal.opportunity?.title || 'Joint Research Proposal';
  let abstract = proposal.opportunity?.description || 'Research proposal details';
  const structuredFields: Record<string, string | string[]> = {};

  const trimmedContent = (proposal.content || '').trim();
  let parsedJson = false;

  if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmedContent);
      parsedJson = true;
      if (parsed && typeof parsed === 'object') {
        if (!Array.isArray(parsed)) {
          // JSON Object
          for (const [key, val] of Object.entries(parsed)) {
            if (!ALLOWED_KEYS.has(key) || IDENTIFIER_KEYS.test(key)) continue;
            if (typeof val === 'string') {
              const sanitized = sanitizeText(val, forbidden);
              if (sanitized) structuredFields[key] = sanitized;
            } else if (Array.isArray(val)) {
              const sanitizedArray = val
                .filter((item): item is string => typeof item === 'string')
                .map((item) => sanitizeText(item, forbidden))
                .filter(Boolean);
              if (sanitizedArray.length > 0) structuredFields[key] = sanitizedArray.slice(0, MAX_ARRAY);
            }
          }
        } else {
          // JSON Array
          for (const item of parsed) {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
              for (const [key, val] of Object.entries(item)) {
                if (!ALLOWED_KEYS.has(key) || IDENTIFIER_KEYS.test(key)) continue;
                if (typeof val === 'string') {
                  const sanitized = sanitizeText(val, forbidden);
                  if (sanitized && !structuredFields[key]) structuredFields[key] = sanitized;
                }
              }
            }
          }
        }

        if (typeof structuredFields.title === 'string' && structuredFields.title.trim()) {
          title = structuredFields.title;
        }
        if (typeof structuredFields.abstract === 'string' && structuredFields.abstract.trim()) {
          abstract = structuredFields.abstract;
        }
      }
    } catch {
      // Content started with { or [ but failed to parse - treat as invalid JSON and never use as raw abstract
      parsedJson = true;
    }
  }

  // If content was not JSON, it was plain text proposal content
  if (!parsedJson && trimmedContent.length > 0) {
    abstract = trimmedContent;
  }

  const sanitizedSnapshot: Record<string, string | string[]> = {
    ...structuredFields,
    title: sanitizeText(title, forbidden) || 'Joint Research Proposal',
    abstract: sanitizeText(abstract, forbidden) || 'Research proposal details',
  };

  return sanitizedSnapshot;
}

export function validateProposalSnapshot(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const snapshot = value as Record<string, unknown>;
  const entries = Object.entries(snapshot);
  if (entries.length === 0) return false;

  if (typeof snapshot.title !== 'string' || !snapshot.title.trim()) return false;
  if (typeof snapshot.abstract !== 'string' || !snapshot.abstract.trim()) return false;

  return entries.every(([key, field]) => {
    if (!ALLOWED_KEYS.has(key) || IDENTIFIER_KEYS.test(key)) return false;
    if (typeof field === 'string') {
      const trimmed = field.trim();
      if (trimmed.length === 0 || trimmed.length > MAX_STRING) return false;
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) return false;
      if (EMAIL_CHECK.test(trimmed) || UUID_CHECK.test(trimmed) || ORG_REF_CHECK.test(trimmed)) return false;
      return true;
    }
    return Array.isArray(field) && field.length <= MAX_ARRAY
      && field.every((item) => typeof item === 'string' && item.trim().length > 0 && item.length <= 255
        && !item.trim().startsWith('{') && !item.trim().startsWith('[')
        && !EMAIL_CHECK.test(item) && !UUID_CHECK.test(item) && !ORG_REF_CHECK.test(item));
  });
}
