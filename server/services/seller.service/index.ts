import { TRPCRouterRecord } from "@trpc/server";
import { getSellerList } from "./getList";
import { createSeller } from "./create";
export const sellerRouter = {
    getList: getSellerList,
    create: createSeller
} satisfies TRPCRouterRecord;