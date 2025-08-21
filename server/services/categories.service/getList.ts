import { protectedProcedure } from "@/server/trpc/init";

export const getCategoriesList = protectedProcedure
    .query(async ({ ctx }) => {
        try {
            const data = await ctx.db!.itemCategory.findMany({})

            return {
                message: "Successfuly fetched categories",
                payload: data
            }
        } catch (error) {
            return {
                success: false,
                message: "Failed to fetch categories",
            };
        }
    })