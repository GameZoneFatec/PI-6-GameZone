-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "mp_payment_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "payer_email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "qr_code_base64" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);
