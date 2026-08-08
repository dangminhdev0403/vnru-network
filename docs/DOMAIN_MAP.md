# VN-RU Network Domain Map

## Purpose

This document maps business domains and module ownership inside the current backend service structure.

It is an ownership guide before moving code between modules or extracting a module into a dedicated service.

## Domain / Module ownership

Each module must define:

| Area                 | Required definition                                                   |
| -------------------- | --------------------------------------------------------------------- |
| Business capability  | What business responsibility the module owns                          |
| Code boundary        | Where the module implementation lives                                 |
| Data ownership       | Models and data owned by the module                                   |
| Public API/port      | Services or contracts other modules may use                           |
| Dependencies         | Other modules it is allowed to depend on                              |
| Extraction readiness | Whether the module has a clear boundary for future service extraction |

Do not define final service boundaries before the corresponding domain and module ownership is understood.

## Allowed dependencies

```txt
Module A
  -> Public API / Port
  -> Module B
```

Rules:

* Modules must communicate through public services/ports.
* Do not access another module's repository directly.
* Do not access another module's Prisma queries directly.
* Do not expose persistence implementation as a module contract.
* Shared infrastructure may be used by modules where appropriate.
* Cross-module dependencies must follow the dependency direction defined in `ARCHITECTURE.md`.

## Data ownership

Each business model must have one owning module.

Rules:

* The owning module controls writes to its data.
* Other modules must use the owner's public service/port or API.
* Do not duplicate ownership of the same business data across modules.
* Read access must still respect the owning module's boundary.

## Transaction boundaries

Keep transactions inside the owning module whenever possible.

For workflows crossing module boundaries:

* prefer a public application service;
* use in-process events when asynchronous behavior is actually required;
* do not introduce a message broker by default;
* do not use distributed transactions by default.

## Extraction readiness

A module may become a dedicated service when its boundary is sufficiently stable and there is a real reason to extract it.

Possible triggers:

* independent scaling or deployment;
* security or isolation requirement;
* clear data ownership;
* stable API/event contract;
* independent external integration;
* operational requirement.

Until those conditions exist, keep the module inside its current service.

## Refactor sequence

1. Define business ownership.
2. Define module data ownership.
3. Define public services/ports.
4. Remove direct access to internal repositories across modules.
5. Add tests protecting the module boundary.
6. Review API/event contracts.
7. Consider service extraction only after the boundary is stable.
