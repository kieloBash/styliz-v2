/*
  Warnings:

  - Added the required column `emailVerified` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admin-profiles" DROP CONSTRAINT "admin-profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "audit-logs" DROP CONSTRAINT "audit-logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "user-profiles" DROP CONSTRAINT "user-profiles_userId_fkey";

-- AlterTable
ALTER TABLE "user-preferences" ALTER COLUMN "theme" SET DEFAULT 'light';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isOnboarded" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "admin-profiles" ADD CONSTRAINT "admin-profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-profiles" ADD CONSTRAINT "user-profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit-logs" ADD CONSTRAINT "audit-logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
