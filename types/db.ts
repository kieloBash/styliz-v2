import { Customer, Invoice, Item, ItemCategory, Platform, User } from "@prisma/client";

export type FullInvoiceType = Invoice & {
    customer: Customer,
    seller: User,
    items: FullItemType[],
    platform: Platform
}

export type FullItemType = Item & {
    category: ItemCategory
}