import { TRPCRouterRecord } from "@trpc/server";
import { createItemCategory } from "./create";
import { getCategoriesList } from "./getList";

export const categoriesRoute = {
    getList: getCategoriesList,
    create: createItemCategory,
} satisfies TRPCRouterRecord;