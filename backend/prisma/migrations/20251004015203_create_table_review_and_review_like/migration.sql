-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rawgId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."ReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviewLike" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviewLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_isPublic_status_created_at_idx" ON "public"."Review"("isPublic", "status", "created_at");

-- CreateIndex
CREATE INDEX "Review_rawgId_isPublic_status_idx" ON "public"."Review"("rawgId", "isPublic", "status");

-- CreateIndex
CREATE INDEX "Review_userId_status_updated_at_idx" ON "public"."Review"("userId", "status", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_rawgId_key" ON "public"."Review"("userId", "rawgId");

-- CreateIndex
CREATE INDEX "reviewLike_userId_idx" ON "public"."reviewLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviewLike_reviewId_userId_key" ON "public"."reviewLike"("reviewId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewLike" ADD CONSTRAINT "reviewLike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviewLike" ADD CONSTRAINT "reviewLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
