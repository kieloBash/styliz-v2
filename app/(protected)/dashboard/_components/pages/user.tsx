'use client'
import { DATE_FORMAT_SHORT } from '@/constants/formats'
import { showToast } from '@/lib/utils'
import { trpc } from '@/server/trpc/client'
import { format, formatDate } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useUserDashboardStore } from '../../_stores/userDashboardStore'
import AllInvoicesCard from '../all-invoices'
import EditInvoiceModal from '../edit-invoice-modal'
import { BulkEditModal } from './user/bulk-edit-modal'
import { columns } from './user/columns'
import { useLoading } from '@/components/providers/loading-provider'

const UserDashboard = () => {
    const { setIsLoading, setLoadingMessage } = useLoading()
    const utils = trpc.useUtils();

    const searchParams = useSearchParams()
    const limit = searchParams.get("limit") ?? "40"
    const page = searchParams.get("page") ?? "1"
    const filterStatusParams = searchParams.get("status") ?? "all"
    const filterSearchParams = searchParams.get("search") ?? ""
    const filterFromDateParams = searchParams.get("from") ?? format(new Date, "yyyy-MM-dd");
    const filterToDateParams = searchParams.get("to") ?? format(new Date, "yyyy-MM-dd");

    const getFormattedDate = (date: Date | undefined) => date ? formatDate(date, DATE_FORMAT_SHORT) : undefined;

    const { actions, rowsSelected, isSelectingInvoice, selectedInvoice } = useUserDashboardStore();

    const { data, isLoading } = trpc.invoice.getList.useQuery({ limit: parseInt(limit), page: parseInt(page), customerName: filterSearchParams, status: filterStatusParams, from: getFormattedDate(filterFromDateParams ? new Date(filterFromDateParams) : new Date()), to: getFormattedDate(filterToDateParams ? new Date(filterToDateParams) : new Date()) });

    const deleteInvoices = trpc.invoice.delete.bulk.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage(`Deleting ${rowsSelected.length} invoices...`);
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message)
            utils.invoice.getList.invalidate()
            utils.customer.getList.invalidate()
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

    const filteredInvoices = useMemo(() => data?.payload ?? [], [data])

    return (
        <>
            <EditInvoiceModal
                isOpen={!!selectedInvoice}
                onClose={() => actions.setSelectedInvoice(null)}
                invoice={selectedInvoice}
            />
            <BulkEditModal />
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <AllInvoicesCard
                    columns={columns}
                    pageCount={data?.meta?.pageCount}
                    totalInvoices={data?.meta?.total}
                    data={filteredInvoices}
                    isLoading={isLoading}
                    rowsSelected={rowsSelected}
                    isSelectingInvoice={isSelectingInvoice}
                    deleteSelected={() => {
                        deleteInvoices.mutate({
                            invoiceIds: rowsSelected.map(({ id }) => ({ id }))
                        })
                    }}
                    clearSelected={() => { actions.setRowsSelected([]) }}
                    onBulkEdit={() => { actions.setIsEdittingBulk(true) }}
                    onSelectAll={() => { actions.setRowsSelected(filteredInvoices) }}
                />
            </div>
        </>
    )
}

export default UserDashboard