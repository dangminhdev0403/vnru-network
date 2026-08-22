CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'CONFLICT', 'DRAFT', 'SUBMITTED');
CREATE TYPE "ConflictDeclarationType" AS ENUM ('CONFLICT', 'NO_CONFLICT');
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'SUBMITTED');
CREATE TYPE "ScoreDimension" AS ENUM ('scientificMerit', 'feasibility', 'bilateralValue', 'impact');

CREATE TABLE "ReviewAssignment" (
  "id" UUID NOT NULL, "proposalRef" TEXT NOT NULL, "reviewerId" TEXT NOT NULL,
  "boardRef" TEXT NOT NULL, "fundingProgramRef" TEXT NOT NULL,
  "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReviewAssignment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProposalSnapshot" (
  "id" UUID NOT NULL, "assignmentId" UUID NOT NULL, "proposalRef" TEXT NOT NULL,
  "snapshot" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProposalSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ConflictDeclaration" (
  "id" UUID NOT NULL, "assignmentId" UUID NOT NULL, "reviewerId" TEXT NOT NULL,
  "declaration" "ConflictDeclarationType" NOT NULL, "declaredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConflictDeclaration_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ReviewRecord" (
  "id" UUID NOT NULL, "assignmentId" UUID NOT NULL, "reviewerId" TEXT NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT', "comments" TEXT, "submittedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReviewRecord_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EvaluationScore" (
  "id" UUID NOT NULL, "reviewRecordId" UUID NOT NULL, "dimension" "ScoreDimension" NOT NULL, "score" INTEGER NOT NULL,
  CONSTRAINT "EvaluationScore_pkey" PRIMARY KEY ("id"), CONSTRAINT "EvaluationScore_score_check" CHECK ("score" BETWEEN 1 AND 5)
);
CREATE TABLE "EvaluationRecommendation" (
  "id" UUID NOT NULL, "proposalRef" TEXT NOT NULL, "averageScientificMerit" DOUBLE PRECISION NOT NULL,
  "averageFeasibility" DOUBLE PRECISION NOT NULL, "averageBilateralValue" DOUBLE PRECISION NOT NULL,
  "averageImpact" DOUBLE PRECISION NOT NULL, "overallAverage" DOUBLE PRECISION NOT NULL, "totalReviews" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EvaluationRecommendation_pkey" PRIMARY KEY ("id"), CONSTRAINT "EvaluationRecommendation_totalReviews_check" CHECK ("totalReviews" > 0)
);
CREATE TABLE "OutboxEvent" (
  "id" UUID NOT NULL, "eventType" TEXT NOT NULL, "payload" JSONB NOT NULL, "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ReviewAssignment_reviewerId_idx" ON "ReviewAssignment"("reviewerId");
CREATE INDEX "ReviewAssignment_proposalRef_idx" ON "ReviewAssignment"("proposalRef");
CREATE UNIQUE INDEX "ProposalSnapshot_assignmentId_key" ON "ProposalSnapshot"("assignmentId");
CREATE UNIQUE INDEX "ConflictDeclaration_assignmentId_key" ON "ConflictDeclaration"("assignmentId");
CREATE UNIQUE INDEX "ReviewRecord_assignmentId_key" ON "ReviewRecord"("assignmentId");
CREATE UNIQUE INDEX "EvaluationScore_reviewRecordId_dimension_key" ON "EvaluationScore"("reviewRecordId", "dimension");
CREATE UNIQUE INDEX "EvaluationRecommendation_proposalRef_key" ON "EvaluationRecommendation"("proposalRef");
ALTER TABLE "ProposalSnapshot" ADD CONSTRAINT "ProposalSnapshot_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "ReviewAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConflictDeclaration" ADD CONSTRAINT "ConflictDeclaration_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "ReviewAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewRecord" ADD CONSTRAINT "ReviewRecord_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "ReviewAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EvaluationScore" ADD CONSTRAINT "EvaluationScore_reviewRecordId_fkey" FOREIGN KEY ("reviewRecordId") REFERENCES "ReviewRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
