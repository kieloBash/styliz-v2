import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";
import { FullCustomerType } from "@/types/db";
import { QueryPayloadType, SortType } from "@/types/global";

export const getCustomerList = protectedProcedure
    .input(SearchCustomerSchema)
    .query(async ({ input, ctx }): Promise<QueryPayloadType<FullCustomerType[]>> => {
        try {
            const { name, limit, sort, orderBy: orderByField } = input;

            // ✅ Base query
            let query: Record<string, any> = {};
            if (name) {
                query = {
                    where: {
                        name: {
                            contains: name,
                            mode: "insensitive",
                        },
                    },
                    take: limit,
                };
            }

            const sortBy = sort ?? SortType.ASC;
            const allowedOrderBy = ["id", "name", "createdAt"];

            // ✅ Normal orderBy (id, name, createdAt)
            let orderBy: Record<string, "asc" | "desc"> | undefined;
            if (orderByField && allowedOrderBy.includes(orderByField)) {
                orderBy = { [orderByField]: sortBy };
            }

            const data = await ctx.db!.customer.findMany({
                ...query,
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
                        orderBy: { dateIssued: "desc" },
                    },
                },
                orderBy,
            });

            return {
                success: true,
                message: "Successfully fetched customers",
                payload: data as any,
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to fetch customers",
            };
        }
    });
