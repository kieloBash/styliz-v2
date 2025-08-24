import { InvoiceStatus } from "@prisma/client";

export type SellerPerformanceDTO = {
    sellerName: string;
    sellerId: string;
    status: InvoiceStatus,
    totalRevenue: number,
    invoiceCount: number,
    totalItems: number,
    completedItems: number,
}