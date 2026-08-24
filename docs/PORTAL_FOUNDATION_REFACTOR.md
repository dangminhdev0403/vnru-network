# Portal Foundation Decisions

## Current product boundary

Only Module 1 has an implemented backend runtime. Public discovery and role pages are synthetic UI previews.

| Concern | Canonical route |
| --- | --- |
| Landing page | `/` |
| Public discovery previews | `/knowledge`, `/experts`, `/opportunities` |
| Login | `/login` |
| Member profile | `/account` |
| MFA and sessions | `/security` |
| Access administration | `/admin/access/*` |
| Security audit | `/admin/audit` |

`/workspace` is the single landing and overview for every non-administrator business persona. Its navigation is composed from the authenticated capability set. Researcher, Reviewer, Organization Representative, Collaboration Manager and Foundation Decision Maker remain backend authorization roles, while their existing `/workspace/*` routes act as capability-gated task modules inside one product shell. Users with several roles see the union of their allowed modules without switching dashboard personas.

IAM administrators go to `/admin/access` and do not receive member-workspace navigation, even when their session also contains business capabilities.

`KNOWLEDGE_CURATOR` is not part of the current active role fixture set. Its former view-only permission set did not own a distinct workflow step.

Enterprise and Leadership pages remain authenticated UI previews only and are not live persona destinations.

Public pages may communicate and demonstrate the broader VN–RU network vision with synthetic data. They must not present Module 2–6 business backends as available. Role preview actions must remain clearly labeled as demo/local state and must not claim backend persistence.

Backend authorization remains authoritative.
