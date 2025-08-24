import { SortType } from "@/types/global";
import { UserRole } from "@/types/roles";
import { InvoiceStatus, ItemStatus, PrismaClient } from "@prisma/client";
import { endOfMonth, isEqual, parseISO, startOfMonth, subMonths } from "date-fns";

export async function fetchActiveSellers(prisma: PrismaClient) {
    const value = await prisma.user.count({ where: { role: { roleName: UserRole.SELLER } } }) ?? 0;
    return { value }
}

export async function fetchTotalItems(prisma: PrismaClient, from: string, to: string) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to)

    const current = await prisma.item.count({
        where: {
            createdAt: {
                gte: fromDate,
                lte: toDate
            },
            status: ItemStatus.COMPLETED
        }
    })

    const currentValue = current ?? 0;
    const isFullMonth =
        isEqual(fromDate, startOfMonth(fromDate)) &&
        isEqual(toDate, endOfMonth(fromDate));

    if (!isFullMonth) {
        return {
            value: currentValue,
        };
    }

    const prevFrom = startOfMonth(subMonths(fromDate, 1));
    const prevTo = endOfMonth(subMonths(fromDate, 1));

    const prevTotal = await prisma.item.count({
        where: {
            createdAt: {
                gte: prevFrom,
                lte: prevTo,
            },
            status: ItemStatus.COMPLETED,
        },
    })

    const prevValue = prevTotal ?? 0;

    let change: number | null = null;
    if (prevValue > 0) {
        change = ((currentValue - prevValue) / prevValue) * 100;
    }

    return {
        prevValue,
        value: currentValue,
        change, // e.g. 12.5 means 12.5% higher, -5 means 5% lower
    }
}

export async function fetchTotalInvoices(prisma: PrismaClient, from: string, to: string) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to)

    const current = await prisma.invoice.count({
        where: {
            dateIssued: {
                gte: fromDate,
                lte: toDate
            },
            status: InvoiceStatus.COMPLETED
        }
    })

    const currentValue = current ?? 0;
    const isFullMonth =
        isEqual(fromDate, startOfMonth(fromDate)) &&
        isEqual(toDate, endOfMonth(fromDate));

    if (!isFullMonth) {
        return {
            value: currentValue,
        };
    }

    const prevFrom = startOfMonth(subMonths(fromDate, 1));
    const prevTo = endOfMonth(subMonths(fromDate, 1));

    const prevTotal = await prisma.invoice.count({
        where: {
            dateIssued: {
                gte: prevFrom,
                lte: prevTo,
            },
            status: InvoiceStatus.COMPLETED,
        },
    })

    const prevValue = prevTotal ?? 0;

    let change: number | null = null;
    if (prevValue > 0) {
        change = ((currentValue - prevValue) / prevValue) * 100;
    }

    return {
        prevValue,
        value: currentValue,
        change, // e.g. 12.5 means 12.5% higher, -5 means 5% lower
    }
}

export async function fetchTotalRevenue(prisma: PrismaClient, from: string, to: string) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to)

    const current = await prisma.invoice.aggregate({
        _sum: { subTotal: true },
        where: {
            dateIssued: {
                gte: fromDate,
                lte: toDate
            },
            status: InvoiceStatus.COMPLETED
        }
    })

    const currentRevenue = current._sum.subTotal ?? 0;
    const isFullMonth =
        isEqual(fromDate, startOfMonth(fromDate)) &&
        isEqual(toDate, endOfMonth(fromDate));

    if (!isFullMonth) {
        return {
            value: currentRevenue,
        };
    }

    const prevFrom = startOfMonth(subMonths(fromDate, 1));
    const prevTo = endOfMonth(subMonths(fromDate, 1));

    const prevTotal = await prisma.invoice.aggregate({
        _sum: { subTotal: true },
        where: {
            dateIssued: {
                gte: prevFrom,
                lte: prevTo,
            },
            status: "COMPLETED",
        },
    });

    const prevRevenue = prevTotal._sum.subTotal ?? 0;

    let change: number | null = null;
    if (prevRevenue > 0) {
        change = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    }

    return {
        prevValue: prevRevenue,
        value: currentRevenue,
        change, // e.g. 12.5 means 12.5% higher, -5 means 5% lower
    }
}

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