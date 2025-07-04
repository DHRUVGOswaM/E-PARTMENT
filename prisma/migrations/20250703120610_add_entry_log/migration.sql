-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('RESIDENT', 'VISITOR', 'VENDOR');

-- CreateTable
CREATE TABLE "EntryLog" (
    "id" TEXT NOT NULL,
    "personType" "EntryType" NOT NULL,
    "personName" TEXT NOT NULL,
    "vehicleNumber" TEXT,
    "inTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outTime" TIMESTAMP(3),
    "societyId" TEXT NOT NULL,
    "watchmanId" TEXT NOT NULL,

    CONSTRAINT "EntryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntryLog_societyId_inTime_idx" ON "EntryLog"("societyId", "inTime");

-- CreateIndex
CREATE INDEX "EntryLog_outTime_idx" ON "EntryLog"("outTime");

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_watchmanId_fkey" FOREIGN KEY ("watchmanId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
