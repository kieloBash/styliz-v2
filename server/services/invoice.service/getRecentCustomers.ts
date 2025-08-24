import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";
import { fetchRecentCustomers } from "./queries";
import { startOfMonth, endOfMonth } from "date-fns";

export const getRecentCustomers = protectedProcedure
    .input(SearchCustomerSchema)
    .query(async ({ input, ctx }): Promise<QueryPayloadType<any[]>> => {
        try {
            const from = input.from ?? startOfMonth(new Date()).toISOString()
            const to = input.to ?? endOfMonth(new Date()).toISOString()
            const customers = await fetchRecentCustomers(ctx.db!, input.limit ?? 5, from, to);
            return { success: true, message: "Successfully fetched recent customers", payload: customers };
        } catch (error) {
            const message = "failed to fetch recent customers";
            logger.error(`Error: ${message}`, { error });
            return { success: false, message };
        }
    });