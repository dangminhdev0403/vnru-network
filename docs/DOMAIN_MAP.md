# Russia-Vietnam Science-Technology Intelligence Network Domain Map

## 1. Ownership rule

Every business state has exactly one owning domain module. A domain module may be hosted inside a larger business-family deployable. No other module may directly mutate its owned state.

Domain boundary and deployment boundary are independent decisions.

## 2. Deployables and domain modules

| Deployable | Domain module | Owned responsibility and state | Status |
| --- | --- | --- | --- |
| `auth-service` | Identity & Access Governance | `User`, `ExternalIdentity`, `Session`, `Role`, `Permission`, `RoleAssignment`, `ActiveContext`, `AuditEvent` | Current |
| `knowledge-service` | Publications | Publications, authors, topics, public knowledge discovery | Current |
| `knowledge-service` | Directory | Organizations, expert profiles, expertise, deterministic partner matching | Current |
| `collaboration-service` | Collaboration | Research opportunities, bilateral proposals, participants, confirmations, endorsements, screenings, collaboration decisions | Current |
| `collaboration-service` | Reviews | Review assignments, conflict declarations, anonymized proposal snapshots, evaluation scores, records, recommendations | Current |
| `collaboration-service` | Projects | Projects, project members/resource roles, milestones, deliverables, reports, outcomes, completion and termination | Current |
| `academic-service` | Academic Activities | Seminars, conferences, exchange, participation, dissemination | Target; create only when implemented |
| `technology-service` | Technology & Enterprise | Technology profiles, enterprise needs, EOI, collaboration cases, 2+2 consortiums, advisory and transfer outcomes | Target; create only when implemented |
| `analytics-service` | Read-only Analytics | Fact projections, KPIs, collaboration graph, internal report runs | Target; create only when implemented |

## 3. Persistence boundaries

1. Owning modules have exclusive write authority.
2. A shared process does not authorize direct access to another module's repository or Prisma client.
3. Knowledge currently retains separate publication and directory databases.
4. Collaboration currently retains separate collaboration, review, and project databases.
5. Cross-module references use immutable IDs rather than cross-database foreign keys.
6. Transactions stay inside one module-owned persistence boundary. Distributed multi-database transactions are prohibited.

## 4. Integration rules

Inside one deployable, modules use explicit application contracts. Across deployables, use public HTTP contracts or versioned domain events.

```text
Knowledge discovery ──optional reference──> Collaboration
Collaboration sanitized snapshot ─────────> Reviews
Approved collaboration decision ──────────> Projects bootstrap
Domain facts ──────────────────────────────> Analytics / Search / Notifications
```

Knowledge discovery is optional; a proposal may begin directly from a Research Opportunity.

Reviews never read Collaboration repositories to resolve hidden participant or organization identities. Reviewer-facing data comes from the sanitized immutable review snapshot.

Projects own their lifecycle after explicit bootstrap. `LEAD` and `MEMBER` are project resource roles, not IAM roles.

Project completion does not automatically create Technology state. Any handoff is an explicit business action.

Analytics is read-only and never mutates transactional state.

## 5. Extraction readiness

A module may become a dedicated microservice only when:

1. state ownership and public contract are clear;
2. the contract is stable and versioned;
3. independent scale or deployment cadence is required;
4. security or compliance requires process isolation;
5. distinct team ownership exists;
6. operational overhead is justified.

Having a controller, service, and repository is not sufficient reason to extract a deployable.
