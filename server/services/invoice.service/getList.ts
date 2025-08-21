import { SearchInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { protectedProcedure } from "@/server/trpc/init";

export const getInvoiceList = protectedProcedure
    .input(SearchInvoiceSchema)
    .query(async ({ input, ctx }) => {
        try {
            const { customerName, status, limit, page } = input;

            const where: any = {
                ...(status && status !== "all" ? { status: status } : {}),
                ...(customerName
                    ? {
                        customer: {
                            name: {
                                contains: customerName,
                                mode: "insensitive",
                            },
                        },
                    }
                    : {}),
            };

            const [data, total] = await Promise.all([
                ctx.db!.invoice.findMany({
                    where,
                    select: {
                        id: true,
                        sku: true,
                        customer: {
                            select: { id: true, name: true },
                        },
                        status: true,
                        items: {
                            select: { price: true, categoryId: true },
                        },
                        dateIssued: true,
                        subTotal: true,
                    },
                    take: limit,
                    skip: (page - 1) * limit,
                    orderBy: {
                        dateIssued: "desc",
                    },
                }),
                ctx.db!.invoice.count({ where }),
            ]);

            return {
                message: "Successfully fetched invoices",
                payload: data,
                meta: {
                    total,
                    page,
                    pageCount: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to fetch invoices",
            };
        }
    });

