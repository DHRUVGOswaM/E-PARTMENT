/*
  Warnings:

  - You are about to drop the column `role` on the `emergency_contacts` table. All the data in the column will be lost.
  - Added the required column `designation` to the `emergency_contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emergency_contacts" DROP COLUMN "role",
ADD COLUMN     "designation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pending_access" ALTER COLUMN "requestedRole" SET DEFAULT 'HOUSE_OWNER';
