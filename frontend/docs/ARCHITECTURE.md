# Frontend Architecture

The frontend currently contains:

- public landing page `/`, news stream `/news` (with legacy `/explore` redirect), and synthetic discovery previews under `/knowledge`, `/experts` and `/opportunities`;
- Auth.js Credentials login and session bridge under `/login` and `/api/auth/*`, plus a localized `/register` request preview that does not create identities;
- member account `/account`;
- MFA and sessions `/security`;
- IAM governance `/admin/access/*`;
- Module 1 security audit `/admin/audit`;
- one unified member overview at `/workspace` plus capability-gated Researcher, Reviewer, Organization Representative, Collaboration Manager and Decision task modules under `/workspace/*`;
- authenticated Enterprise and Leadership UI previews that are not live persona destinations;
- capability-aware `/workspace` navigation and compatibility redirects under `/workspace/iam*`.

Routes remain thin. `features/auth` owns authentication, account and security behavior; `features/iam` and `features/admin/access` own access governance; shared shells own presentation only. Backend authorization is authoritative.

Task-module routes may use URL `view` state to expose separate navigation destinations inside one route family. They share one member persona and one workspace shell; backend roles remain distinct authorization/audit inputs. Demo mutations write only local preview activity/state and must remain clearly labeled.

`KNOWLEDGE_CURATOR` is removed from the current active synthetic role set. Knowledge discovery remains available publicly and inside the Researcher preview.

There are no Knowledge, Expert, Publication, Collaboration, Review or Project business backends. Their current frontend surfaces use synthetic preview data and must remain labeled accordingly.
