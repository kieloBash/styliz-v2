import { PrismaClient } from "@prisma/client";

export async function fetchItemCategoryPerformance(prisma: PrismaClient, from: string, to: string) {

    const grouped = await prisma.item.groupBy({
        by: ["categoryId", "status"],
        where: {
            createdAt: {
                gte: new Date(from),
                lte: new Date(to),
            },
        },
        _sum: { price: true },
        orderBy: {
            _sum: { price: "desc" },
        },
    })

    const categories = await prisma.itemCategory.findMany({
        // where: { id: { in: grouped.map((g) => g.categoryId) } },
        select: {
            id: true,
            name: true,
            icon: true,
            quickPrices: true,
            color: true,
        },
    })

    const result = categories.map((cat) => ({
        ...cat,
        totals: grouped
            .filter((g) => g.categoryId === cat.id)
            .map((g) => ({
                status: g.status,
                totalPrice: g._sum.price ?? 0,
            })),
    }))
// debugger
    return result;
}