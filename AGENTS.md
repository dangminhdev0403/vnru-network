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

## Navigation

When `graphify-out/graph.json` exists: Graphify query/impact first, scoped Repomix second, exact source last. Otherwise use focused symbol/path search; never broad-scan by default.
