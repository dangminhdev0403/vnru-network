# Portal Foundation Decisions

## Current product boundary

Only the public landing page and Module 1 are implemented.

| Concern | Canonical route |
| --- | --- |
| Landing page | `/` |
| Login | `/login` |
| Member profile | `/account` |
| MFA and sessions | `/security` |
| Access administration | `/admin/access/*` |
| Security audit | `/admin/audit` |

`/workspace` redirects to `/account`. Legacy IAM routes redirect to their canonical Module 1 destinations.

The landing page may communicate the broader VN–RU network vision. It must not link to or present removed Module 2–6 runtime surfaces as available.

Backend authorization remains authoritative.
