# Product

## Identity
Russia-Vietnam Science-Technology Intelligence Network is an independent bilateral knowledge, research, and technology cooperation portal founded and operated by the Traditions and Friendship Foundation. It is not a ministry portal or a separate legal entity.

## Audience
- Public visitors exploring approved knowledge, experts, publications, and cooperation opportunities.
- Authenticated researchers, reviewers, enterprises, organization representatives, and leadership.
- Foundation and system operators administering identity, access, security, and governance.

## Core mechanism
The Portal connects identity, scientific knowledge, experts, organizations, publications, and projects so users can move from discovery to explainable partner matching and bilateral 2+2 cooperation.

## Implemented surfaces
- Public landing and discovery: `/`, `/search`, `/knowledge`, `/experts`, `/experts/[id]`, `/publications/[id]`.
- Authentication and security: `/login`, `/security`.
- Authenticated workspaces: `/workspace`, `/workspace/iam`, `/workspace/knowledge`.
- Governance: `/admin/iam`.

## Product truth
- Backend authorization is authoritative; frontend permissions only shape UX.
- Keycloak owns credential UI; the frontend uses an opaque session bridge.
- Vietnamese, English, and Russian are first-class locales. One selected locale must govern all visible and accessible copy on a surface.
- Module 1 IAM is implemented. Other domain capabilities may be preview or partial and must not be presented as production-complete without evidence.
- Public content can be explored without login when approved; workspace and governance surfaces require appropriate session and capability scope.

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
