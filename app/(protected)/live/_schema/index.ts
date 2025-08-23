import { SortType } from "@/types/global";
import z from "zod";

export type SearchCustomerType = z.infer<typeof SearchCustomerSchema>;
export const SearchCustomerSchema = z.object({
    name: z.string().optional(),
    limit: z.number().optional().default(5),
    sort: z.nativeEnum(SortType).optional(),
    orderBy: z.string().optional(),
})

export type CreateInvoiceType = z.infer<typeof CreateInvoiceSchema>;
export const CreateInvoiceSchema = z.object({
    platformId: z.string().min(1, "Platform is required"),
    customerName: z.string().min(1, "Customer name is required"),
    sellerId: z.string().min(1, "Seller ID is required"),
    dateIssued: z.string().datetime(),
    subTotal: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    grandTotal: z.number().nonnegative(),
    items: z.array(
        z.object({
            categoryId: z.string(),
            price: z.number().nonnegative(),
            isFreebie: z.boolean(),
        })
    ).min(1, "At least one item is required"),
});

