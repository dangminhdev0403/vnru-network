# SCREEN OWNERSHIP MATRIX

| Access area | Role | Screen | Primary interaction | Next |
|---|---|---|---|---|
| Public | Visitor | `public/index.html` | Explore network | Search / Knowledge / Experts |
| Public | Visitor | `public/search/index.html` | Search/filter public data | Entity page |
| Public | Visitor | `public/knowledge/index.html` | Browse knowledge | Publication / related entity |
| Public | Visitor | `public/experts/index.html` | Browse experts | Expert detail |
| Auth | Unauthenticated | `auth/login.html` | Real login requires backend; demo role shortcuts are explicit | Role home |
| Workspace | Researcher | `workspace/researcher/index.html` | Prioritize personal research tasks | Collaboration |
| Workspace | Researcher | `workspace/researcher/collaboration/index.html` | Open opportunity/proposal | Proposal detail |
| Workspace | Researcher | `workspace/researcher/proposals/detail.html` | Follow paired proposal state | Project after decision |
| Workspace | Researcher | `workspace/researcher/projects/detail.html` | Track milestone/progress | Outputs/activity |
| Workspace | Reviewer | `workspace/reviewer/index.html` | Open assigned review | Review detail |
| Workspace | Reviewer | `workspace/reviewer/review-detail.html` | Score rubric locally in demo | Back to queue |
| Workspace | Organization | `workspace/organization/index.html` | View org-scoped tasks | Endorsements / Activities |
| Workspace | Organization | `workspace/organization/endorsements.html` | Confirm org participation locally in demo | Org overview |
| Workspace | Enterprise | `workspace/enterprise/index.html` | Manage need/cases | Technology |
| Workspace | Enterprise | `workspace/enterprise/technology/index.html` | Discover technology | Technology detail |
| Workspace | Enterprise | `workspace/enterprise/technology/detail.html` | Expression of interest demo | Collaboration / 2+2 |
| Workspace | Enterprise | `workspace/enterprise/consortium/2plus2.html` | Complete 4 consortium slots | Active collaboration |
| Workspace | Leadership | `workspace/leadership/index.html` | Inspect trends/signals | Reports |
| Workspace | Leadership | `workspace/leadership/reports.html` | Open internal report preview | Read only |
| Governance | Admin operator | `governance/index.html` | Enter governance capability | Access / Workflow / Audit |
| Governance | Admin operator | `governance/access/index.html` | Access governance demo | Governance |
| Governance | Admin operator | `governance/workflow/index.html` | Operational queues | Governance |
| Governance | Admin operator | `governance/audit/index.html` | Audit review | Governance |
