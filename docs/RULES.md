# VN-RU Network Global Rules (Authoritative)

This document contains the authoritative governance, security, data-ownership, and development rules for the VN-RU Network repository. All domain-specific rule files defer to this document.

## 1. Security & Authentication Boundaries

- **Backend Enforcement**: Security and authorization MUST be validated at every backend service boundary.
- **Frontend non-boundary**: Frontend visual controls, route guards, and hidden buttons are UI conveniences only, never security boundaries.
- **Secrets Management**: Hardcoding API keys, JWT secrets, passwords, or credentials in source code, default configs, or documentation is strictly forbidden. Use environment variables.

## 2. Data Ownership & Microservice Boundaries

- **Isolated Persistence**: Each microservice owns its persistence store. Direct database queries across microservice boundaries are prohibited.
- **Contract-Based Integration**: Inter-service interaction MUST occur through explicit HTTP/REST contracts or versioned Kafka domain events.
- **Transactional Integrity**: Database transactions are scoped strictly within a single service boundary. No distributed multi-service database transactions.

## 3. Package & Dependency Governance

- **Explicit Approval Required**: Adding, upgrading, or removing packages in any `package.json` or lockfile requires explicit user approval before execution.
- **No Unapproved Packages**: Do not import or reference packages that are not present in `package.json`.

## 4. API & Resource Design

- **Bounded Collection Responses**: All list endpoints MUST enforce pagination boundaries (limit/cursor/offset) to prevent unbounded payload allocation.
- **Source of Truth**: PostgreSQL database stores serve as the primary source of truth. Redis caches must handle cache invalidation cleanly.

## 5. Working Tree & Scope Constraints

- **Preserve Unrelated Work**: Unrelated uncommitted edits, untracked files, or existing deleted files must remain untouched.
- **No Speculative Artifacts**: Do not generate unapproved documentation, code abstractions, or placeholder files outside assigned task boundaries.
