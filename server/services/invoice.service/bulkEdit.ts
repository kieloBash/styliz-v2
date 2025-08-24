import { BulkEditInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logger } from "@/utils/logger";

export const bulkEditInvoices = protectedProcedure
    .input(BulkEditInvoiceSchema)
    .mutation(async ({ input, ctx }): Promise<QueryPayloadType<any>> => {
        const { invoiceIds, status } = input;

        try {
            await ctx.db!.invoice.updateMany({
                where: { id: { in: invoiceIds.map((d) => d.id) } },
                data: { status }
            })

            return {
                message: `Successfully updated status of ${invoiceIds.length} invoices to ${status}`,
                success: true
            }
        } catch (error) {
            const message = "failed to fetch invoices";
            logger.error(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    })