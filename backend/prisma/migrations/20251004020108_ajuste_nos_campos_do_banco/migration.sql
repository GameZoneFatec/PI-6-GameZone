/*
  Warnings:

  - You are about to drop the column `rating` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the `reviewLike` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `rating` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."reviewLike" DROP CONSTRAINT "reviewLike_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviewLike" DROP CONSTRAINT "reviewLike_userId_fkey";

-- DropIndex
DROP INDEX "public"."Review_isPublic_status_created_at_idx";

-- DropIndex
DROP INDEX "public"."Review_rawgId_isPublic_status_idx";

-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "published_at" TIMESTAMP(3),
DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."UserGame" DROP COLUMN "rating",
DROP COLUMN "review";

-- DropTable
DROP TABLE "public"."reviewLike";

-- CreateTable
CREATE TABLE "public"."ReviewLike" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewLike_userId_idx" ON "public"."ReviewLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewLike_reviewId_userId_key" ON "public"."ReviewLike"("reviewId", "userId");

-- CreateIndex
CREATE INDEX "Review_isPublic_status_published_at_idx" ON "public"."Review"("isPublic", "status", "published_at");

-- CreateIndex
CREATE INDEX "Review_rawgId_isPublic_status_published_at_idx" ON "public"."Review"("rawgId", "isPublic", "status", "published_at");

-- AddForeignKey
ALTER TABLE "public"."ReviewLike" ADD CONSTRAINT "ReviewLike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewLike" ADD CONSTRAINT "ReviewLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
