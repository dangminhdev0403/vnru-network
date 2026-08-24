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

`/workspace` reads the authenticated capability set. IAM administrators go to `/admin/access`. Current role previews resolve as follows:

- Researcher -> `/workspace/researcher`;
- Reviewer -> `/workspace/reviewer`;
- Organization Representative -> `/workspace/organization`;
- Collaboration Manager -> `/workspace/collaboration`;
- Foundation Decision Maker -> `/workspace/decisions` with neutral user-facing decision terminology.

`KNOWLEDGE_CURATOR` is not part of the current active role fixture set. Its former view-only permission set did not own a distinct workflow step.

Enterprise and Leadership pages remain authenticated UI previews only and are not live persona destinations.

Public pages may communicate and demonstrate the broader VN–RU network vision with synthetic data. They must not present Module 2–6 business backends as available. Role preview actions must remain clearly labeled as demo/local state and must not claim backend persistence.

Backend authorization remains authoritative.
