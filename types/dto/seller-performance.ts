import { InvoiceStatus, ItemStatus } from "@prisma/client";

export type SellerPerformanceDTO = {
    sellerId: string;
    sellerName: string;
    totalRevenue: number,
    totalLoss: number,
    totalInvoices: number,
    totalItems: number,
    itemMap: Record<ItemStatus, number>
    invoiceMap: Record<InvoiceStatus, number>
}