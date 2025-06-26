-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "payment_logs" (
    "id" TEXT NOT NULL,
    "rz_order_id" TEXT NOT NULL,
    "rz_payment_id" TEXT,
    "rz_signature" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "amount" INTEGER NOT NULL,
    "amount_display" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pending_admin_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_logs_rz_order_id_key" ON "payment_logs"("rz_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_logs_rz_payment_id_key" ON "payment_logs"("rz_payment_id");

-- CreateIndex
CREATE INDEX "payment_logs_userId_idx" ON "payment_logs"("userId");

-- CreateIndex
CREATE INDEX "payment_logs_pending_admin_id_idx" ON "payment_logs"("pending_admin_id");

-- AddForeignKey
ALTER TABLE "payment_logs" ADD CONSTRAINT "payment_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_logs" ADD CONSTRAINT "payment_logs_pending_admin_id_fkey" FOREIGN KEY ("pending_admin_id") REFERENCES "pending_admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
