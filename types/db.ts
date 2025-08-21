import { Customer, Invoice, Item, Platform, User } from "@prisma/client";

export type FullInvoiceType = Invoice & {
    customer: Customer,
    seller: User,
    items: Item[],
    platform: Platform
}