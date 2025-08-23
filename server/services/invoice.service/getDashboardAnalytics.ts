import { protectedProcedure } from "@/server/trpc/init";
import { fetchRecentCustomers, fetchTopCustomers } from "./queries";
import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { QueryPayloadType } from "@/types/global";
import { FullCustomerType } from "@/types/db";

type PayloadType = {
    topCustomers: FullCustomerType[],
    recentCustomers: FullCustomerType[],
}

export const getDashboardAnalytics = protectedProcedure
    .input(SearchCustomerSchema)
    .query(async ({ ctx, input }): Promise<QueryPayloadType<PayloadType>> => {
        const [topCustomers, recentCustomers] = await Promise.all([
            fetchTopCustomers(ctx.db!, input.limit ?? 5),
            fetchRecentCustomers(ctx.db!, input.limit ?? 5),
        ])

        return {
            success: true,
            message: "Successfully fetched dashboard analytics",
            payload: { topCustomers, recentCustomers } as any
        }
    })