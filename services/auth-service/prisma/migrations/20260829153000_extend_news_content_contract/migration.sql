-- CreateEnum
CREATE TYPE "NewsContentType" AS ENUM ('ARTICLE', 'EVENT', 'ANNOUNCEMENT', 'PROJECT', 'OPPORTUNITY', 'PUBLICATION');

-- AlterTable
ALTER TABLE "NewsArticle" ADD COLUMN "contentType" "NewsContentType" NOT NULL DEFAULT 'ARTICLE';
ALTER TABLE "NewsArticle" ADD COLUMN "actionUrl" TEXT;
ALTER TABLE "NewsArticle" ADD COLUMN "actionClosesAt" TIMESTAMP(3);
ALTER TABLE "NewsArticle" ADD COLUMN "sourceUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "NewsArticleTranslation" ADD COLUMN "actionLabel" TEXT;

-- CreateIndex
CREATE INDEX "NewsArticle_status_contentType_publishedAt_idx" ON "NewsArticle"("status", "contentType", "publishedAt");

-- Add permission content.article.read and assign to CONTENT_EDITOR idempotently
INSERT INTO "Permission" ("id", "key") VALUES
  ('ba100000-0000-4000-8000-000000000014', 'content.article.read')
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId")
SELECT
  'ba100000-0000-4000-8000-000000000024',
  role."id",
  permission."id"
FROM "Role" role
CROSS JOIN "Permission" permission
WHERE role."name" = 'CONTENT_EDITOR'
  AND permission."key" = 'content.article.read'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
