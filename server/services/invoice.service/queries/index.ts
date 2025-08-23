import { SortType } from "@/types/global";
import { PrismaClient } from "@prisma/client";

export async function fetchTopCustomers(prisma: PrismaClient, limit = 5) {
    const grouped = await prisma.invoice.groupBy({
        by: ["customerId"],
        _sum: { subTotal: true },
        orderBy: { _sum: { subTotal: SortType.DESC as any } },
        take: limit,
    });

    const customerIds = grouped.map((g) => g.customerId);

    const customers = await prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: {
            id: true,
            name: true,
            createdAt: true,
            invoices: {
                select: {
                    subTotal: true,
                    dateIssued: true,
                    items: { select: { id: true } },
                },
                orderBy: { dateIssued: SortType.DESC },
            },
        },
    });

    // preserve ranking
    return grouped.map((ranked) => {
        const existing = customers.find((c) => c.id === ranked.customerId);
        return existing ? { ...existing, totalSpent: ranked._sum.subTotal ?? 0 } : null;
    }).filter(Boolean);
}

export async function fetchRecentCustomers(prisma: PrismaClient, limit = 5) {
    return prisma.customer.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            invoices: {
                select: {
                    subTotal: true,
                    dateIssued: true,
                    items: { select: { id: true } },
                },
                orderBy: { dateIssued: SortType.DESC },
            },
        },
        orderBy: { createdAt: SortType.DESC },
        take: limit,
    });
}