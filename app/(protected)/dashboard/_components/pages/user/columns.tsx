"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { copyInvoiceToClipboard, formatCurrency, getStatusBadgeColor, showToast } from "@/lib/utils"
import { FullInvoiceType } from "@/types/db"
import { ColumnDef } from "@tanstack/react-table"
import { CopyIcon, EditIcon } from "lucide-react"
import { useUserDashboardStore } from "../../../_stores/userDashboardStore"
import { ItemStatus } from "@prisma/client"

export const columns: ColumnDef<FullInvoiceType>[] = [
    {
        id: "select",
        header: () => {
            const { actions, isSelectingInvoice } = useUserDashboardStore();
            return (
                <Checkbox
                    checked={isSelectingInvoice}
                    onCheckedChange={(value) => actions.setIsSelectingInvoice(!!value)}
                    aria-label="Select all"
                />
            )
        },
        cell: ({ row }) => {
            const { actions, isSelectingInvoice } = useUserDashboardStore();
            if (isSelectingInvoice)
                return (
                    <Checkbox
                        checked={actions.isRowSelected(row.original)}
                        onCheckedChange={(value) => {
                            if (value) {
                                actions.addRow(row.original)
                            } else {
                                actions.removeRow(row.original)
                            }
                        }}
                        aria-label="Select row"
                    />
                )
        },
    },
    {
        accessorFn: (row) => row.customer.name,
        id: "customerName",
        header: "Customer"
    },
    {
        accessorFn: (row) => row.seller.name,
        id: "sellerName",
        header: "Seller"
    },
    {
        accessorFn: (row) => row.platform.name,
        id: "platformName",
        header: "Platorm",
    },
    {
        accessorFn: (row) => row.items.length ?? 0,
        id: "itemCount",
        header: "Total Items Completed",
        cell: ({ row }) => {
            return (
                <span className="">
                    <span className="font-medium">{row.original.items.filter((d) => d.status === ItemStatus.COMPLETED).length ?? 0}</span> items
                </span>
            )
        }
    },
    {
        accessorKey: "freebies",
        header: "Freebies",
        cell: ({ row }) => {
            return (
                <span className="">
                    <span className="font-medium">{row.original.freebies}</span> free
                </span>
            )
        }
    },
    {
        accessorFn: (row) => row.items.length ?? 0,
        id: "cancelledItems",
        header: "Cancelled",
        cell: ({ row }) => {
            return (
                <span className="">
                    <span className="font-medium">{row.original.items.filter((d) => d.status !== ItemStatus.COMPLETED).length ?? 0}</span> items
                </span>
            )
        }
    },
    {
        accessorKey: "subTotal",
        header: "Total",
        cell: ({ row }) => {
            return (
                <span className="">
                    <span className="font-medium">{formatCurrency(row.original.subTotal)}</span>
                </span>
            )
        }
    },
    {
        accessorFn: (row) => new Date(row.dateIssued).toDateString(),
        id: "dateIssued",
        header: "Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <Badge className={getStatusBadgeColor(row.original.status)}>{row.original.status}</Badge>
        }
    },
    {
        id: "actions",
        header: () => <span className="flex flex-1 justify-center items-center">Actions</span>,
        cell: ({ row }) => {

            const invoice = row.original;
            const { actions } = useUserDashboardStore();

            async function handleCopy() {
                copyInvoiceToClipboard(invoice)
                showToast("success", `${invoice.customer.name} copied successfully!`)
            }

            async function handleEdit() {
                actions.setSelectedInvoice(invoice);
            }

            return (
                <div className="flex gap-2 items-center justify-center">
                    <Button
                        onClick={handleCopy}
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                        <CopyIcon className="h-4 w-4" /> Copy
                    </Button>
                    <Button
                        onClick={handleEdit}
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                        <EditIcon className="h-4 w-4" /> Edit
                    </Button>
                </div>
            )
        }
    }
]