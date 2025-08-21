import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";
import { Platform } from "@prisma/client";

export const getPlatformList = protectedProcedure
    .query(async ({ ctx }): Promise<QueryPayloadType<Platform[]>> => {
        try {
            const payload = await ctx.db!.platform.findMany({});

            return {
                success: true,
                message: "Successfully fetched platforms",
                payload
            }
        } catch (error) {
            const message = "failed to fetch platforms";
            logger.info(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    })