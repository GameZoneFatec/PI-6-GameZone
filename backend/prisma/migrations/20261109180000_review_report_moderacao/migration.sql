-- CreateEnum
CREATE TYPE "public"."ReportReason" AS ENUM ('OFFENSIVE', 'SPAM', 'SPOILER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'PROCESSED', 'ACCEPTED', 'DISMISSED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ReviewStatus" ADD VALUE 'HIDDEN';
ALTER TYPE "public"."ReviewStatus" ADD VALUE 'REMOVED';

-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "hidden_at" TIMESTAMP(3),
ADD COLUMN     "moderated_at" TIMESTAMP(3),
ADD COLUMN     "moderated_by_id" TEXT,
ADD COLUMN     "reports_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."ReviewReport" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" "public"."ReportReason" NOT NULL,
    "details" TEXT,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "publish_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_publish_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewReport_status_created_at_idx" ON "public"."ReviewReport"("status", "created_at");

-- CreateIndex
CREATE INDEX "ReviewReport_reviewId_status_idx" ON "public"."ReviewReport"("reviewId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReport_reviewId_reporterId_key" ON "public"."ReviewReport"("reviewId", "reporterId");

-- AddForeignKey
ALTER TABLE "public"."ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewReport" ADD CONSTRAINT "ReviewReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

