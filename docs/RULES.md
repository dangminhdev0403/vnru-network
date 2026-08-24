# Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)

This document contains the authoritative governance, security, data-ownership, and development rules for the Russia-Vietnam Science-Technology Intelligence Network repository. All domain-specific rule files defer to this document.

## 1. Security & Authentication Boundaries

- **Backend Enforcement**: Security and authorization MUST be validated at every backend service boundary.
- **Frontend non-boundary**: Frontend visual controls, route guards, and hidden buttons are UI conveniences only, never security boundaries.
- **Secrets Management**: Hardcoding API keys, JWT secrets, passwords, or credentials in source code, default configs, or documentation is strictly forbidden. Use environment variables.

## 2. Data Ownership & Module Boundaries

- **Exclusive Ownership**: Every business state has exactly one owning domain module. No other module may directly mutate that state.
- **Isolated Persistence**: Process consolidation does not authorize cross-module persistence access. Each module uses its own repository/client and owned schema or database.
- **Contract-Based Integration**: Cross-module interaction uses explicit application contracts inside one deployable; cross-deployable interaction uses HTTP/REST or versioned events.
- **Transactional Integrity**: Transactions remain scoped to one owning module's persistence boundary. No distributed multi-database transactions.

## 3. Package & Dependency Governance

- **Explicit Approval Required**: Adding, upgrading, or removing packages in any `package.json` or lockfile requires explicit user approval before execution.
- **No Unapproved Packages**: Do not import or reference packages that are not present in `package.json`.

## 4. API & Resource Design

- **Bounded Collection Responses**: All list endpoints MUST enforce pagination boundaries (limit/cursor/offset) to prevent unbounded payload allocation.
- **Source of Truth**: PostgreSQL database stores serve as the primary source of truth. Redis caches must handle cache invalidation cleanly.

## 5. Working Tree & Scope Constraints

- **Preserve Unrelated Work**: Unrelated uncommitted edits, untracked files, or existing deleted files must remain untouched.
- **No Speculative Artifacts**: Do not generate unapproved documentation, code abstractions, or placeholder files outside assigned task boundaries.
- **No Financial Product Domain**: Funding, investment, budget, disbursement, payment, accounting, sponsorship, royalties, deal value, ROI, benefit-sharing calculations, and financial KPIs are outside the current product scope. Source research may mention them only as clearly labeled source or historical context.
- **Documentation Conflict Stop**: Active implementation-facing docs must agree on canonical routes and current-vs-future capability status. Reconcile conflicts before implementation.

## 6. Verification Request Dispatch & Browser Testing Policy

- **Code Completion -> Report Immediately**: When implementing features or fixing code, the agent runs the smallest reliable validation (lint/typecheck/focused tests) and reports results immediately. Never automatically start servers and launch Chrome DevTools MCP after code edits without user approval.
- **Propose Browser Testing**: If human-like interactive or rendered visual verification is beneficial, propose it in the completion report and wait for user instruction.
- **Pro-Max verification framework**: `docs/VERIFICATION_GUIDE.md` is the repository's Pro-Max verification guide. `Pro-Max` names the framework/guide itself; users do not need to append `pro-max` to a test command.
- **Selectable verification profiles**: When the user explicitly asks to test, verify, check, smoke-test, or validate a module/feature without naming a profile, the agent MUST first present the selector defined in `docs/VERIFICATION_GUIDE.md` and wait for the user's selection before executing verification.
- **Browser disclosure**: Every selector option MUST state explicitly whether it includes real browser interaction. A generic phrase such as “UI test” is not sufficient.
- **Named profile executes directly**: If the user explicitly requests `quick`, `integration`, `ui/browser`, `full/toàn diện`, or a custom scope, do not ask for profile selection again.
- **Full-profile browser requirement**: For a target with a web UI, the Full profile includes actual browser interaction through the configured Chrome DevTools MCP, including relevant user actions plus Network and Console inspection. Code inspection or manual clicking is not an equivalent substitute. If the MCP is unavailable, mark the browser gate `BLOCKED` rather than claiming a full PASS.
- **Verification before repair**: Verification is not permission to edit source. When a real source defect is found, report the failure, root cause, affected code, minimal proposed fix, and regression risk before changing source, unless the user has explicitly authorized repair in the same request.
- **Evidence over claims**: A full-module PASS MUST be supported by the gates required by the selected profile. Unit tests or build success alone cannot be reported as Full verification when runtime or browser evidence is required.

## 7. UI Quality & Impeccable Gate

- **Mandatory Anti-Pattern Check**: After modifying, updating, or creating any UI component, the Agent is required to manually run `npx impeccable detect` and automatically resolve all anti-patterns (font scale, contrast, explicit button types, reduced motion) before completing the task.
