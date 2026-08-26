-- CreateEnum
CREATE TYPE "MembershipApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "MembershipApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "professionalRole" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "status" "MembershipApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MembershipApplication_email_status_idx"
ON "MembershipApplication"("email", "status");

-- Only one pending request per normalized email; rejected requests may be resubmitted.
CREATE UNIQUE INDEX "MembershipApplication_pending_email_key"
ON "MembershipApplication"("email") WHERE "status" = 'PENDING';