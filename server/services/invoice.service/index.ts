import { TRPCRouterRecord } from "@trpc/server";
import { bulkEditInvoices } from "./bulkEdit";
import { createInvoice } from "./create";
import { getDashboardAnalytics } from "./getDashboardAnalytics";
import { getInvoiceList } from "./getList";
import { getRecentCustomers } from "./getRecentCustomers";
import { getTopCustomers } from "./getTopCustomers";
import { updateInvoice } from "./update";

export const invoiceRoute = {
    create: createInvoice,
    update: { invoice: updateInvoice },
    getList: getInvoiceList,
    bulkUpdate: bulkEditInvoices,
    getRecentCustomers: getRecentCustomers,
    getTopCustomers: getTopCustomers,
    getDashboardAnalytics: getDashboardAnalytics
} satisfies TRPCRouterRecord;