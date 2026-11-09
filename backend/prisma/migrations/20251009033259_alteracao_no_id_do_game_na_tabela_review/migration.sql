/*
  Warnings:

  - You are about to drop the column `rawgId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rawgId` on the `UserGame` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,gameId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,gameId]` on the table `UserGame` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `UserGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Review_rawgId_isPublic_status_published_at_idx";

-- DropIndex
DROP INDEX "public"."Review_userId_rawgId_key";

-- DropIndex
DROP INDEX "public"."UserGame_rawgId_idx";

-- DropIndex
DROP INDEX "public"."UserGame_userId_rawgId_key";

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "rawgId",
ADD COLUMN     "gameId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserGame" DROP COLUMN "rawgId",
ADD COLUMN     "gameId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Review_gameId_isPublic_status_published_at_idx" ON "public"."Review"("gameId", "isPublic", "status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_gameId_key" ON "public"."Review"("userId", "gameId");

-- CreateIndex
CREATE INDEX "UserGame_gameId_idx" ON "public"."UserGame"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGame_userId_gameId_key" ON "public"."UserGame"("userId", "gameId");
