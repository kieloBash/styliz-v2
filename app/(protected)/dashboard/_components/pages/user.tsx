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
import { ChevronLeft, ChevronRight, CopyIcon, FileText, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const UserDashboard = () => {
    const searchParams = useSearchParams()
    const limit = searchParams.get("limit") ?? "10"
    const page = searchParams.get("page") ?? "1"
    const filterStatusParams = searchParams.get("status") ?? "all"
    const filterSearchParams = searchParams.get("search") ?? ""

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

    const { data } = trpc.invoice.getList.useQuery({ limit: parseInt(limit), page: parseInt(page), customerName: debouncedSearch, status: filterStatus });
    const filteredInvoices = useMemo(() => data?.payload ?? [], [data])

    const handleChangeLimit = (newLimit: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", newLimit);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
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
    }

    const handleChangeSearchFilter = (newSearch: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("search", newSearch);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    }

    return (
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
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value={InvoiceStatus.PENDING}>{InvoiceStatus.PENDING}</SelectItem>
                                    <SelectItem value={InvoiceStatus.COMPLETED}>{InvoiceStatus.COMPLETED}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-red-100">
                                    <TableHead className="font-semibold text-gray-700">Invoice ID</TableHead>
                                    <TableHead className="font-semibold text-gray-700">SKU</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Items</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Total</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="border-red-50 hover:bg-red-50/50">
                                            <TableCell className="font-medium text-gray-900">{invoice.id}</TableCell>
                                            <TableCell className="text-gray-700 font-mono text-sm">{invoice.sku}</TableCell>
                                            <TableCell className="text-gray-700">{invoice.customer.name}</TableCell>
                                            <TableCell className="text-gray-700">{invoice.items.length} items</TableCell>
                                            <TableCell className="font-semibold text-gray-900">
                                                ₱{invoice.subTotal}</TableCell>
                                            <TableCell className="text-gray-700">{new Date(invoice.dateIssued).toDateString()}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={invoice.status === InvoiceStatus.COMPLETED ? "default" : "secondary"}
                                                    className={
                                                        invoice.status === InvoiceStatus.COMPLETED
                                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                                                            : invoice.status === InvoiceStatus.PENDING
                                                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0"
                                                                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
                                                    }
                                                >
                                                    {invoice.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                >
                                                    <CopyIcon className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <FileText className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <div className="text-gray-500">
                                                    {searchTerm || filterStatus !== "all"
                                                        ? "No invoices found matching your search criteria"
                                                        : "No invoices yet. Start your first live sale!"
                                                    }
                                                </div>
                                                {!searchTerm && filterStatus === "all" && (
                                                    <Link href="/live">
                                                        <Button className="mt-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white">
                                                            <Zap className="h-4 w-4 mr-2" />
                                                            Create First Invoice
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredInvoices.length > 0 && (
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-2 justify-center">
                                <span>Showing {filteredInvoices.length} of {data?.meta?.total ?? 0} invoices</span>
                                <Select value={limit} onValueChange={handleChangeLimit}>
                                    <SelectTrigger>{limit}</SelectTrigger>
                                    <SelectContent>
                                        {["10", "20", '30', '40'].map((val, index) => (<SelectItem value={val} key={index}>{val}</SelectItem>))}
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
                                    Pending: {filteredInvoices.filter(inv => inv.status === InvoiceStatus.PENDING).length}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default UserDashboard