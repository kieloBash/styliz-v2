import { ItemCategory, ItemStatus } from "@prisma/client";

export type ItemPerformanceDTO = ItemCategory & {
    totals: { status: ItemStatus, totalPrice: number }[]
}