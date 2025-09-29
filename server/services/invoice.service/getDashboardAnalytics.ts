import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { adminProcedure } from "@/server/trpc/init";
import { FullCustomerType } from "@/types/db";
import { SellerPerformanceDTO } from "@/types/dto/seller-performance";
import { AnalyticsChangeData, QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { fetchSellerPerformance } from "../seller.service/queries";
import { fetchRecentCustomers, fetchTopCustomers, fetchTotalCustomers, fetchTotalInvoices, fetchTotalItems, fetchTotalRevenue } from "./queries";
import { fetchItemCategoryPerformance } from "../categories.service/queries";
import { ItemPerformanceDTO } from "@/types/dto/item-category-performance";

type PayloadType = {
    topCustomers: FullCustomerType[],
    recentCustomers: FullCustomerType[],
    totalRevenue: AnalyticsChangeData,
    totalItems: AnalyticsChangeData,
    totalInvoices: AnalyticsChangeData,
    totalCustomers: AnalyticsChangeData,
    sellerPerformance: SellerPerformanceDTO[]
    itemPerformance: ItemPerformanceDTO[]
}

export const getDashboardAnalytics = adminProcedure
    .input(SearchCustomerSchema)
    .query(async ({ ctx, input }): Promise<QueryPayloadType<PayloadType>> => {
        try {
            const from = input.from ? startOfDay(input.from).toISOString() : startOfMonth(new Date()).toISOString()
            const to = input.to ? endOfDay(input.to).toISOString() : endOfMonth(new Date()).toISOString()

            const [topCustomers, recentCustomers, totalRevenue, totalItems, totalInvoices, totalCustomers, sellerPerformance, itemPerformance] = await Promise.all([
                fetchTopCustomers(ctx.db!, input.limit ?? 5, from, to),
                fetchRecentCustomers(ctx.db!, input.limit ?? 5, from, to),
                fetchTotalRevenue(ctx.db!, from, to),
                fetchTotalItems(ctx.db!, from, to),
                fetchTotalInvoices(ctx.db!, from, to),
                fetchTotalCustomers(ctx.db!, from, to),
                fetchSellerPerformance(ctx.db!, from, to),
                fetchItemCategoryPerformance(ctx.db!, from, to),
            ])

            return {
                success: true,
                message: "Successfully fetched dashboard analytics",
                payload: { topCustomers, recentCustomers, totalRevenue, totalItems, totalInvoices, totalCustomers, sellerPerformance, itemPerformance } as any
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