'use client'
import { DATE_FORMAT_SHORT } from '@/constants/formats'
import { trpc } from '@/server/trpc/client'
import { formatDate } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useUserDashboardStore } from '../../_stores/userDashboardStore'
import AllInvoicesCard from '../all-invoices'
import { BulkEditModal } from './user/bulk-edit-modal'
import { columns } from './user/columns'

const UserDashboard = () => {
    const searchParams = useSearchParams()
    const limit = searchParams.get("limit") ?? "10"
    const page = searchParams.get("page") ?? "1"
    const filterStatusParams = searchParams.get("status") ?? "all"
    const filterSearchParams = searchParams.get("search") ?? ""
    const filterFromDateParams = searchParams.get("from")
    const filterToDateParams = searchParams.get("to")

    const getFormattedDate = (date: Date | undefined) => date ? formatDate(date, DATE_FORMAT_SHORT) : undefined;

    const { actions, rowsSelected, isSelectingInvoice } = useUserDashboardStore();

    const { data, isLoading } = trpc.invoice.getList.useQuery({ limit: parseInt(limit), page: parseInt(page), customerName: filterSearchParams, status: filterStatusParams, from: getFormattedDate(filterFromDateParams ? new Date(filterFromDateParams) : undefined), to: getFormattedDate(filterToDateParams ? new Date(filterToDateParams) : undefined) });

    const filteredInvoices = useMemo(() => data?.payload ?? [], [data])

    return (
        <>
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
                    clearSelected={() => { actions.setRowsSelected([]) }}
                    onBulkEdit={() => { actions.setIsEdittingBulk(true) }}
                    onSelectAll={() => { actions.setRowsSelected(filteredInvoices) }}
                />
            </div>
        </>
    )
}

export default UserDashboard