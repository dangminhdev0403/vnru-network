# VN-RU Architecture Hub

This folder is the entry point for architecture and task routing. Detailed rules remain in their owning scope; do not duplicate them here.

## Runtime model

The repository is a product workspace/monorepo, not one runtime layer:

- `frontend/`: Next.js web deployable and BFF.
- `services/auth-service/`: current NestJS API modular monolith; the legacy folder name avoids destructive runtime/deploy renames.
- PostgreSQL `auth_db`: one database owned exclusively by the API.
- HTTP `/api/v1`: frontend/backend integration seam.

## Read order

1. [`ARCHITECTURE.md`](ARCHITECTURE.md)
2. [`MODULE_MAP.md`](MODULE_MAP.md)
3. [`RULES.md`](RULES.md)
4. One task guide via [`GUIDES.md`](GUIDES.md)

Current source, manifests, schemas, migrations and tests override target-state prose. Do not load every Markdown file by default.

## Task routing

| Task | Required docs |
| --- | --- |
| Architecture or ownership | `ARCHITECTURE.md`, `MODULE_MAP.md`, `RULES.md` |
| Backend/API | `MODULE_MAP.md`, `../services/docs/ARCHITECTURE.md`, `../services/docs/RULES.md`, one backend guide |
| Frontend/UI | `MODULE_MAP.md`, `../frontend/docs/ARCHITECTURE.md`, `../frontend/docs/RULES.md`, one frontend guide |
| API contract | `../docs/API_SPEC.md`, `../frontend/docs/CONTRACT_GUIDE.md`, affected producer/consumer source |
| Deployment | `../docs/DEPLOYMENT.md`, current Compose/deploy scripts |
| Verification | `../docs/VERIFICATION_GUIDE.md` |

## Canonical detailed docs

- Global: [`../docs/README.md`](../docs/README.md)
- Frontend: [`../frontend/docs/ARCHITECTURE.md`](../frontend/docs/ARCHITECTURE.md)
- Backend: [`../services/docs/ARCHITECTURE.md`](../services/docs/ARCHITECTURE.md)
- API: [`../docs/API_SPEC.md`](../docs/API_SPEC.md)
- RBAC: [`../docs/RBAC_ARCHITECTURE.md`](../docs/RBAC_ARCHITECTURE.md)
