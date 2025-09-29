'use client'
import MainLoader from "@/components/global/loader"
import { useLoading } from "@/components/providers/loading-provider"
import { DATE_FORMAT_SHORT } from "@/constants/formats"
import { showToast } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import { format, formatDate } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { useAdminDashboardStore } from "../../_stores/adminDashboardStore"
import AllInvoicesCard from "../all-invoices"
import EditInvoiceModal from "../edit-invoice-modal"
import { AdminBulkEditModal } from "./admin/bulk-edit-modal"
import { CategoryBreakdownCard } from "./admin/category-breakdown-card"
import { columns } from "./admin/columns"
import AdminRecentCustomerCard from "./admin/recent-customers-card"
import AdminSellerBreakdownCard from "./admin/seller-breakdown"
import AdminStatsCards from "./admin/stats-cards"
import AdminTopCustomerCard from "./admin/top-customers-card"

const AdminDashboard = () => {
    const searchParams = useSearchParams()
    const limit = searchParams.get("limit") ?? "40"
    const page = searchParams.get("page") ?? "1"
    const filterStatusParams = searchParams.get("status") ?? "all"
    const filterSearchParams = searchParams.get("search") ?? ""
    const filterFromDateParams = searchParams.get("from") ?? format(new Date, "yyyy-MM-dd");
    const filterToDateParams = searchParams.get("to") ?? format(new Date, "yyyy-MM-dd");
    const filterSellerIdParams = searchParams.get("sellerId") ?? undefined

    const getFormattedDate = (date: Date | undefined) => date ? formatDate(date, DATE_FORMAT_SHORT) : undefined;

    const analytics = trpc.invoice.getDashboardAnalytics.useQuery({
        from: filterFromDateParams ? new Date(filterFromDateParams).toISOString() : new Date().toISOString(),
        to: filterToDateParams ? new Date(filterToDateParams).toISOString() : new Date().toISOString(),
    })

    const { recentCustomers, topCustomers, totalRevenue, totalItems, totalInvoices, totalCustomers, sellerPerformance, itemPerformance } = useMemo(() => ({
        recentCustomers: analytics.data?.payload?.recentCustomers ?? [],
        topCustomers: analytics.data?.payload?.topCustomers ?? [],
        totalRevenue: analytics.data?.payload?.totalRevenue,
        totalItems: analytics.data?.payload?.totalItems,
        totalInvoices: analytics.data?.payload?.totalInvoices,
        totalCustomers: analytics.data?.payload?.totalCustomers,
        sellerPerformance: analytics.data?.payload?.sellerPerformance ?? [],
        itemPerformance: analytics.data?.payload?.itemPerformance ?? []
    }), [analytics])

    const invoices = trpc.invoice.getList.useQuery({
        limit: parseInt(limit),
        page: parseInt(page),
        customerName: filterSearchParams,
        status: filterStatusParams,
        from: getFormattedDate(filterFromDateParams ? new Date(filterFromDateParams) : new Date()),
        to: getFormattedDate(filterToDateParams ? new Date(filterToDateParams) : new Date()),
        sellerId: filterSellerIdParams
    });
    const filteredInvoices = useMemo(() => invoices.data?.payload ?? [], [invoices])

    const isLoading = useMemo(() => analytics.isLoading || invoices.isLoading, [analytics.isLoading, invoices.isLoading])

    const { actions, rowsSelected, isSelectingInvoice, selectedInvoice } = useAdminDashboardStore()

    const { setIsLoading, setLoadingMessage } = useLoading()
    const utils = trpc.useUtils();
    const deleteInvoices = trpc.invoice.delete.bulk.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage(`Deleting ${rowsSelected.length} invoices...`);
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message)
            utils.invoice.getList.invalidate()
            utils.invoice.getDashboardAnalytics.invalidate()
            actions.setIsSelectingInvoice(false)
            actions.setRowsSelected([])
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })


    if (isLoading) {
        return <MainLoader message="Fetching data analytics, please wait..." />
    }

    return (
        <>
            <EditInvoiceModal
                isOpen={!!selectedInvoice}
                onClose={() => actions.setSelectedInvoice(null)}
                invoice={selectedInvoice}
            />
            <AdminBulkEditModal />
            <div className="max-w-[90rem] mx-auto p-6 space-y-8">
                {totalInvoices && totalRevenue && totalItems && totalCustomers && (
                    <AdminStatsCards
                        totalRevenue={totalRevenue}
                        totalItems={totalItems}
                        totalInvoices={totalInvoices}
                        totalCustomers={totalCustomers}
                    />
                )}
                <div className="grid lg:grid-cols-6 grid-cols-1 gap-4">
                    <div className="lg:col-span-4 col-span-1">
                        <AllInvoicesCard
                            deleteSelected={() => {
                                deleteInvoices.mutate({
                                    invoiceIds: rowsSelected.map(({ id }) => ({ id }))
                                })
                            }}
                            columns={columns}
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
                        <AdminSellerBreakdownCard data={sellerPerformance} />
                        <CategoryBreakdownCard categories={itemPerformance} />
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