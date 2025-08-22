import { SearchInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { DATE_FORMAT_SHORT } from "@/constants/formats";
import { protectedProcedure } from "@/server/trpc/init";
import { FullInvoiceType } from "@/types/db";
import { QueryPayloadType } from "@/types/global";
import { UserRole } from "@/types/roles";
import { logger } from "@/utils/logger";
import { endOfDay, parse, startOfDay } from "date-fns";

export const getInvoiceList = protectedProcedure
    .input(SearchInvoiceSchema)
    .query(async ({ input, ctx }): Promise<QueryPayloadType<FullInvoiceType[]>> => {
        try {
            const { customerName, status, limit, page, from, to } = input;
            const currentUser = ctx.session.user;

            const where: any = {
                ...(from && to && {
                    dateIssued: {
                        gte: startOfDay(parse(from, DATE_FORMAT_SHORT, new Date())),
                        lte: endOfDay(parse(to, DATE_FORMAT_SHORT, new Date()))
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
                ...currentUser.role === UserRole.SELLER && { sellerId: currentUser.id }
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
                            select: { price: true, categoryId: true, category: { select: { name: true } } },
                        },
                        platform: {
                            select: { name: true }
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
            logger.info(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    });

