import { InvoiceStatus, ItemStatus } from "@prisma/client";
import z from "zod";

const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
})

const ItemSchema = z.object({
    id: z.string(),
    itemId: z.string(),
    price: z.number().positive(),
    category: z.object({
        id: z.string(),
        name: z.string(),
    }),
    status: z.nativeEnum(ItemStatus)
})

export type UpdateInvoiceType = z.infer<typeof UpdateInvoiceSchema>;
export const UpdateInvoiceSchema = z.object({
    invoiceId: z.string(),
    freebies: z.number().positive(),
    dateIssued: z.string().optional(),
    status: z.nativeEnum(InvoiceStatus),
    platform: z.object({
        id: z.string(),
        name: z.string(),
    }),
    seller: UserSchema,
    customer: UserSchema,
    updatedItems: z.array(ItemSchema).min(1, "Invoice should have atleast a single item"),
    newItems: z.array(ItemSchema),
    removedItems: z.array(ItemSchema)
})