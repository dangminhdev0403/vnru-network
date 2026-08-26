# Synthetic Display Data

Synthetic frontend data currently supports read-only discovery only:

- `frontend/features/workspace/mock-data/knowledge.ts`
- `frontend/features/workspace/mock-data/opportunities.ts`
- `frontend/features/public-discovery/mock-data.ts`

Rules:

1. Display data must never imply that a backend mutation succeeded.
2. Do not add proposal, review, endorsement, decision, project, report, notification, activity, or persona-workflow fixtures unless that product scope returns.
3. Keep identifiers stable for links and filters.
4. Include Vietnamese, English, and Russian copy where the consuming surface supports all three locales.
5. Do not include secrets, personal data, financial data, or production-looking unsupported metrics.
6. Replace synthetic data with content APIs when those APIs exist; do not build a fake backend.
