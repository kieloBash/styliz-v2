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
