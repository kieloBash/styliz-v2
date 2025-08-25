import { SearchInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { parseDate } from "@/lib/utils";
import { protectedProcedure } from "@/server/trpc/init";
import { FullInvoiceType } from "@/types/db";
import { QueryPayloadType } from "@/types/global";
import { UserRole } from "@/types/roles";
import { logger } from "@/utils/logger";
import { endOfDay, startOfDay } from "date-fns";
import { se } from "date-fns/locale";

export const getInvoiceList = protectedProcedure
    .input(SearchInvoiceSchema)
    .query(async ({ input, ctx }): Promise<QueryPayloadType<FullInvoiceType[]>> => {
        try {
            const { customerName, status, limit, page, from, to, sellerId } = input;
            const currentUser = ctx.session.user;

            const where: any = {
                ...(from && to && {
                    dateIssued: {
                        gte: startOfDay(parseDate({ date: from })),
                        lte: endOfDay(parseDate({ date: to }))
                    }
                }),
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
                ...currentUser.role === UserRole.SELLER && { sellerId: currentUser.id },
                ...((sellerId !== "all" && sellerId) && { sellerId })
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
                        seller: {
                            select: { id: true, name: true }
                        },
                        status: true,
                        items: {
                            select: { id: true, price: true, categoryId: true, status: true, category: { select: { name: true, id: true } } },
                        },
                        platform: {
                            select: { name: true, id: true }
                        },
                        dateIssued: true,
                        subTotal: true,
                        freebies: true,
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
                success: true,
                message: "Successfully fetched invoices",
                payload: data as any,
                meta: {
                    total,
                    page,
                    pageCount: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            const message = "failed to fetch invoices";
            logger.error(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    });

