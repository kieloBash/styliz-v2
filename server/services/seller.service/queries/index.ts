import { SellerPerformanceDTO } from "@/types/dto/seller-performance";
import { UserRole } from "@/types/roles";
import { InvoiceStatus, ItemStatus, PrismaClient } from "@prisma/client";
import { parseISO } from "date-fns";

export async function fetchSellerPerformance(prisma: PrismaClient, from: string, to: string) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);

    const sellersWithInvoices = await prisma.user.findMany({
        where: {
            role: { roleName: UserRole.SELLER }
        },
        select: {
            id: true, name: true,
            invoices: {
                select: {
                    id: true,
                    subTotal: true,
                    items: { select: { id: true, status: true } },
                    status: true,
                },
                where: {
                    dateIssued: {
                        gte: fromDate,
                        lte: toDate,
                    },
                },
            }
        }
    });


    const performance = sellersWithInvoices.reduce((acc, seller) => {
        const key = `${seller.id}`;

        if (!acc[key]) {
            acc[key] = {
                sellerId: seller.id,
                sellerName: seller.name,
                totalRevenue: 0,
                totalLoss: 0,
                totalInvoices: 0,
                totalItems: 0,
                itemMap: {} as Record<ItemStatus, number>,
                invoiceMap: {} as Record<InvoiceStatus, number>,
            };
        }

        // Aggregate invoices
        seller.invoices.forEach((invoice) => {
            acc[key].totalInvoices += 1;
            if (invoice.status === InvoiceStatus.COMPLETED)
                acc[key].totalRevenue += invoice.subTotal;
            else
                acc[key].totalLoss += invoice.subTotal;

            // Track invoice statuses
            if (!acc[key].invoiceMap[invoice.status]) {
                acc[key].invoiceMap[invoice.status] = 0;
            }
            acc[key].invoiceMap[invoice.status] += 1;

            // Track items and statuses
            invoice.items.forEach((item) => {
                acc[key].totalItems += 1;

                if (!acc[key].itemMap[item.status]) {
                    acc[key].itemMap[item.status] = 0;
                }
                acc[key].itemMap[item.status] += 1;
            });
        });

        return acc;
    }, {} as Record<string, SellerPerformanceDTO>);

    return Object.values(performance);
}