-- CreateIndex
CREATE UNIQUE INDEX "ReviewAssignment_proposalRef_reviewerId_key" ON "ReviewAssignment"("proposalRef", "reviewerId");
