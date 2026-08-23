const ALLOWED_KEYS = new Set(['title', 'abstract', 'objectives', 'methodology', 'expectedOutcomes', 'keywords']);
const IDENTIFIER_KEYS = /(author|person|user|email|organization|institution|country|name|phone|address|affiliation)/i;
const MAX_STRING = 10_000;
const MAX_ARRAY = 50;

const EMAIL_REGEX = /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g;
const UUID_REGEX = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const ORG_REF_REGEX = /\bORG_[A-Z0-9_]+\b/gi;

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
): Record<string, string> {
  const forbidden = (proposal.participants || []).flatMap((p) => [p.userId, p.organizationRef]).filter(Boolean);

  let title = proposal.opportunity?.title || 'Joint Research Proposal';
  let abstract = proposal.content || '';

  try {
    const parsed = JSON.parse(proposal.content);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      if (typeof parsed.title === 'string' && parsed.title.trim()) title = parsed.title;
      if (typeof parsed.abstract === 'string' && parsed.abstract.trim()) abstract = parsed.abstract;
    }
  } catch {
    // plain string content
  }

  const sanitizedSnapshot: Record<string, string> = {
    title: sanitizeText(title, forbidden) || 'Joint Research Proposal',
    abstract: sanitizeText(abstract, forbidden) || 'Research plan content',
  };

  return sanitizedSnapshot;
}

export function validateProposalSnapshot(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const snapshot = value as Record<string, unknown>;
  const entries = Object.entries(snapshot);
  if (entries.length === 0) return false;

  return entries.every(([key, field]) => {
    if (!ALLOWED_KEYS.has(key) || IDENTIFIER_KEYS.test(key)) return false;
    if (typeof field === 'string') {
      const trimmed = field.trim();
      return trimmed.length > 0 && trimmed.length <= MAX_STRING;
    }
    return Array.isArray(field) && field.length <= MAX_ARRAY
      && field.every((item) => typeof item === 'string' && item.trim().length > 0 && item.length <= 255);
  });
}
