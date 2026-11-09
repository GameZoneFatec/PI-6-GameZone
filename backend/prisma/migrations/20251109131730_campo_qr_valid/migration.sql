/*
  Warnings:

  - Added the required column `qr_valid` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Payments" ADD COLUMN     "qr_valid" TIMESTAMP(3) NOT NULL;
