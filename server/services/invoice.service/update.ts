import { UpdateInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logError } from "@/utils/error";
import { InvoiceStatus, ItemStatus } from "@prisma/client";
import { createItems, deleteItems, updateItems } from "./queries";

const SUCCESS_MESSAGE = "Successfully updated invoice";
const FAILED_MESSAGE = "Error on updating invoice";

export const updateInvoice = protectedProcedure
    .input(UpdateInvoiceSchema)
    .mutation(async ({ ctx, input }): Promise<QueryPayloadType<any>> => {
        try {
            const completedPrices = [
                ...input.updatedItems.filter((i) => i.status === ItemStatus.COMPLETED),
                ...input.newItems.filter((i) => i.status === ItemStatus.COMPLETED),
            ].map((i) => i.price);

            const subTotal = completedPrices.reduce((sum, p) => sum + p, 0);

            let newStatus = input.status;
            let forceStatusChange = false;
            let updatedFreebies = 0;

            const oldInvoice = await ctx.db!.invoice.findFirstOrThrow({
                where: { id: input.invoiceId },
                select: { status: true, freebies: true }
            }).catch(() => {
                throw new Error("Invoice not found!");
            })

            if (input.freebies !== oldInvoice.freebies) {
                updatedFreebies = input.freebies;
            } else {
                // updatedFreebies = Math.floor((input.newItems.filter((i) => i.status === ItemStatus.COMPLETED).length + input.updatedItems.filter((i) => i.status === ItemStatus.COMPLETED).length) / 3) + (oldInvoice.freebies ?? 0)
                updatedFreebies = (oldInvoice.freebies ?? 0);
            }

            if (newStatus !== InvoiceStatus.COMPLETED && oldInvoice.status !== newStatus) {
                forceStatusChange = true
            }

            // if (oldInvoice.status === newStatus) {
            //     newStatus = input.updatedItems.some((d) => d.status !== ItemStatus.COMPLETED) ||
            //         input.newItems.some((d) => d.status !== ItemStatus.COMPLETED)
            //         ? InvoiceStatus.RTS
            //         : InvoiceStatus.COMPLETED;
            // }

            if (input.removedItems.length > 0) {
                deleteItems(ctx.db!, input.removedItems.map((d) => d.itemId));
            }

            if (input.newItems.length > 0) {
                await createItems(ctx.db!, input.newItems.map((d) => ({
                    price: d.price,
                    categoryId: d.category.id,
                    status: forceStatusChange ? newStatus : d.status,
                    invoiceId: input.invoiceId,
                })), input.invoiceId);
            }

            if (input.updatedItems.length > 0) {
                if (forceStatusChange) {
                    await updateItems(ctx.db!, input.updatedItems.map((d) => ({ ...d, status: newStatus })));
                } else {
                    await updateItems(ctx.db!, input.updatedItems);
                }
            }

            await ctx.db!.$transaction(async (tx) => {
                // Update invoice
                await tx.invoice.update({
                    where: { id: input.invoiceId },
                    data: {
                        status: newStatus,
                        ...(input.dateIssued && { dateIssued: new Date(input.dateIssued) }),
                        platformId: input.platform.id,
                        sellerId: input.seller.id,
                        subTotal,
                        freebies: updatedFreebies
                    },
                });
            });

            return { success: true, message: SUCCESS_MESSAGE };
        } catch (error) {
            console.error(error)
            return logError(error, FAILED_MESSAGE);
        }
    });
