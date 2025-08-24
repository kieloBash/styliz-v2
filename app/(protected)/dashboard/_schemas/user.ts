import { InvoiceStatus } from "@prisma/client";
import z from "zod";

export type SearchInvoiceType = z.infer<typeof SearchInvoiceSchema>;
export const SearchInvoiceSchema = z.object({
    customerName: z.string().optional(),
    status: z.string().optional(),
    to: z.string().optional(),
    from: z.string().optional(),
    limit: z.number().optional().default(5),
    page: z.number().optional().default(1),
})

export type BulkEditInvoiceType = z.infer<typeof BulkEditInvoiceSchema>;
export const BulkEditInvoiceSchema = z.object({
    invoiceIds: z.object({
        id: z.string(),
    }).array().min(1, "must have at least 1 selected invoice to edit"),
    status: z.nativeEnum(InvoiceStatus)
})

export type NewSellerSchemaType = z.infer<typeof NewSellerSchema>;
export const NewSellerSchema = z.object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().min(1, "Email is required!"),
    password: z.string().min(1, "Password is required!"),
})
