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

`/workspace` reads the authenticated capability set. IAM administrators go to `/admin/access`; Researcher, Reviewer and Organization Representative may enter their clearly labeled UI previews; unsupported or future persona mappings fall back to `/account`. Legacy IAM routes redirect to their canonical Module 1 destinations.

Enterprise and Leadership pages remain authenticated UI previews only. `COLLABORATION_MANAGER` and `FOUNDATION_DECISION_MAKER` are not mapped to those future personas.

Public pages may communicate and demonstrate the broader VN–RU network vision with synthetic data. They must not present Module 2–6 business backends as available.

Backend authorization remains authoritative.
