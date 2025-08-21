import { TRPCRouterRecord } from "@trpc/server";
import { getPlatformList } from "./getList";

export const platformRoute = {
    getList: getPlatformList
} satisfies TRPCRouterRecord;