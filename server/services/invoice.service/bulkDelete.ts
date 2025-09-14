import { BulkDeleteInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";

export const bulkDeleteInvoices = protectedProcedure
    .input(BulkDeleteInvoiceSchema)
    .mutation(async ({ input, ctx }): Promise<QueryPayloadType<any>> => {
        const { invoiceIds } = input;

        try {
            await ctx.db!.invoice.deleteMany({
                where: { id: { in: invoiceIds.map((d) => d.id) } },
            })

            return {
                message: `Successfully deleted ${invoiceIds.length} invoices!`,
                success: true
            }
        } catch (error) {
            const message = "failed to delete invoices";
            logger.error(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    })