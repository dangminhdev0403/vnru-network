# Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network

`AGENTS.md` is the repository entry point. Rules remain canonical in their existing docs; this file only routes agents to them.

## Mandatory pre-code gate

Before editing code, tests, config, schemas, migrations, or package files:

1. Read `Architecture/README.md`.
2. Read `Architecture/ARCHITECTURE.md`, `Architecture/MODULE_MAP.md`, and `Architecture/RULES.md`.
3. Use `Architecture/GUIDES.md` to open only the task-specific guide.
4. For Portal routes, navigation, access areas, or capability terminology, read `docs/PORTAL_FOUNDATION_REFACTOR.md`.
5. Read the nearest scope instructions:
   - frontend: `frontend/AGENTS.md`, `frontend/docs/ARCHITECTURE.md`, `frontend/docs/RULES.md`;
   - backend: `services/AGENTS.md`, `services/docs/ARCHITECTURE.md`, `services/docs/RULES.md`.
6. Inspect current source and package manifests. When docs describe a target not present in source, source/current manifests win; stop before inventing missing packages, paths, scripts, or infrastructure.

Do not edit until this gate is complete. In the final report, list `Docs read:` with the exact paths. Missing that list means the task is incomplete.

## Execution rules

- Local development uses the existing `postgres-local` Docker container and its `vnru_auth_local` database. Do not create another project PostgreSQL container or volume for dev. Do not infer or change VPS database policy from this local rule.
- **Ponytail full is always active**, including corrective runs: understand the flow first; then stop at the first sufficient rung: delete/skip, reuse existing code, standard library, native platform, installed dependency, one line, minimum new code.
- Preserve unrelated dirty/untracked work. Never reset, checkout, overwrite, or delete it.
- No dependency, `package.json`, or lockfile change without explicit approval.
- Fix the shared root cause; inspect every caller of a changed shared symbol. Never patch only the reported symptom.
- Use the smallest working diff. No speculative services, packages, interfaces, factories, configuration, boilerplate, scaffolding, or docs.
- Never simplify security, trust-boundary validation, data-loss prevention, or accessibility.
- Non-trivial logic requires one smallest runnable check. Never claim an unrun command passed.
- Mark a deliberate ceiling only when real: `ponytail: <ceiling>; upgrade when <measured condition>`.
- Backend authorization is authoritative; frontend visibility is not a security boundary.

## Mandatory UI/UX quality routing

For any task whose primary intent is UI inspection, UI repair, visual polish, responsive stabilization, UX review, typography/icon/layout correction, redesign of an existing surface, or rendered-browser quality, load and follow:

- `.agents/skills/ui-quality-promax/SKILL.md`

The UI Quality Pro-Max skill is mandatory even when the user does not name it explicitly. Natural-language requests such as `soi lại giao diện`, `fix UI`, `fix UX`, `polish`, `responsive`, `review UX`, `ổn định giao diện`, `soi và fix toàn bộ UI/UX`, or `kiểm tra giao diện` trigger it.

For every UI creation, modification, or review task, also load and follow `.agents/skills/design-dna/SKILL.md`. This applies to typography, spacing, color, components, layout, responsive behavior, motion, accessibility, loading/error/empty states, and visual stability. Skip Design DNA only when the task has no rendered UI effect.

### Default UI scope

When a UI/UX request is generic and does **not** explicitly name a module, route, page, or component, treat the target as the **complete currently implemented frontend product**, not Module 01 or any single workspace.

The agent must discover the actual current surfaces and include, where implemented:

- public/landing/discovery;
- login/auth transitions where visually relevant;
- authenticated workspace shell;
- all implemented module workspaces;
- governance/admin;
- security/session;
- shared navigation/layout/typography/icons/forms/tables/dialogs/states.

Before editing, show a concise discovered surface manifest. Do not silently narrow a generic UI request to one module because that module was discussed previously.

If the user explicitly scopes the request to a module/page/component, follow that narrower scope plus directly affected shared-shell neighbors.

When present locally, the following taste skills may be consulted as supporting design heuristics as directed by UI Quality Pro-Max:

- `.agents/skills/design-taste-frontend/`
- `.agents/skills/design-taste-frontend-v1/`
- `.agents/skills/high-end-visual-design/`
- `.agents/skills/redesign-existing-projects/`
- `.agents/skills/stitch-design-taste/`

UI is validated by code checks and static gates during development. For web UI work, real rendered-browser inspection (via Chrome DevTools MCP) is on-demand: after completing code edits and standard validation, the agent must report immediately. Do NOT automatically launch Chrome without approval; propose browser testing to the user if interactive or visual verification is recommended.

## Browser Verification Policy (On-Demand / Proposal-First)

- **Code Done -> Report Immediately**: After code edits or UI adjustments, run the smallest reliable validation (e.g. lint, typecheck, or focused tests) and immediately return the report of changed files and results.
- **No Automatic Chrome Launch**: Do not automatically start dev servers and launch Chrome DevTools MCP after editing code unless explicitly requested by the user in the prompt (e.g., `test browser`, `mở chrome test`).
- **Propose When Needed**: If human-like interactive or visual verification is needed, explicitly propose it in the completion report (e.g., "Bạn có muốn mở Chrome để test tương tác thực tế luồng này không?") and wait for user confirmation.

## UI Quality & Impeccable Gate

- After modifying, updating, or creating any UI component, the Agent is required to manually run `npx impeccable detect` and automatically resolve all anti-patterns (font scale, contrast, explicit button types, reduced motion) before completing the task.

## Local test accounts

- `secrets/account.json` is the ignored, local source of truth for test login accounts. Read it at test time; each entry's `role` identifies the corresponding test persona. Never copy usernames/passwords into source, docs, plans, prompts, logs, screenshots, commits, or final reports.
- Select an account by exact `environment` and `role`; use its `loginUrl` and `realm`. Nested entries inherit the surrounding environment/login context. If the requested role is absent, report it instead of reusing a broader role or inventing credentials.
- Missing login identity: add it to the ignored runtime account config and provision its application identity through the existing demo seed. Missing application role/context: assign it through the canonical IAM Administration surface/API (`/admin/access`, `POST /api/v1/admin/role-assignments`) using an authorized administrator. Never grant `SUPER_ADMIN` as a substitute; the API intentionally forbids assigning it.
- Keep `secrets/account.json` ignored and local. Do not edit, delete, rotate, or expose existing accounts without explicit approval.

## Navigation

When `graphify-out/graph.json` exists: Graphify query/impact first, scoped Repomix second, exact source last. Otherwise use focused symbol/path search; never broad-scan by default.

## AGY / Ponytail execution policy

- `PONYTAIL.md` is mandatory for every coding agent and corrective run. Read it before editing; Ponytail `full` remains active unless the user explicitly disables it.
- AGY runs exactly one focused check covering its changed behavior. AGY must not run full lint, the full test suite, or a full build.
- Host verification runs each slice's targeted gate in parallel.
- Integration cherry-picks accepted slices without rerunning module-wide gates after every commit.
- After all slices integrate, run affected/module lint, tests, and build once via the orchestrator final gate. Run the full merge gate once before PR/merge when required.
- Never skip trust-boundary validation, security, accessibility, or data-loss prevention to save time.
- Preserve unrelated dirty/untracked work. Dependency, lockfile, migration, destructive, deploy, and production changes remain approval-gated.
