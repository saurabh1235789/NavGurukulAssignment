/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinCode` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "description" TEXT,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "joinCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_joinCode_key" ON "Session"("joinCode");
