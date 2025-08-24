'use client'
import MainLoader from "@/components/global/loader"
import { DATE_FORMAT_SHORT } from "@/constants/formats"
import { trpc } from "@/server/trpc/client"
import { formatDate } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { useAdminDashboardStore } from "../../_stores/adminDashboardStore"
import AllInvoicesCard from "../all-invoices"
import { AdminBulkEditModal } from "./admin/bulk-edit-modal"
import AdminRecentCustomerCard from "./admin/recent-customers-card"
import AdminStatsCards from "./admin/stats-cards"
import AdminTopCustomerCard from "./admin/top-customers-card"

const AdminDashboard = () => {
    const searchParams = useSearchParams()
    const limit = searchParams.get("limit") ?? "10"
    const page = searchParams.get("page") ?? "1"
    const filterStatusParams = searchParams.get("status") ?? "all"
    const filterSearchParams = searchParams.get("search") ?? ""
    const filterFromDateParams = searchParams.get("from")
    const filterToDateParams = searchParams.get("to")
    const getFormattedDate = (date: Date | undefined) => date ? formatDate(date, DATE_FORMAT_SHORT) : undefined;

    const analytics = trpc.invoice.getDashboardAnalytics.useQuery({})
    const { recentCustomers, topCustomers } = useMemo(() => ({
        recentCustomers: analytics.data?.payload?.recentCustomers ?? [],
        topCustomers: analytics.data?.payload?.topCustomers ?? [],
    }), [analytics])

    const invoices = trpc.invoice.getList.useQuery({ limit: parseInt(limit), page: parseInt(page), customerName: filterSearchParams, status: filterStatusParams, from: getFormattedDate(filterFromDateParams ? new Date(filterFromDateParams) : undefined), to: getFormattedDate(filterToDateParams ? new Date(filterToDateParams) : undefined) });
    const filteredInvoices = useMemo(() => invoices.data?.payload ?? [], [invoices])

    const isLoading = useMemo(() => analytics.isLoading || invoices.isLoading, [analytics.isLoading, invoices.isLoading])

    const { actions, rowsSelected, isSelectingInvoice } = useAdminDashboardStore()

    if (isLoading) {
        return <MainLoader message="Fetching data analytics, please wait..." />
    }

    return (
        <>
            <AdminBulkEditModal />
            <div className="max-w-[90rem] mx-auto p-6 space-y-8">
                <AdminStatsCards />
                <div className="grid lg:grid-cols-6 grid-cols-1 gap-4">
                    <div className="lg:col-span-4 col-span-1">
                        <AllInvoicesCard
                            pageCount={invoices.data?.meta?.pageCount}
                            totalInvoices={invoices.data?.meta?.total}
                            data={filteredInvoices}
                            isLoading={isLoading}
                            rowsSelected={rowsSelected}
                            isSelectingInvoice={isSelectingInvoice}
                            clearSelected={() => { actions.setRowsSelected([]) }}
                            onBulkEdit={() => { actions.setIsEdittingBulk(true) }}
                            onSelectAll={() => { actions.setRowsSelected(filteredInvoices) }}
                        />
                    </div>
                    <div className="grid gap-6 lg:col-span-2 col-span-1">
                        <AdminTopCustomerCard data={topCustomers} />
                        <AdminRecentCustomerCard data={recentCustomers} />
                    </div>
                </div>
                {/* <InvoiceDataTable columns={columns} data={filteredInvoices} isLoading={isLoading} /> */}
            </div>
        </>
    )
}

export default AdminDashboard