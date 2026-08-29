# Frontend Architecture

The frontend currently contains:

- public landing page `/`, about `/about`, ecosystem overview `/ecosystem`, news stream `/news` (with legacy `/explore` redirect), and contact `/contact`;
- authenticated member information under `/knowledge`, `/experts` and `/opportunities`;
- Auth.js Credentials login and session bridge under `/login` and `/api/auth/*`, plus a localized `/register` request preview that does not create identities;
- member account `/account`;
- MFA and sessions `/security`;
- IAM governance `/admin/access/*`;
- Module 1 security audit `/admin/audit`;
- one member information hub at `/workspace`; specialist persona/workflow routes have been removed;
- capability-aware `/workspace` navigation and compatibility redirects under `/workspace/iam*`.
- capability-gated News management at `/workspace/news`; public News rendering remains independent.

Routes remain thin. `features/auth` owns authentication, account and security behavior; `features/iam` and `features/admin/access` own access governance; shared shells own presentation only. Backend authorization is authoritative.

Public visitors read approved news and events. Registered members and experts also access approved knowledge, topic calls and scientific publications. Portal managers additionally receive content-management and aggregate-statistics capabilities. Backend authorization remains authoritative; none of these labels grants unrestricted access.

There are no Knowledge, Expert, Publication, Collaboration, Review or Project business backends. Member information surfaces are read-only and use synthetic display data until content APIs exist. No frontend workflow state or fake mutation is retained.
