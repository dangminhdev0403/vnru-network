UPDATE "Role"
SET "name" = 'COLLABORATION_MANAGER'
WHERE "name" = 'PROGRAM_MANAGER';

UPDATE "Permission"
SET "key" = regexp_replace("key", '^grants\.', 'collab.')
WHERE "key" LIKE 'grants.%';

UPDATE "RoleAssignment"
SET "contextType" = 'PLATFORM', "contextId" = 'GLOBAL'
WHERE "contextType" = 'FUNDING_PROGRAM';
