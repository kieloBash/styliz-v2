/*
  Warnings:

  - Added the required column `rate` to the `user-profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user-profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('NO_SHOW', 'CANCELLED', 'ASSIGNED', 'COMPLETED');

-- DropIndex
DROP INDEX "users_name_key";

-- AlterTable
ALTER TABLE "user-profiles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rate" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "shifts" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "status" "ShiftStatus" NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user-profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
