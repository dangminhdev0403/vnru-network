# Product

## Identity
Russia-Vietnam Science-Technology Intelligence Network is an independent bilateral knowledge, research, and technology cooperation portal founded and operated by the Traditions and Friendship Foundation. It is not a ministry portal or a separate legal entity.

## Audience
- Public visitors reading news, events, and approved public information.
- Registered members and experts accessing approved knowledge, topic calls, and scientific publications.
- Portal managers administering content and viewing aggregate site statistics.

System administrators are operational users for IAM, security, and audit. They are not a fourth product audience and do not represent portal managers.

## Core mechanism
The Portal publishes science and technology information, then opens approved knowledge resources to registered members and experts.

## Implemented surfaces
- Public landing: `/`.
- Public information: `/news`.
- Member information: `/knowledge`, `/experts`, `/opportunities`.
- Authentication and member self-service: `/login`, `/account`, `/security`.
- Member information hub: `/workspace`.
- Governance: `/admin/access/*` and `/admin/audit`.
- Compatibility: legacy `/workspace/iam*` routes redirect to account, security, or governance.

## Product truth
- Backend authorization is authoritative; frontend permissions only shape UX.
- Auth.js Credentials verifies the ignored runtime account config; the backend owns opaque application sessions and authorization.
- Vietnamese, English, and Russian are first-class locales. One selected locale must govern all visible and accessible copy on a surface.
- Member information surfaces use synthetic display data until content APIs exist; they do not expose fake workflow actions.
- The landing page is public; account, security and governance surfaces require the appropriate session and capability scope.

## Design success
- A first-time visitor understands the bilateral network and primary discovery action within seconds.
- Authenticated users can identify context, security state, available modules, and next action without marketing clutter.
- The visual system feels institutional, scientific, bilateral, and contemporary rather than generic SaaS.
- Motion explains connection, hierarchy, and state transition; it never obstructs reading or operation.

## Constraints
- Preserve routes, information architecture, authentication behavior, domain boundaries, accessibility, and responsive behavior.
- Preserve the VN-RU blue/red identity while using red sparingly.
- Do not invent metrics, services, permissions, or production capabilities.
- Prefer installed `motion` and native CSS. Add dependencies only when an implemented requirement cannot be met otherwise.
