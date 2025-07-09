-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;
