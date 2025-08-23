import { SearchCustomerSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";
import { fetchTopCustomers } from "./queries";

export const getTopCustomers = protectedProcedure
    .input(SearchCustomerSchema)
    .query(async ({ input, ctx }): Promise<QueryPayloadType<any[]>> => {
        try {
            const customers = await fetchTopCustomers(ctx.db!, input.limit ?? 5);
            return { success: true, message: "Successfully fetched top spending customers", payload: customers };
        } catch (error) {
            const message = "failed to fetch top customers";
            logger.info(`Error: ${message}`, { error });
            return { success: false, message };
        }
    });