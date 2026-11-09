/*
  Warnings:

  - A unique constraint covering the columns `[mp_payment_id]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payments_mp_payment_id_key" ON "public"."Payments"("mp_payment_id");
