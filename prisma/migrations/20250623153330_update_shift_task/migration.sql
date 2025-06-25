-- CreateTable
CREATE TABLE "ShiftTask" (
    "id" TEXT NOT NULL,
    "staffName" TEXT NOT NULL,
    "shiftTime" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShiftTask_pkey" PRIMARY KEY ("id")
);
