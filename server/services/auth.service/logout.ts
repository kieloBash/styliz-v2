import { createLogoutAuditLog } from "@/lib/audit-logs";
import { publicProcedure } from "@/server/trpc/init";
import { logger } from "@/utils/logger";

export const logout = publicProcedure
    .mutation(async ({ ctx }) => {
        if (!ctx.session?.user) return;
        logger.info("Called logout publicProcedure", { userId: ctx.session?.user?.id });

        await createLogoutAuditLog({
            userId: ctx.session.user.id,
            metadata: {
                timestamp: new Date().toISOString(),
                source: "manual",
            },
        });

        return { success: true };
    });
