'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDebounce } from '@/hooks/use-Debounce'
import { trpc } from '@/server/trpc/client'
import { InvoiceStatus } from '@prisma/client'
import { ChevronLeft, ChevronRight, CopyIcon, Edit2, FileText, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useUserDashboardStore } from '../../_stores/userDashboardStore'
import { DatePicker } from '@/components/ui/date-picker'
import { formatDate } from 'date-fns'
import { DATE_FORMAT_SHORT } from '@/constants/formats'
import { FullInvoiceType } from '@/types/db'
import { InvoiceDataTable } from './user/data-table'
import { columns } from './user/columns'
import { BulkEditModal } from './user/bulk-edit-modal'

const UserDashboard = () => {
    const searchParams = useSearchParams()
    const limit = searchParams.get("limit") ?? "10"
    const page = searchParams.get("page") ?? "1"
    const filterStatusParams = searchParams.get("status") ?? "all"
    const filterSearchParams = searchParams.get("search") ?? ""
    const filterFromDateParams = searchParams.get("from")
    const filterToDateParams = searchParams.get("to")

    const [from, setFrom] = useState<Date | undefined>(filterFromDateParams ? new Date(filterFromDateParams) : undefined);
    const [to, setTo] = useState<Date | undefined>(filterToDateParams ? new Date(filterToDateParams) : undefined);
    const getFormattedDate = (date: Date | undefined) => date ? formatDate(date, DATE_FORMAT_SHORT) : undefined;

    const { actions, rowsSelected, isSelectingInvoice } = useUserDashboardStore();

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState(filterSearchParams)
    const [filterStatus, setFilterStatus] = useState(filterStatusParams)
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        handleChangeSearchFilter(debouncedSearch);
    }, [debouncedSearch])

    useEffect(() => {
        handleChangeStatusFilter(filterStatus);
    }, [filterStatus])

    const { data, isLoading } = trpc.invoice.getList.useQuery({ limit: parseInt(limit), page: parseInt(page), customerName: debouncedSearch, status: filterStatus, from: getFormattedDate(from), to: getFormattedDate(to) });
    const filteredInvoices = useMemo(() => data?.payload ?? [], [data])

    const handleChangeDateFrom = (newDate: Date | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        const date = newDate ? formatDate(newDate, DATE_FORMAT_SHORT) : "";

        params.set("from", date);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        actions.setRowsSelected([])
    }

    const handleChangeDateTo = (newDate: Date | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        const date = newDate ? formatDate(newDate, DATE_FORMAT_SHORT) : "";

        params.set("to", date);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        actions.setRowsSelected([])
    }

    const handleChangeLimit = (newLimit: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", newLimit);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        actions.setRowsSelected([])
    }

    const handleChangePage = (newPage: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage);
        router.push(`?${params.toString()}`);
    }

    const handleChangeStatusFilter = (newStatus: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("status", newStatus);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        actions.setRowsSelected([])
    }

    const handleChangeSearchFilter = (newSearch: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("search", newSearch);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        actions.setRowsSelected([])
    }

    const handleChangeToToday = () => {
        const newDate = from || to ? undefined : new Date()
        setFrom(newDate)
        setTo(newDate)
        handleChangeDateFrom(newDate)
        handleChangeDateTo(newDate)
    }

    const totalItemsSelected = useMemo(() =>
        rowsSelected.reduce((prev, current) => current.items.length + prev, 0), [rowsSelected])

    const totalItemsPrice = useMemo(() =>
        rowsSelected.reduce((prev, current) => prev + current.subTotal, 0), [rowsSelected])

    return (
        <>
            <BulkEditModal />
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* All Invoices */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                        My Invoices
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-gray-600">View and manage all your invoices</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search invoices..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400 w-full sm:w-64"
                                    />
                                </div>
                                <Select value={filterStatus}
                                    onValueChange={(e) => {
                                        setFilterStatus(e)
                                    }}>
                                    <SelectTrigger className="lg:w-[180px] w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {Object.keys(InvoiceStatus).map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <DatePicker
                                    placeholder="Date from"
                                    onChange={handleChangeDateFrom}
                                    date={from}
                                    setDate={setFrom}
                                />
                                <DatePicker
                                    placeholder="Date to"
                                    onChange={handleChangeDateTo}
                                    date={to}
                                    setDate={setTo}
                                />
                                <Button type='button' onClick={handleChangeToToday}>
                                    {from || to ? "Clear Dates" : "Today"}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isSelectingInvoice && (
                            <div className="text-sm text-gray-600 mb-4 flex flex-col lg:flex-row justify-between items-center gap-4">
                                <div className="flex gap-2 justify-center items-center">
                                    <Button disabled={rowsSelected.length === 0} type='button' variant={"outline"}
                                        onClick={() => { actions.setIsEdittingBulk(true) }}>Edit Bulk</Button>
                                    <Button type='button' variant={"outline"}
                                        onClick={() => { actions.addRows(filteredInvoices) }}>Select All</Button>
                                    <Button type='button' variant={"outline"}
                                        onClick={() => { actions.setRowsSelected([]) }}>Clear All</Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span><span className="font-bold">{rowsSelected.length}</span> rows selected</span>
                                    <span><span className="font-bold">{totalItemsSelected}</span> items selected</span>
                                    <span><span className="font-bold">₱{totalItemsPrice.toLocaleString()}</span> amount selected</span>
                                </div>
                            </div>
                        )}
                        <InvoiceDataTable columns={columns} data={filteredInvoices} isLoading={isLoading} />
                        {filteredInvoices.length > 0 && (
                            <div className="mt-4 flex lg:flex-row flex-col gap-4 items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center gap-2 justify-center">
                                    <span>Showing {filteredInvoices.length} of {data?.meta?.total ?? 0} invoices</span>
                                    <Select value={limit} onValueChange={handleChangeLimit}>
                                        <SelectTrigger>{limit}</SelectTrigger>
                                        <SelectContent>
                                            {["5", "10", "20", '30', '40'].map((val, index) => (<SelectItem value={val} key={index}>{val}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <Button type='button'
                                        disabled={parseInt(page) === 1}
                                        onClick={() => {
                                            if (parseInt(page) > 1)
                                                handleChangePage((parseInt(page) - 1).toLocaleString())
                                        }}
                                        variant={"outline"} size={"icon"} className='size-8'><ChevronLeft /></Button>
                                    <Button type='button'
                                        disabled={parseInt(page) >= (data?.meta?.pageCount ?? 0)}
                                        onClick={() => {
                                            if (parseInt(page) < (data?.meta?.pageCount ?? 0))
                                                handleChangePage((parseInt(page) + 1).toLocaleString())
                                        }}
                                        variant={"outline"} size={"icon"} className='size-8'><ChevronRight /></Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>
                                        Completed: {filteredInvoices.filter(inv => inv.status === InvoiceStatus.COMPLETED).length}
                                    </span>
                                    <span>
                                        Returned: {filteredInvoices.filter(inv => inv.status === InvoiceStatus.RTS).length}
                                    </span>
                                    <span>
                                        Joy: {filteredInvoices.filter(inv => inv.status === InvoiceStatus.JOYJOY).length}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default UserDashboard