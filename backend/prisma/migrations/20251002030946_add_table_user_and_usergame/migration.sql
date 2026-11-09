-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('BACKLOG', 'PLAYING', 'FINISHED', 'DROPPED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image_url" TEXT,
    "bio" TEXT,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rawgId" INTEGER NOT NULL,
    "status" "public"."GameStatus" NOT NULL,
    "rating" INTEGER,
    "note" TEXT,
    "review" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "UserGame_userId_status_idx" ON "public"."UserGame"("userId", "status");

-- CreateIndex
CREATE INDEX "UserGame_userId_idx" ON "public"."UserGame"("userId");

-- CreateIndex
CREATE INDEX "UserGame_rawgId_idx" ON "public"."UserGame"("rawgId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGame_userId_rawgId_key" ON "public"."UserGame"("userId", "rawgId");

-- AddForeignKey
ALTER TABLE "public"."UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
