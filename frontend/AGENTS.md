<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:vnru-agent-routing -->
## VN-RU mandatory project instructions

Before frontend code changes, read in order:

1. `../Architecture/README.md`, `../Architecture/ARCHITECTURE.md`, `../Architecture/MODULE_MAP.md`, and `../Architecture/RULES.md`
2. `../docs/PORTAL_FOUNDATION_REFACTOR.md` for route, navigation, access-area, or capability-label work
3. `docs/ARCHITECTURE.md` and `docs/RULES.md`
4. One matching guide routed by `../Architecture/GUIDES.md`: `docs/MODULE_GUIDE.md`, `docs/CONTRACT_GUIDE.md`, or `docs/RUNTIME_UI_GUIDE.md`
   - Any browser API/server-state work must also read `docs/QUERY_RESOURCE_GUIDE.md`; do not handwrite query keys/cache or call APIs directly from components.
5. Relevant Next.js 16.3 documentation under `node_modules/next/dist/docs/`

Current `package.json` is capability truth. Do not use or document an uninstalled package as active. Final report must list exact docs read.
<!-- END:vnru-agent-routing -->
