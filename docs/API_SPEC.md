# VN-RU Network Architecture

## 1. Architecture decision

VN-RU Network is designed as a **modular backend with microservice-ready boundaries**:

```txt
frontend/                         # Next.js frontend
services/                         # backend services
shared/api-contract/              # exported OpenAPI/shared contract
```

The current backend service may contain multiple domain modules. Modules must have clear ownership and dependency boundaries so they can be extracted into dedicated services later when there is a real operational reason.

Do not split modules into microservices prematurely. Service extraction is a separate architectural decision.

## 2. Current runtime topology

```txt
Browser / mobile web
  -> Next.js frontend
  -> Backend service(s)
  -> PostgreSQL
  -> External providers where enabled
```

The current architecture does not require an API gateway, message broker, distributed cache, or database-per-service split unless a specific requirement justifies it.

## 3. Domain / Module Boundaries

Each module should define a clear business boundary.

Every module owns:

* business capability;
* data/models it owns;
* controllers/routes it exposes;
* public services/ports other modules may use;
* events it publishes/consumes, if any;
* tests that protect behavior.

Modules should remain internally cohesive and should not expose persistence implementation details.

A module may later become an independent service when its ownership, scaling, deployment, security, integration, or operational requirements justify extraction.

Do not decide the final service split before the domain boundaries are understood.

## 4. Dependency direction

Allowed direction:

```txt
Controller -> Application Service -> Repository/Adapter -> Database/Provider
```

Cross-module calls must go through a public service/port exported by the owning module. Repositories and persistence details are internal to their module.

Rules:

* Controllers stay thin and own HTTP parsing/response mapping only.
* Services own workflow, authorization/resource checks, and transaction decisions.
* Repositories own persistence details and are not exported across module boundaries.
* Shared guards/decorators may depend on public Identity contracts, not deep implementation details.
* External providers stay behind adapters/services.
* A module must not directly access another module's repository or persistence implementation.

## 5. Contract source of truth

OpenAPI export from the backend is the HTTP contract source of truth.

```bash
npm run openapi:export
```

The exported contract should be consumed or verified through `shared/api-contract`.

`docs/API_CONTRACT.md` should describe contract policy and runtime notes. It should not become a hand-maintained endpoint catalog that drifts from generated OpenAPI.

## 6. Event and async strategy

Use synchronous transactions and in-process communication where the workflow does not require asynchronous processing.

When events are needed, use an explicit versioned envelope:

```txt
id, type, version, occurredAt, producer, correlationId, actor, payload
```

Do not introduce Kafka, RabbitMQ, Redis Streams, or an outbox worker without a specific workflow requirement.

## 7. Service extraction policy

A module may be extracted into a dedicated service only when at least one trigger is real and measured:

* independent scaling or deployment cadence;
* isolation/security requirement;
* external integration reliability requirement;
* clear data ownership and contract stability;
* team ownership boundary;
* operational need such as independent retries/queueing.

Until then, keep modules inside their current service.

When extraction is required, preserve the existing domain contract and define the new service boundary explicitly before implementation.

## 8. Rename policy

Service names should represent their actual responsibility.

Do not rename or split an existing service only for naming consistency.

A service rename or extraction must be a separate phase because it can affect Docker, CI, scripts, documentation, OpenAPI export, and frontend environment references.
