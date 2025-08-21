import { TRPCRouterRecord } from "@trpc/server";
import { createInvoice } from "./create";
import { getInvoiceList } from "./getList";

export const invoiceRoute = {
    create: createInvoice,
    getList: getInvoiceList
} satisfies TRPCRouterRecord;