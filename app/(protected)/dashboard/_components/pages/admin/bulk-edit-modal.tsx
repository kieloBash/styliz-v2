"use client"

import { useLoading } from "@/components/providers/loading-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStatusBadgeColor, getStatusColor, showToast } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import { InvoiceStatus } from "@prisma/client"
import { Check, Edit3, FileText, X } from "lucide-react"
import { useState } from "react"
import { useAdminDashboardStore } from "../../../_stores/adminDashboardStore"

interface BulkEditModalProps {
}

export function AdminBulkEditModal({ }: BulkEditModalProps) {
    const { setIsLoading, setLoadingMessage } = useLoading()
    const utils = trpc.useUtils();

    const [bulkStatus, setBulkStatus] = useState<InvoiceStatus>(InvoiceStatus.COMPLETED)

    const { rowsSelected: invoices, isEdittingBulk: isOpen, actions } = useAdminDashboardStore();
    const onClose = () => {
        actions.setIsEdittingBulk(false);
    }
    const { mutate } = trpc.invoice.bulkUpdate.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage(`Updating ${invoices.length} invoices to ${bulkStatus}...`);
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message)
            utils.invoice.getList.invalidate()
            utils.customer.getList.invalidate()
            onClose()
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

    if (!isOpen) return null

    const selectedInvoiceDetails = invoices;
    const totalValue = selectedInvoiceDetails.reduce((sum, invoice) => sum + invoice.subTotal, 0)

    const handleOnUpdateStatus = (status: InvoiceStatus) => {
        mutate({
            status,
            invoiceIds: invoices.map((d) => ({ id: d.id }))
        });
    }

    const handleUpdateStatus = () => {
        handleOnUpdateStatus(bulkStatus)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Edit3 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Bulk Edit Invoices</h2>
                                <p className="text-rose-100">Update multiple invoices at once</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-xl">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                    {/* Selection Summary */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-red-600 rounded-full flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 text-lg">
                                        {invoices.length} Invoice{invoices.length > 1 ? "s" : ""} Selected
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total Value: <span className="font-semibold">₱ {totalValue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Invoices List */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Selected Invoices:</h3>
                        <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 rounded-xl p-4">
                            {selectedInvoiceDetails.map((invoice) => (
                                <div
                                    key={`invoice-details-${invoice.id}`}
                                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{invoice.customer.name}</div>
                                            <div className="text-gray-600">{invoice.seller.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right text-sm">
                                            <div className="font-semibold text-gray-900">₱ {invoice.subTotal.toLocaleString()}</div>
                                            <div className="text-gray-600">{invoice.items.length} items</div>
                                        </div>
                                        <Badge className={getStatusBadgeColor(invoice.status)}>{invoice.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-3">
                        <label className="text-lg font-semibold text-gray-700">Update Status To:</label>
                        <Select
                            value={bulkStatus}
                            onValueChange={(value: InvoiceStatus) => setBulkStatus(value)}
                        >
                            <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400 h-14 text-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={InvoiceStatus.COMPLETED}>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className={`w-4 h-4 ${getStatusColor(InvoiceStatus.COMPLETED)} rounded-full`}></div>
                                        <div>
                                            <div className="font-medium">Completed</div>
                                            <div className="text-sm text-gray-500">Mark invoices as completed</div>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value={InvoiceStatus.RTS}>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className={`w-4 h-4 ${getStatusColor(InvoiceStatus.RTS)} rounded-full`}></div>
                                        <div>
                                            <div className="font-medium">Returned to Seller</div>
                                            <div className="text-sm text-gray-500">Mark invoices as RTS</div>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value={InvoiceStatus.JOYJOY}>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className={`w-4 h-4 ${getStatusColor(InvoiceStatus.JOYJOY)} rounded-full`}></div>
                                        <div>
                                            <div className="font-medium">Joy Invoices</div>
                                            <div className="text-sm text-gray-500">Mark invoices as joyjoy</div>
                                        </div>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Preview Changes */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-gray-700 mb-2">Preview Changes:</h4>
                        <div className="text-sm text-gray-600">
                            Selected invoices{invoices.length > 1 ? "s" : ""} will be updated to{" "}
                            <Badge className={getStatusBadgeColor(bulkStatus)}>{bulkStatus}</Badge> status.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-gray-300 hover:bg-gray-100 h-12 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateStatus}
                            className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white h-12 text-lg font-semibold"
                        >
                            <Check className="h-5 w-5 mr-2" />
                            Update {invoices.length} Invoice{invoices.length > 1 ? "s" : ""}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
