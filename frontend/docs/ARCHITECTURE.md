# Frontend Architecture

The frontend currently contains:

- public landing page `/`;
- Keycloak login bridge `/login` and `/api/auth/*`;
- member account `/account`;
- MFA and sessions `/security`;
- IAM governance `/admin/access/*`;
- Module 1 security audit `/admin/audit`;
- compatibility redirects under `/workspace` and `/workspace/iam*`.

Routes remain thin. `features/auth` owns authentication, account and security behavior; `features/iam` and `features/admin/access` own access governance; shared shells own presentation only. Backend authorization is authoritative.

There are no Knowledge, Expert, Publication, Collaboration, Review or Project frontend runtimes.
