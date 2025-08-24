import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { DataTableProps } from "@/types/global";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { FileText } from "lucide-react";

type Props<TData, TValue> = DataTableProps<TData, TValue> & { isLoading?: boolean }

export function InvoiceDataTable<TData, TValue>({ columns, data, isLoading = false }: Props<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const getItemsLoader = () => {
        return (
            <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-gray-500">
                            Fetching invoices, please wait...
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? getItemsLoader() : <>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <FileText className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="text-gray-500">
                                            No invoices found
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </>}
                </TableBody>
            </Table>
        </div>
    )
}