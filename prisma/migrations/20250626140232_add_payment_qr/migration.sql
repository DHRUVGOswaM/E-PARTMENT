-- CreateTable
CREATE TABLE "payment_qr" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT NOT NULL,
    "qrString" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_qr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_qr_societyId_idx" ON "payment_qr"("societyId");

-- AddForeignKey
ALTER TABLE "payment_qr" ADD CONSTRAINT "payment_qr_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
