import { CreateInvoiceSchema } from "@/app/(protected)/live/_schema";
import { protectedProcedure } from "@/server/trpc/init";
import { InvoiceStatus, ItemStatus } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

function generateSKU(prefix = "SKU", length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${result}`;
}

async function createItems(db: any, invoiceId: string, items: any[]) {
    await db.item.createMany({
        data: items.map(d => ({
            price: d.price,
            categoryId: d.categoryId,
            invoiceId,
            status: ItemStatus.COMPLETED,
        }))
    })
}


export const createInvoice = protectedProcedure
    .input(CreateInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
        const db = ctx.db!

        const { items, customerName, dateIssued, sellerId, subTotal, tax, grandTotal, platformId } = input

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
                    platformId: platformId,
                    dateIssued: {
                        gte: startOfDay(new Date(dateIssued)),
                        lte: endOfDay(new Date(dateIssued)),
                    }
                }
            })

            if (!existingInvoiceOfTheDay) {
                const newInvoice = await db.invoice.create({
                    data: {
                        platformId: platformId,
                        status: InvoiceStatus.COMPLETED,
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

                await createItems(db, newInvoice.id, nonFreeItems);

                return {
                    message: "Successfully added invoice!"
                }
            }

            const updatedInvoice = await db.invoice.update({
                where: { id: existingInvoiceOfTheDay.id },
                data: {
                    subTotal: existingInvoiceOfTheDay.subTotal + subTotal,
                    tax: existingInvoiceOfTheDay.tax + tax,
                    grandTotal: existingInvoiceOfTheDay.grandTotal + grandTotal,
                    freebies: Math.floor(freebies + (nonFreeItems.length + existingInvoiceOfTheDay.freebies! / 3))
                }
            })

            await createItems(db, updatedInvoice.id, nonFreeItems);

            return {
                message: "Successfully added invoice to existing!"
            }

        } catch (error) {
            return {
                message: "Failed to create invoice: " + error,
            };
        }
    })