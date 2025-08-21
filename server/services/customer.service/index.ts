import { TRPCRouterRecord } from "@trpc/server";
import { getCustomerList } from "./getList";

export const customerRoute = {
    getList: getCustomerList
} satisfies TRPCRouterRecord;