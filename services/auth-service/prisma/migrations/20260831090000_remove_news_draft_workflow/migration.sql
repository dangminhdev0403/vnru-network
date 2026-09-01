UPDATE "NewsArticle"
SET "publishedAt" = COALESCE("publishedAt", "createdAt");

ALTER TABLE "NewsArticle"
ALTER COLUMN "publishedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "publishedAt" SET NOT NULL;

DROP INDEX IF EXISTS "NewsArticle_status_isFeatured_publishedAt_idx";
DROP INDEX IF EXISTS "NewsArticle_status_contentType_publishedAt_idx";

ALTER TABLE "NewsArticle" DROP COLUMN "status";
DROP TYPE "NewsStatus";

CREATE INDEX "NewsArticle_isFeatured_publishedAt_idx"
ON "NewsArticle"("isFeatured", "publishedAt");

CREATE INDEX "NewsArticle_contentType_publishedAt_idx"
ON "NewsArticle"("contentType", "publishedAt");

DELETE FROM "RolePermission"
WHERE "permissionId" IN (
  SELECT "id" FROM "Permission" WHERE "key" = 'content.article.publish'
);

DELETE FROM "Permission" WHERE "key" = 'content.article.publish';
