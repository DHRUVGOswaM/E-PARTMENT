-- CreateTable
CREATE TABLE "MarqueeNotice" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarqueeNotice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarqueeNotice" ADD CONSTRAINT "MarqueeNotice_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
