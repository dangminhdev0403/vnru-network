CREATE TYPE "OpportunityState" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE "ProposalState" AS ENUM ('DRAFT', 'PAIRED_CONFIRMED', 'SUBMITTED', 'ELIGIBLE', 'INELIGIBLE', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED');
CREATE TYPE "Country" AS ENUM ('VN', 'RU');

-- CreateTable
CREATE TABLE "FundingOpportunity" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fundingProgramRef" TEXT NOT NULL,
    "state" "OpportunityState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundingOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JointProposal" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "state" "ProposalState" NOT NULL,
    "content" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JointProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalParticipant" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationRef" TEXT NOT NULL,
    "country" "Country" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaborationConfirmation" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "participantId" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "CollaborationConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationEndorsement" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "organizationRef" TEXT NOT NULL,
    "country" "Country" NOT NULL,
    "endorsed" BOOLEAN NOT NULL DEFAULT false,
    "endorsedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationEndorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EligibilityScreening" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "eligible" BOOLEAN NOT NULL,
    "reason" TEXT NOT NULL,
    "screenedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EligibilityScreening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingDecision" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "reason" TEXT NOT NULL,
    "decidedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundingDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProposalParticipant_proposalId_country_key" ON "ProposalParticipant"("proposalId", "country");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalParticipant_proposalId_userId_key" ON "ProposalParticipant"("proposalId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationConfirmation_proposalId_participantId_key" ON "CollaborationConfirmation"("proposalId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationEndorsement_proposalId_country_key" ON "OrganizationEndorsement"("proposalId", "country");

-- AddForeignKey
ALTER TABLE "JointProposal" ADD CONSTRAINT "JointProposal_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "FundingOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalParticipant" ADD CONSTRAINT "ProposalParticipant_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "JointProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationConfirmation" ADD CONSTRAINT "CollaborationConfirmation_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "JointProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationEndorsement" ADD CONSTRAINT "OrganizationEndorsement_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "JointProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EligibilityScreening" ADD CONSTRAINT "EligibilityScreening_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "JointProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingDecision" ADD CONSTRAINT "FundingDecision_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "JointProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JointProposal" ADD CONSTRAINT "JointProposal_revision_check" CHECK ("revision" > 0);
