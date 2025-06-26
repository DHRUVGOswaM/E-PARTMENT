/*
  Warnings:

  - The `payment_method` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CHEQUE', 'BANK_TRANSFER', 'ONLINE_PAYMENT');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "cheque_number" TEXT,
ADD COLUMN     "ifsc_code" TEXT,
ADD COLUMN     "transaction_id" TEXT,
ADD COLUMN     "upi_id" TEXT,
DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" "PaymentMethod";
