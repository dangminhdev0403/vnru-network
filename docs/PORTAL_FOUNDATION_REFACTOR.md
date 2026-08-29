# Portal Foundation Decisions

## Public content source and structure

`vn-ru-portal/RVSTIN/` is the current official content handoff. Its folder model is:

- `Dev_Phân Tích Nghiệp Vụ trước khi triển khai/`: business-analysis source, not a page;
- `Giới thiệu/`: `/about`;
- `Hệ sinh thái/`: `/ecosystem`;
- `Tin tức/`: `/news` and `/news/[id]`;
- `Liên hệ/`: `/contact`.

Public navigation is `/`, `/about`, `/ecosystem`, `/news`, `/contact`. Homepage order is Banner → four latest News items → Ecosystem → Upcoming Events → verified Statistics. Statistics stay hidden until official values exist. News and Event are separate concepts. Unsupported metrics, experts, projects, events and contact delivery must not be presented as real.

Public content flows from the content tree before domain, access, API and UI decisions. Each visible claim needs an official source; pending information is hidden or labeled pending rather than replaced by synthetic production-looking data.

## Current product boundary

Only Identity/IAM and membership-application backend flows are implemented. Member discovery pages currently use synthetic display data; specialist workflow/persona pages are absent.

| Concern | Canonical route |
| --- | --- |
| Landing page | `/` |
| About | `/about` |
| Ecosystem | `/ecosystem` |
| Public news stream | `/news` (`/explore` redirects here) |
| Contact | `/contact` |
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
