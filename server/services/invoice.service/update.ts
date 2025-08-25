import { UpdateInvoiceSchema } from "@/app/(protected)/dashboard/_schemas";
import { protectedProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logError } from "@/utils/error";
import { InvoiceStatus, ItemStatus } from "@prisma/client";

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

            await ctx.db!.$transaction(async (tx) => {
                // Remove items
                if (input.removedItems.length > 0) {
                    const { count } = await tx.item.deleteMany({
                        where: { id: { in: input.removedItems.map((d) => d.itemId) } },
                    });
                }

                // Add new items
                if (input.newItems.length > 0) {
                    await tx.item.createMany({
                        data: input.newItems.map((d) => ({
                            price: d.price,
                            categoryId: d.category.id,
                            status: d.status,
                            invoiceId: input.invoiceId,
                        })),
                    });
                }

                // Update existing items (individually, safer than updateMany with mapped data)
                if (input.updatedItems.length > 0) {
                    await Promise.all(
                        input.updatedItems.map((d) =>
                            tx.item.update({
                                where: { id: d.itemId },
                                data: {
                                    price: d.price,
                                    categoryId: d.category.id,
                                    status: d.status,
                                },
                            })
                        )
                    );
                }

                // Update invoice
                await tx.invoice.update({
                    where: { id: input.invoiceId },
                    data: {
                        status:
                            input.updatedItems.some((d) => d.status !== ItemStatus.COMPLETED) ||
                                input.newItems.some((d) => d.status !== ItemStatus.COMPLETED)
                                ? InvoiceStatus.RTS
                                : InvoiceStatus.COMPLETED,
                        ...(input.dateIssued && { dateIssued: new Date(input.dateIssued) }),
                        platformId: input.platform.id,
                        sellerId: input.seller.id,
                        subTotal,
                        freebies: Math.floor((input.updatedItems.filter((i) => i.status === ItemStatus.COMPLETED).length + input.newItems.filter((i) => i.status === ItemStatus.COMPLETED).length) / 3)
                    },
                });
            });

            return { success: true, message: SUCCESS_MESSAGE };
        } catch (error) {
            console.error(error)
            return logError(error, FAILED_MESSAGE);
        }
    });
