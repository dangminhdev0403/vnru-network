-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearcherProfile" (
    "id" UUID NOT NULL,
    "userRef" TEXT,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "country" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "language" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearcherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpertiseArea" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "labels" JSONB NOT NULL,

    CONSTRAINT "ExpertiseArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearcherExpertise" (
    "profileId" UUID NOT NULL,
    "expertiseId" UUID NOT NULL,

    CONSTRAINT "ResearcherExpertise_pkey" PRIMARY KEY ("profileId","expertiseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpertiseArea_slug_key" ON "ExpertiseArea"("slug");

-- CreateIndex
CREATE INDEX "Organization_visibility_createdAt_id_idx" ON "Organization"("visibility", "createdAt", "id");

-- CreateIndex
CREATE INDEX "ResearcherProfile_visibility_createdAt_id_idx" ON "ResearcherProfile"("visibility", "createdAt", "id");

-- CreateIndex
CREATE INDEX "ResearcherProfile_organizationId_idx" ON "ResearcherProfile"("organizationId");

-- AddForeignKey
ALTER TABLE "ResearcherProfile" ADD CONSTRAINT "ResearcherProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearcherExpertise" ADD CONSTRAINT "ResearcherExpertise_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ResearcherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearcherExpertise" ADD CONSTRAINT "ResearcherExpertise_expertiseId_fkey" FOREIGN KEY ("expertiseId") REFERENCES "ExpertiseArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
