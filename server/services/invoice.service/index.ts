import { TRPCRouterRecord } from "@trpc/server";
import { bulkEditInvoices } from "./bulkEdit";
import { createInvoice } from "./create";
import { getInvoiceList } from "./getList";

export const invoiceRoute = {
    create: createInvoice,
    getList: getInvoiceList,
    bulkUpdate: bulkEditInvoices,
} satisfies TRPCRouterRecord;