-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Publication" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT,
    "type" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "organizationRef" TEXT,
    "visibility" "Visibility" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeTopic" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "labels" JSONB NOT NULL,

    CONSTRAINT "KnowledgeTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationTopic" (
    "publicationId" UUID NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "PublicationTopic_pkey" PRIMARY KEY ("publicationId","topicId")
);

-- CreateTable
CREATE TABLE "PublicationAuthorRef" (
    "id" UUID NOT NULL,
    "publicationId" UUID NOT NULL,
    "expertRef" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "PublicationAuthorRef_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Publication_visibility_createdAt_id_idx" ON "Publication"("visibility", "createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeTopic_slug_key" ON "KnowledgeTopic"("slug");

-- CreateIndex
CREATE INDEX "PublicationTopic_topicId_idx" ON "PublicationTopic"("topicId");

-- CreateIndex
CREATE INDEX "PublicationAuthorRef_publicationId_displayOrder_idx" ON "PublicationAuthorRef"("publicationId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationAuthorRef_publicationId_expertRef_key" ON "PublicationAuthorRef"("publicationId", "expertRef");

-- AddForeignKey
ALTER TABLE "PublicationTopic" ADD CONSTRAINT "PublicationTopic_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationTopic" ADD CONSTRAINT "PublicationTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "KnowledgeTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationAuthorRef" ADD CONSTRAINT "PublicationAuthorRef_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
