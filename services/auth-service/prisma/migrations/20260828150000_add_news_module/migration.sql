CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "NewsLocale" AS ENUM ('VI', 'EN', 'RU');

CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsArticleTranslation" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "locale" "NewsLocale" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "NewsArticleTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
CREATE INDEX "NewsArticle_status_isFeatured_publishedAt_idx" ON "NewsArticle"("status", "isFeatured", "publishedAt");
CREATE UNIQUE INDEX "NewsArticleTranslation_articleId_locale_key" ON "NewsArticleTranslation"("articleId", "locale");
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "NewsArticleTranslation" ADD CONSTRAINT "NewsArticleTranslation_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "NewsArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Role" ("id", "name") VALUES ('ba100000-0000-4000-8000-000000000001', 'CONTENT_EDITOR') ON CONFLICT ("name") DO NOTHING;
INSERT INTO "Permission" ("id", "key") VALUES
  ('ba100000-0000-4000-8000-000000000011', 'content.article.create'),
  ('ba100000-0000-4000-8000-000000000012', 'content.article.update'),
  ('ba100000-0000-4000-8000-000000000013', 'content.article.publish')
ON CONFLICT ("key") DO NOTHING;
INSERT INTO "RolePermission" ("id", "roleId", "permissionId")
SELECT
  CASE permission."key"
    WHEN 'content.article.create' THEN 'ba100000-0000-4000-8000-000000000021'
    WHEN 'content.article.update' THEN 'ba100000-0000-4000-8000-000000000022'
    ELSE 'ba100000-0000-4000-8000-000000000023'
  END,
  role."id",
  permission."id"
FROM "Role" role
CROSS JOIN "Permission" permission
WHERE role."name" = 'CONTENT_EDITOR'
  AND permission."key" IN ('content.article.create', 'content.article.update', 'content.article.publish')
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
