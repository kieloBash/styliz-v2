import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { adminProcedure } from "@/server/trpc/init";
import { FullCustomerType } from "@/types/db";
import { AnalyticsChangeData, QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";
import { endOfMonth, startOfMonth } from "date-fns";
import { fetchRecentCustomers, fetchSellerPerformance, fetchTopCustomers, fetchTotalCustomers, fetchTotalInvoices, fetchTotalItems, fetchTotalRevenue } from "./queries";
import { SellerPerformanceDTO } from "@/types/dto/seller-performance";

type PayloadType = {
    topCustomers: FullCustomerType[],
    recentCustomers: FullCustomerType[],
    totalRevenue: AnalyticsChangeData,
    totalItems: AnalyticsChangeData,
    totalInvoices: AnalyticsChangeData,
    totalCustomers: AnalyticsChangeData,
    sellerPerformance: SellerPerformanceDTO[]
}

export const getDashboardAnalytics = adminProcedure
    .input(SearchCustomerSchema)
    .query(async ({ ctx, input }): Promise<QueryPayloadType<PayloadType>> => {
        try {
            const from = input.from ?? startOfMonth(new Date()).toISOString()
            const to = input.to ?? endOfMonth(new Date()).toISOString()
            const [topCustomers, recentCustomers, totalRevenue, totalItems, totalInvoices, totalCustomers, sellerPerformance] = await Promise.all([
                fetchTopCustomers(ctx.db!, input.limit ?? 5),
                fetchRecentCustomers(ctx.db!, input.limit ?? 5),
                fetchTotalRevenue(ctx.db!, from, to),
                fetchTotalItems(ctx.db!, from, to),
                fetchTotalInvoices(ctx.db!, from, to),
                fetchTotalCustomers(ctx.db!, from, to),
                fetchSellerPerformance(ctx.db!, from, to),
            ])

            return {
                success: true,
                message: "Successfully fetched dashboard analytics",
                payload: { topCustomers, recentCustomers, totalRevenue, totalItems, totalInvoices, totalCustomers, sellerPerformance } as any
            }

        } catch (error) {
            const message = "failed to fetch dashboard analytics";
            logger.error(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    })