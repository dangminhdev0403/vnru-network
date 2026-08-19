# Module 2 Knowledge & Expert Discovery — AGY Assignment Plan

> **For Hermes:** Planning only. User approval authorizes only the named implementation waves. Host owns Git, tests, integration, deployment, and final verification. AGY writes code only inside bounded worktrees.

**Goal:** Deliver public publication/expert discovery with linked topics, organizations, explainable partner suggestions, bounded search, and zero unpublished-data leakage.

**Architecture:** Keep the documented ownership split: `knowledge-service` owns publications/topics; `organization-service` owns organizations/expert profiles/match signals. PostgreSQL is the source of truth. For the dev baseline, prefer PostgreSQL native text search, deterministic topic-overlap matching, and HTTP cache headers; do not add Elasticsearch/OpenSearch, graph DB, Kafka, Redis, ORCID, Scopus, vector embeddings, or a generic recommendation framework before measured need and OPEN-04 resolution.

**Current baseline:** Only `auth-service` exists. Module 2 service directories, schemas, contracts, and routes do not exist. The repository is dirty; no worktree, writer, package install, commit, or deployment starts until the host creates an approved clean checkpoint.

---

## Scope boundary

### In MVP

- Public-only publication list/detail.
- Public-only expert list/detail.
- Linked topics, author references, and organization references.
- One integrated frontend search surface covering publications and experts.
- Filters: object type, country, organization, topic, language, year where applicable.
- Stable cursor pagination with bounded `limit`.
- Exact public-scope filtering at every query boundary.
- Explainable expert suggestions from shared topics/expertise.
- Optimistic version field for future edits; no edit endpoint before governance approval.
- Synthetic dev fixtures proving VN/RU, published/unpublished, filter, cursor, and matching behavior.

### Explicitly skipped

- Patents/proceedings/document upload until publication flow is stable.
- ORCID/Scopus synchronization and review queue.
- Elasticsearch/OpenSearch, semantic vectors, graph DB.
- Kafka/outbox, Redis, background worker platform.
- Admin CRUD, moderation UI, self-publishing.
- Generic API Gateway.
- Generic recommendation engine or percentage score.

Add each only when its acceptance path and owner are approved.

---

## Decision Gate 0 — stakeholder input required

No schema/state-machine writer starts until these are recorded in `docs/OPEN_QUESTIONS.md`.

### OPEN-03: moderation governance

Minimum decisions:

1. Who may create/edit own expert profile?
2. Who may submit/edit publication metadata?
3. Who may publish/unpublish?
4. Is institutional moderation required?
5. Can external sync publish directly, or only create review candidates?

**Safe default if stakeholders intentionally defer:** MVP exposes no write/publish HTTP endpoints. Host imports synthetic fixtures directly for dev. Public APIs return only records explicitly marked public in fixtures. This avoids inventing governance.

### OPEN-04: search/matching mechanism

Recommended dev decision:

- PostgreSQL native full-text/trigram search.
- Deterministic matching by shared topic/expertise IDs.
- Upgrade only after measured scale/quality thresholds.

Proposed upgrade triggers:

- p95 search latency > 300 ms at representative volume;
- native ranking fails agreed relevance fixtures;
- semantic recall becomes an explicit acceptance criterion;
- independent index scaling is operationally justified.

**Package consequence:** PostgreSQL-native MVP should need no search, cache, queue, graph, or vector package.

---

## AGY ownership

| Lane | Primary ownership | Writable scope | Review duty |
|---|---|---|---|
| **AGY-01** | `knowledge-service` | Publications, topics, repository search | Review expert cross-reference contract |
| **AGY-02** | `organization-service` | Organizations, expert profiles, matches | Review publication author/topic contract |
| **AGY-03** | Frontend/BFF | Public routes, integrated search UI, i18n | Review public-data projection only |
| **AGY-04** | Security/closure | Read-only review by default | Scope leakage, pagination, contract, performance gates |

**Writer rule:** one writer per worktree. AGY-01 and AGY-02 may run concurrently only after Gate 0 because their files, databases, package manifests, and migrations are disjoint. AGY-03 starts after both public contracts stabilize. AGY-04 writes only for a concrete verified defect.

---

## Wave 0 — host baseline and contracts

**Owner:** Hermes/host. No AGY writer.

1. Resolve or explicitly defer OPEN-03 and approve the PostgreSQL-native OPEN-04 dev baseline.
2. Review Module 1 dirty tree; create one approved checkpoint before Module 2 worktrees.
3. Record exact base SHA and require passing Module 1 gates.
4. Define public DTOs before implementation:
   - `PublicationSummary`, `PublicationDetail`;
   - `ExpertSummary`, `ExpertDetail`;
   - `MatchReason`;
   - `CursorPage<T>`;
   - filter/query limits.
5. Keep cross-service references as immutable strings. No cross-service foreign keys or DB access.
6. Approve dependency manifests separately if new Nest service scaffolds need packages. Reuse the existing Nest/Prisma/Zod versions; do not add infrastructure libraries.
7. Generate one bounded Graphify/Repomix pack per AGY lane.

**Stop:** dirty uncheckpointed baseline, unresolved write governance with requested write endpoints, package surprise, shared database proposal, or whole-repository writer scope.

---

## Wave 1 — source-of-truth service foundations

### AGY-01 — Slice 1A: publication read model

**Branch:** `feat/m2-knowledge-foundation`

**Observable result:** `knowledge-service` boots against its own PostgreSQL database and returns only public publication fixtures through bounded list/detail APIs.

**Minimum owned models:**

- `Publication`: id, title, abstract, type, language, year, country, organizationRef, visibility, version, createdAt, updatedAt.
- `KnowledgeTopic`: id, slug, localized labels.
- `PublicationTopic`: unique publication/topic link.
- `PublicationAuthorRef`: publicationId, expertRef, display order.
- `ExternalRecordIdentity`: source + externalId or DOI uniqueness, only if ingestion is approved in this wave.

Prefer DB uniqueness and indexes. Do not copy expert or organization profiles.

**Public routes:**

- `GET /api/v1/publications?limit=&cursor=&q=&country=&organization=&topic=&language=&year=`
- `GET /api/v1/publications/:id`

**Required tests:**

- unpublished record never appears by ID, query, or filter;
- `limit` bounded; malformed cursor rejected;
- cursor deterministic under equal timestamps;
- topic/author/org refs returned without cross-service joins;
- duplicate DOI/external identity rejected when that model is included.

**Gate:** targeted tests, migration from empty DB, seed twice without duplicate business keys, build, non-mutating lint, startup smoke.

### AGY-02 — Slice 1B: organization/expert read model

**Branch:** `feat/m2-expert-foundation`

**Observable result:** `organization-service` boots against its own PostgreSQL database and returns only public organization/expert fixtures through bounded list/detail APIs.

**Minimum owned models:**

- `Organization`: id, name, country, public status.
- `ResearcherProfile`: id, userRef?, display name, bio, country, organizationId, visibility, version.
- `ExpertiseArea`: id, slug, localized labels.
- `ResearcherExpertise`: unique profile/expertise link.
- `MatchSignal`: omit initially; derive matches from expertise links unless persistence is proven necessary.

**Public routes:**

- `GET /api/v1/organizations?limit=&cursor=&country=`
- `GET /api/v1/experts?limit=&cursor=&q=&country=&organization=&topic=&language=`
- `GET /api/v1/experts/:id`
- `GET /api/v1/experts/:id/matches?limit=`

**Matching baseline:** rank by shared expertise count, then stable expert ID; return reason labels/IDs, never an invented confidence percentage.

**Required tests:**

- private profile absent from list/detail/matches;
- self excluded from matches;
- deterministic ranking and explanation;
- organization filter isolated;
- bounded cursor pagination.

**Gate:** same as AGY-01.

### Wave 1 integration gate

Host verifies real diffs, migrations, seed idempotency, independent databases, no cross-service repository import, no package drift. Merge sequentially after both branches rebase on the same accepted baseline and pass full service gates.

---

## Wave 2 — search and relationship closure

### AGY-01 — Slice 2A: native publication search

**Observable result:** PostgreSQL-native keyword search handles title/abstract/topic labels with public-scope predicates inside the query, not after pagination.

**Constraints:**

- no external search engine;
- no N+1 detail hydration in list queries;
- public scope is part of SQL/Prisma filtering;
- index only fields actually queried;
- one latency smoke against representative synthetic volume.

**Check:** relevance fixtures, filters combined with cursor, hidden-row leakage test, explain query plan/index use where practical.

### AGY-02 — Slice 2B: publication references in expert detail

**Observable result:** expert detail contains bounded publication references without direct access to `knowledge-service` DB.

**Lazy contract:** keep `publicationIds`/author references owned by `knowledge-service`; frontend/BFF fetches publication summaries in one bounded request. Do not add event replication until latency proves this insufficient.

**Check:** missing/down knowledge service does not expose stale/private data; expert core detail remains usable.

### Wave 2 integration gate

Reassess conflict matrix. AGY-01/02 may remain parallel only with disjoint paths. Host measures query count and verifies no cross-service DB link.

---

## Wave 3 — AGY-03 frontend/BFF

**Branch:** `feat/m2-public-discovery-ui`

**Observable result:** unauthenticated visitors can browse/search public publications and experts from one UI.

**Routes:**

- `/knowledge`
- `/publications/[id]`
- `/experts`
- `/experts/[id]`
- `/search`

Do not add `/matches` unless product needs a standalone page; expert-detail suggestions already cover the acceptance criterion.

**Files:** exact paths chosen after backend contracts merge. Expected bounded scope per slice:

- one feature client per backend;
- one BFF route group or server helper per backend;
- route page + smallest client component;
- existing VI/EN/RU translation store;
- one focused Node test per vertical slice.

**Slices:**

1. Publication list/detail.
2. Expert list/detail/match reasons.
3. Integrated search tabs/filters using two bounded backend calls.

**Rules:**

- server fetch for initial public content;
- native URL search params for filters/cursor;
- no new state library or UI library;
- semantic HTML, keyboard labels, loading/error/empty states;
- do not expose unpublished data even if backend regresses: frontend hides nothing as a security boundary, but tests assert the backend contract.

**Gate:** focused tests, ESLint, TypeScript/Next build, desktop/mobile Chrome check, console/network clean, anonymous access proven.

---

## Wave 4 — AGY-04 closure review

Read-only lanes run in parallel:

1. **Data ownership:** independent DBs, immutable cross-service refs, migration/uniqueness/index review.
2. **Security:** public predicate at query boundary; ID enumeration, filters, matches, and BFF cannot leak private records.
3. **Search/performance:** cursor stability, query bounds, no N+1, representative latency evidence.
4. **Contract/UI:** DTO parity, VI/EN/RU, accessibility, error/empty states, public navigation.

A writer opens only for one verified defect, maximum 8 files, one focused RED/GREEN check.

Host final gates:

```bash
# each backend service
pnpm test -- --runInBand
pnpm test:e2e -- --runInBand
pnpm build
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
pnpm exec prisma migrate status

# frontend
node <module-2-focused-tests>
pnpm exec eslint app features proxy.ts
pnpm build

# repository
git diff --check -- services/knowledge-service services/organization-service frontend
graphify update .
```

Completion also requires empty-database migration chain, idempotent seed proof, runtime HTTP smokes, Chrome desktop/mobile verification, bounded Repomix packs newer than changed source.

---

## Dependency graph

```text
Gate 0 decisions + clean baseline
├── AGY-01 knowledge foundation ── native publication search ─┐
├── AGY-02 expert foundation ───── explainable matching ──────┤
└── shared DTO decisions (host, no package) ──────────────────┘
                                                              ↓
                                                  AGY-03 public UI/BFF
                                                              ↓
                                                  AGY-04 closure review
```

---

## Dispatch contract for every AGY writer

- Canonical absolute worktree path and exact base SHA.
- One observable slice only.
- Maximum 8 allowed files; explicit list from Graphify.
- One bounded Repomix pack, normally 6k–12k tokens.
- Focused RED/GREEN test; host reruns all claims.
- No repository rediscovery, broad formatting, dependency install, package/lock change beyond approved slice, Graphify refresh, commit, push, PR, merge, deploy, shared DB access, or sibling repository edits.
- `BLOCKED` on scope growth, package surprise, contract ambiguity, OPEN-03/04 conflict, dirty collision, migration ambiguity, quota/auth failure, or missing runtime.
- Return only status, actual paths changed, test command/result, residual blocker.

---

## Definition of done

- Official public publication records linked to topics, author refs, and organization refs.
- Public expert profiles linked to expertise, organization, publication refs.
- Explainable partner suggestions; no opaque percentage.
- Keyword/filter search and stable cursor pagination.
- Hidden/private records inaccessible through list, detail, search, match, and BFF paths.
- Anonymous discovery works without login.
- Public cache headers may be used; no permission-sensitive caching.
- Representative latency measured; no external search infrastructure without trigger evidence.
- Every service owns its DB and migration chain.
- Full gates, runtime smokes, browser verification, graph/pack refresh pass.

## Approval boundary

This artifact is planning only. No dependency install, service scaffold, worktree, AGY writer, database creation, commit, push, PR, merge, or deployment is authorized until the user approves execution and resolves/accepts the defaults for OPEN-03 and OPEN-04.

## Docs read

- `docs/README.md`
- `docs/RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/API_SPEC.md`
- `docs/DOMAIN_MAP.md`
- `docs/RBAC_ARCHITECTURE.md`
- `docs/OPEN_QUESTIONS.md`
- `services/docs/ARCHITECTURE.md`
- `services/docs/RULES.md`
- `services/docs/SERVICE_GUIDE.md`
- `frontend/docs/ARCHITECTURE.md`
- `frontend/docs/RULES.md`
- `frontend/docs/MODULE_GUIDE.md`
- `VN-RU_Portal_Architecture_Business_Analysis_UPDATED_FINAL_EN.md` Module 2
- `.hermes/plans/2026-08-18_005815-module-1-agy-assignment.md`
- `services/auth-service/package.json`
- `services/auth-service/prisma/schema.prisma`
- `frontend/package.json`
