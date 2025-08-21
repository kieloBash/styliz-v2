import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";

export const getCustomerList = protectedProcedure
    .input(SearchCustomerSchema)
    .query(async ({ input, ctx }) => {
        try {

            let query = {}
            if (input.name) {
                query = {
                    where: {
                        name: {
                            contains: input.name,
                            mode: "insensitive", // optional: makes search case-insensitive
                        },
                    },
                    take: input.limit
                }
            }

            const data = await ctx.db!.customer.findMany({
                ...query,
                select: { id: true, name: true },
            });

            return {
                message: "Successfuly fetched customers",
                payload: data,
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to fetch customers",
            };
        }
    });
