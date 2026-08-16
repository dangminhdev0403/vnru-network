# Database Migration Guide

Use only for a service that currently contains a database schema and migration tool. The current scaffold has no approved migration baseline; documentation must not invent one.

1. Read the affected service `package.json`, schema, existing migration directory, and deployment workflow.
2. If any prerequisite is absent, stop and request a separate approved setup slice.
3. Never rename or rewrite an applied migration.
4. Generate reviewable migration output with the repository’s existing tool. Do not use schema push/reset in shared, staging, or production environments.
5. Validate status, generated client/types, focused tests, and rollback/recovery notes with commands that actually exist.

Final report: exact docs/source read, migration files changed, commands/results, rollback risk.
