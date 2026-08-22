/**
 * Constant defining the visibility level for public items.
 */
export const PUBLIC_VISIBILITY = 'PUBLIC';

/**
 * Recursively sanitizes input filters by removing any 'visibility' key to prevent
 * caller-specified visibility bypasses/injections.
 */
function sanitizeFilters(filters: any): any {
  if (filters === null || filters === undefined) {
    return undefined;
  }

  if (Array.isArray(filters)) {
    return filters
      .map(item => sanitizeFilters(item))
      .filter(item => item !== undefined && item !== null && (typeof item !== 'object' || Object.keys(item).length > 0));
  }

  if (typeof filters === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (key.toLowerCase() === 'visibility') {
        continue;
      }
      const cleanValue = sanitizeFilters(value);
      if (cleanValue !== undefined) {
        clean[key] = cleanValue;
      }
    }
    return clean;
  }

  return filters;
}

/**
 * Builds a Prisma-compatible where object with visibility 'PUBLIC' conjoined before any other filters.
 * Any caller-supplied visibility query parameter or property is completely ignored and stripped.
 */
export function buildWhere(filters?: any): any {
  const clean = sanitizeFilters(filters);

  if (clean === undefined || clean === null) {
    return { visibility: PUBLIC_VISIBILITY };
  }

  if (Array.isArray(clean)) {
    return {
      AND: [
        { visibility: PUBLIC_VISIBILITY },
        ...clean
      ]
    };
  }

  if (typeof clean === 'object') {
    if (Object.keys(clean).length === 0) {
      return { visibility: PUBLIC_VISIBILITY };
    }
    // Flatten AND if it is already present at the top level
    if ('AND' in clean && Array.isArray(clean.AND)) {
      const rest = { ...clean };
      delete rest.AND;
      return {
        AND: [
          { visibility: PUBLIC_VISIBILITY },
          ...clean.AND
        ],
        ...rest
      };
    }

    // Otherwise conjoin
    return {
      AND: [
        { visibility: PUBLIC_VISIBILITY },
        clean
      ]
    };
  }

  return { visibility: PUBLIC_VISIBILITY };
}

// Alias to ensure all naming conventions are satisfied
export const buildPublicWhere = buildWhere;

/**
 * Projects a publication object to approved summary fields:
 * id, title, type, language, year, country, organizationRef, visibility.
 * If authors or topics are present, they are sanitized/projected too.
 * Excludes abstract and any internal/private keys (e.g. version, createdAt, updatedAt).
 */
export function projectSummary(pub: any): any {
  if (pub === null || pub === undefined) {
    return pub;
  }
  if (pub.visibility !== PUBLIC_VISIBILITY) {
    throw new Error('Only PUBLIC publications may be projected');
  }

  const summary: any = {};

  if ('id' in pub) summary.id = pub.id;
  if ('title' in pub) summary.title = pub.title;
  if ('type' in pub) summary.type = pub.type;
  if ('language' in pub) summary.language = pub.language;
  if ('year' in pub) summary.year = pub.year;
  if ('country' in pub) summary.country = pub.country;
  if ('organizationRef' in pub) summary.organizationRef = pub.organizationRef;

  // Enforce/retain PUBLIC visibility
  summary.visibility = PUBLIC_VISIBILITY;

  if ('authors' in pub && pub.authors !== undefined) {
    summary.authors = Array.isArray(pub.authors)
      ? pub.authors.map((a: any) => {
          if (a && typeof a === 'object') {
            const cleanAuthor: any = {};
            if ('id' in a) cleanAuthor.id = a.id;
            if ('expertRef' in a) cleanAuthor.expertRef = a.expertRef;
            if ('displayOrder' in a) cleanAuthor.displayOrder = a.displayOrder;
            return cleanAuthor;
          }
          return a;
        })
      : pub.authors;
  }

  if ('topics' in pub && pub.topics !== undefined) {
    summary.topics = Array.isArray(pub.topics)
      ? pub.topics.map((t: any) => {
          if (t && typeof t === 'object') {
            const cleanTopic: any = {};
            if ('publicationId' in t) cleanTopic.publicationId = t.publicationId;
            if ('topicId' in t) cleanTopic.topicId = t.topicId;
            if ('topic' in t && t.topic && typeof t.topic === 'object') {
              cleanTopic.topic = {};
              if ('id' in t.topic) cleanTopic.topic.id = t.topic.id;
              if ('slug' in t.topic) cleanTopic.topic.slug = t.topic.slug;
              if ('labels' in t.topic) cleanTopic.topic.labels = t.topic.labels;
            }
            return cleanTopic;
          }
          return t;
        })
      : pub.topics;
  }

  return summary;
}

// Alias for summary projection
export const projectPublicationSummary = projectSummary;

/**
 * Projects a publication object to approved detail fields:
 * id, title, abstract, type, language, year, country, organizationRef, visibility.
 * If authors or topics are present, they are sanitized/projected too.
 * Excludes any internal/private keys (e.g. version, createdAt, updatedAt).
 */
export function projectDetail(pub: any): any {
  if (pub === null || pub === undefined) {
    return pub;
  }
  if (pub.visibility !== PUBLIC_VISIBILITY) {
    throw new Error('Only PUBLIC publications may be projected');
  }

  const detail: any = {};

  if ('id' in pub) detail.id = pub.id;
  if ('title' in pub) detail.title = pub.title;
  if ('abstract' in pub) detail.abstract = pub.abstract;
  if ('type' in pub) detail.type = pub.type;
  if ('language' in pub) detail.language = pub.language;
  if ('year' in pub) detail.year = pub.year;
  if ('country' in pub) detail.country = pub.country;
  if ('organizationRef' in pub) detail.organizationRef = pub.organizationRef;

  // Enforce/retain PUBLIC visibility
  detail.visibility = PUBLIC_VISIBILITY;

  if ('authors' in pub && pub.authors !== undefined) {
    detail.authors = Array.isArray(pub.authors)
      ? pub.authors.map((a: any) => {
          if (a && typeof a === 'object') {
            const cleanAuthor: any = {};
            if ('id' in a) cleanAuthor.id = a.id;
            if ('expertRef' in a) cleanAuthor.expertRef = a.expertRef;
            if ('displayOrder' in a) cleanAuthor.displayOrder = a.displayOrder;
            return cleanAuthor;
          }
          return a;
        })
      : pub.authors;
  }

  if ('topics' in pub && pub.topics !== undefined) {
    detail.topics = Array.isArray(pub.topics)
      ? pub.topics.map((t: any) => {
          if (t && typeof t === 'object') {
            const cleanTopic: any = {};
            if ('publicationId' in t) cleanTopic.publicationId = t.publicationId;
            if ('topicId' in t) cleanTopic.topicId = t.topicId;
            if ('topic' in t && t.topic && typeof t.topic === 'object') {
              cleanTopic.topic = {};
              if ('id' in t.topic) cleanTopic.topic.id = t.topic.id;
              if ('slug' in t.topic) cleanTopic.topic.slug = t.topic.slug;
              if ('labels' in t.topic) cleanTopic.topic.labels = t.topic.labels;
            }
            return cleanTopic;
          }
          return t;
        })
      : pub.topics;
  }

  return detail;
}

// Alias for detail projection
export const projectPublicationDetail = projectDetail;
