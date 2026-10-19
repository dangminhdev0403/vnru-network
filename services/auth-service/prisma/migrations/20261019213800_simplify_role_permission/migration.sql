-- AlterTable: Add "permission" column to "RolePermission"
ALTER TABLE "RolePermission" ADD COLUMN "permission" TEXT;

-- Data migration: Copy Permission.key into RolePermission.permission
UPDATE "RolePermission"
SET "permission" = "Permission"."key"
FROM "Permission"
WHERE "RolePermission"."permissionId" = "Permission"."id";

-- Fallback in case any orphan RolePermission exists
DELETE FROM "RolePermission" WHERE "permission" IS NULL;

-- Set NOT NULL on "permission"
ALTER TABLE "RolePermission" ALTER COLUMN "permission" SET NOT NULL;

-- Drop foreign key and unique index on permissionId
ALTER TABLE "RolePermission" DROP CONSTRAINT IF EXISTS "RolePermission_permissionId_fkey";
DROP INDEX IF EXISTS "RolePermission_roleId_permissionId_key";

-- Drop permissionId column
ALTER TABLE "RolePermission" DROP COLUMN "permissionId";

-- Create new unique constraint and index on RolePermission
CREATE UNIQUE INDEX "RolePermission_roleId_permission_key" ON "RolePermission"("roleId", "permission");
CREATE INDEX "RolePermission_permission_idx" ON "RolePermission"("permission");

-- Drop table Permission
DROP TABLE IF EXISTS "Permission";
