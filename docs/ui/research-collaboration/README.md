# Research Collaboration UI Reference

This folder contains **design references**, not production runtime pages.

The HTML files define visual hierarchy, layout, information grouping, interaction placement, and relationships between business surfaces. They intentionally do **not** perform business mutations. Any button marked with `data-integration-action` must be wired to a real repository/resource/hook/backend contract before becoming active in the Next.js runtime.

## Reference map

| Reference | Intended runtime surface | Feature owner | Integration status rule |
| --- | --- | --- | --- |
| `01-collaboration-hub.html` | `/workspace/collaboration` | `features/collaboration` | Compose only real queues/actions returned by supported contracts. |
| `02-opportunities.html` | `/workspace/collaboration/opportunities` | `features/collaboration` | Use real opportunity list/create/publish/close contracts. |
| `03-proposal-workspace.html` | `/workspace/collaboration/proposals/[id]` | `features/collaboration` | Implement only after proposal DTO/state is aligned 1:1 with backend. |
| `04-review-workspace.html` | `/workspace/collaboration/reviews/[id]` | `features/reviews` | Preserve anonymization and assignment scope; backend authorization is authoritative. |
| `05-collaboration-decision.html` | `/workspace/collaboration/decisions/[id]` or proposal-scoped decision route | `features/collaboration` | Do not create a decision queue/read page until a real read/list contract exists. |
| `06-project-workspace.html` | `/workspace/collaboration/projects/[id]` | `features/projects` | Use project/milestone/report contracts only; no invented state. |
| `07-knowledge-collaboration-bridges.html` | No standalone production route | `features/knowledge` + integration boundary | Integrate actions into Expert/Publication/Topic/Organization surfaces only when target collaboration actions exist. |

`index.html` is a design map only.

## Hard integration rules

1. **Do not copy mock/sample content into runtime data.** The generic names and values in these HTML files are illustrative only.
2. **Do not copy fake business interactions.** HTML buttons are visual references. A runtime action must follow `UI → hook/resource → repository/BFF → real backend → real success/error`.
3. **Do not invent API routes or response fields.** Inspect current controller/service/OpenAPI contract first.
4. **Capability checks control UX only.** Backend authorization remains the source of truth and must enforce context/scope.
5. **Keep Admin separate from business Workspace.** These collaboration/review/project surfaces belong under authenticated business workspace, not `/admin`.
6. **Use business names in UI.** Do not display internal numbered-module labels.
7. **Preserve the approved shared visual system.** Institutional light surface, graphite dark mode, blue primary interaction accent, restrained VN–RU network identity, subtle network motif.
8. **No financial workflow.** Do not add budgets, funding, sponsors, disbursement, investment, financial reports, or financial approval flows. This constraint belongs in implementation/design rules, not as repetitive end-user disclaimer text.
9. **No dead controls.** If the real mutation/read contract is absent, hide/disable the action or expose an explicit backend-gap state; never show a fake success.
10. **Implement standard states.** Loading, Empty, Error, 401, 403, 409, Validation Error, Success where applicable.

## Recommended integration order

```text
Opportunities real data flow
→ Proposal DTO/state alignment
→ Proposal detail/workspace
→ Reviewer assignment/detail
→ Collaboration decision
→ Project workspace
→ Knowledge/Expert bridges
```

Do not merge deeper surfaces simply because the design HTML exists. Runtime readiness is determined by verified routes, capabilities, context rules, and backend contracts.
