import { TRPCRouterRecord } from "@trpc/server";
import { getSellerList } from "./getList";
export const sellerRouter = {
    getList: getSellerList
} satisfies TRPCRouterRecord;