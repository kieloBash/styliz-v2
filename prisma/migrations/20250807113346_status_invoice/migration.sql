-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING';
