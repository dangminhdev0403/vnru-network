# Portal Foundation Decisions

## Current product boundary

Only Identity/IAM and membership-application backend flows are implemented. Member discovery pages currently use synthetic display data; specialist workflow/persona pages are absent.

| Concern | Canonical route |
| --- | --- |
| Landing page | `/` |
| Public news stream | `/news` (`/explore` redirects here) |
| Member discovery | `/knowledge`, `/experts`, `/opportunities` |
| Login | `/login` |
| Membership application | `/register` |
| Member profile | `/account` |
| MFA and sessions | `/security` |
| Access administration | `/admin/access/*` |
| Security audit | `/admin/audit` |

## Access model

The product uses three understandable access classes, not a dashboard persona for each workflow role:

| Access class | Allowed product scope |
| --- | --- |
| Public visitor | News, events and approved public information |
| Registered member / expert | Public scope plus approved member knowledge, topic calls and scientific publications |
| Portal manager | Member scope plus portal-content management and aggregate site statistics |

`/workspace` is the single member area. Specialist persona/workflow routes are intentionally absent.

Portal manager and `SUPER_ADMIN` are different. Portal manager is a product responsibility. `SUPER_ADMIN` stays isolated in `/admin/access` and `/admin/audit` for IAM, security and audit only.

Synthetic display data may communicate the broader VN–RU network vision. It must not present absent business modules or persistence as available.

Backend authorization remains authoritative.
