import { protectedProcedure } from "@/server/trpc/init";
import { UserRole } from "@/types/roles";

export const getSellerList = protectedProcedure.query(async ({ ctx }) => {
    try {
        const sellers = await ctx.db!.user.findMany({
            where: { role: { roleName: UserRole.SELLER } },
            select: { id: true, name: true, email: true },
        });

        return {
            message: "Failed to fetch sellers",
            payload: sellers,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch sellers",
        };
    }
});
