-- AlterTable
ALTER TABLE "audit-logs" ADD COLUMN     "level" TEXT;

-- CreateIndex
CREATE INDEX "audit-logs_createdAt_idx" ON "audit-logs"("createdAt");
