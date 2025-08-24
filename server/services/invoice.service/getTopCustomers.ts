import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";
import { fetchTopCustomers } from "./queries";
import { startOfMonth, endOfMonth } from "date-fns";

export const getTopCustomers = protectedProcedure
    .input(SearchCustomerSchema)
    .query(async ({ input, ctx }): Promise<QueryPayloadType<any[]>> => {
        try {
            const from = input.from ?? startOfMonth(new Date()).toISOString()
            const to = input.to ?? endOfMonth(new Date()).toISOString()
            const customers = await fetchTopCustomers(ctx.db!, input.limit ?? 5, from, to);
            return { success: true, message: "Successfully fetched top spending customers", payload: customers };
        } catch (error) {
            const message = "failed to fetch top customers";
            logger.error(`Error: ${message}`, { error });
            return { success: false, message };
        }
    });