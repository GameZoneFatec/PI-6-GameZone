/*
  Warnings:

  - The values [ARCHIVED] on the enum `ReviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReviewStatus_new" AS ENUM ('DRAFT', 'PUBLISHED');
ALTER TABLE "public"."Review" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Review" ALTER COLUMN "status" TYPE "public"."ReviewStatus_new" USING ("status"::text::"public"."ReviewStatus_new");
ALTER TYPE "public"."ReviewStatus" RENAME TO "ReviewStatus_old";
ALTER TYPE "public"."ReviewStatus_new" RENAME TO "ReviewStatus";
DROP TYPE "public"."ReviewStatus_old";
ALTER TABLE "public"."Review" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
COMMIT;
