import { TRPCRouterRecord } from "@trpc/server";
import { getCategoriesList } from "./getList";

export const categoriesRoute = {
    getList: getCategoriesList
} satisfies TRPCRouterRecord;