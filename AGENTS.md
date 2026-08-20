# Agent Instructions — VN-RU Network

`AGENTS.md` is the repository entry point. Rules remain canonical in their existing docs; this file only routes agents to them.

## Mandatory pre-code gate

Before editing code, tests, config, schemas, migrations, or package files:

1. Read `docs/README.md`.
2. Read `docs/RULES.md` and `docs/ARCHITECTURE.md`.
3. Read the nearest scope instructions:
   - frontend: `frontend/AGENTS.md`, `frontend/docs/ARCHITECTURE.md`, `frontend/docs/RULES.md`;
   - backend: `services/AGENTS.md`, `services/docs/ARCHITECTURE.md`, `services/docs/RULES.md`.
4. Read only the task guide named by `docs/README.md` for that work type.
5. Inspect current source and package manifests. When docs describe a target not present in source, source/current manifests win; stop before inventing missing packages, paths, scripts, or infrastructure.

Do not edit until this gate is complete. In the final report, list `Docs read:` with the exact paths. Missing that list means the task is incomplete.

## Execution rules

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

UI is not considered verified merely because tests/build pass. For web UI work, final rendered-browser inspection through Chrome DevTools MCP is required by the skill. Browser screenshots are evidence, not decoration: the agent must visually inspect the rendered result after the final source change.

## Navigation

When `graphify-out/graph.json` exists: Graphify query/impact first, scoped Repomix second, exact source last. Otherwise use focused symbol/path search; never broad-scan by default.
