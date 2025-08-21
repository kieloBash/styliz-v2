import { CreateInvoiceSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";
import { InvoiceStatus } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

function generateSKU(prefix = "SKU", length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${result}`;
}

export const createInvoice = protectedProcedure
    .input(CreateInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
        const db = ctx.db!

        const { items, customerName, dateIssued, sellerId, subTotal, tax, grandTotal } = input

        try {
            let customer = await db.customer.findFirst({ where: { name: customerName } })
            if (!customer) {
                customer = await db.customer.create({ data: { name: customerName } })
            }

            const nonFreeItems = items.filter(d => !d.isFreebie);
            const freebies = items.length - nonFreeItems.length;

            const existingInvoiceOfTheDay = await db.invoice.findFirst({
                where: {
                    sellerId: sellerId,
                    customerId: customer.id,
                    dateIssued: {
                        gte: startOfDay(new Date(dateIssued)),
                        lte: endOfDay(new Date(dateIssued)),
                    }
                }
            })

            if (!existingInvoiceOfTheDay) {
                const newInvoice = await db.invoice.create({
                    data: {
                        status: InvoiceStatus.PENDING,
                        subTotal,
                        tax,
                        grandTotal,
                        dateIssued: new Date(dateIssued),
                        dateDelivered: new Date(dateIssued),
                        sku: generateSKU(),
                        customerId: customer.id,
                        sellerId: sellerId,
                        freebies: Math.floor(freebies + (nonFreeItems.length / 3))
                    }
                })

                await db.item.createMany({
                    data: nonFreeItems.map(d => ({
                        price: d.price,
                        categoryId: d.categoryId,
                        invoiceId: newInvoice.id
                    }))
                })
            }

            return {
                message: "Successfully added invoice!"
            }
        } catch (error) {
            return {
                message: "Failed to create invoice: " + error,
            };
        }
    })