import { useLoading } from '@/components/providers/loading-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, showToast } from '@/lib/utils'
import { trpc } from '@/server/trpc/client'
import { SellerPerformanceDTO } from '@/types/dto/seller-performance'
import { InvoiceStatus, ItemStatus } from '@prisma/client'
import { Crown, FileText, Package, PlusIcon, User, Users } from 'lucide-react'
import { useState } from 'react'
import { CreateSellerModal } from './create-seller-modal'

type Props = { data: SellerPerformanceDTO[] }

const AdminSellerBreakdownCard = ({ data }: Props) => {
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const { setIsLoading, setLoadingMessage } = useLoading()
    const utils = trpc.useUtils();

    const getCompletionRate = (seller: SellerPerformanceDTO) => {
        if (seller.totalItems === 0) return 0
        return Math.round(((seller.itemMap[ItemStatus.COMPLETED] ?? 0) / seller.totalItems) * 100)
    }

    const { mutate: onCreateSeller } = trpc.seller.create.useMutation({
        onMutate: ({ name }) => {
            setIsLoading(true)
            setLoadingMessage(`Creating seller account for ${name}`);
        },
        onSuccess: (data) => {
            if (data.success) {
                showToast("success", "Success", data.message)
                utils.invoice.getList.invalidate()
                utils.customer.getList.invalidate()
                setIsOpenCreateModal(false)
            } else {
                showToast("error", "Something went wrong!", data.message)
            }
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })

    const SellerCard = ({ seller: d, index }: { seller: SellerPerformanceDTO, index: number }) => {
        const cancelledItems =
            (d.itemMap[ItemStatus.JOYJOY] ?? 0) +
            (d.itemMap[ItemStatus.RTS] ?? 0);

        const cancelledInvoices =
            (d.invoiceMap[InvoiceStatus.JOYJOY] ?? 0) +
            (d.invoiceMap[InvoiceStatus.RTS] ?? 0);
        return (
            <div
                key={d.sellerId}
                className="flex flex-col p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow space-y-3"
            >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            {index === 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Crown className="h-3 w-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 text-sm">{d.sellerName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm">{formatCurrency(d.totalRevenue)}</div>
                        <div className="text-xs text-gray-500">Total Revenue</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Invoices Stats */}
                    <div className="bg-white/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-gray-700">Items</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-medium text-gray-900">{d.totalItems}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-green-600">Completed:</span>
                                <span className="font-medium text-green-700">{d.itemMap[ItemStatus.COMPLETED] ?? 0}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-red-600">Cancelled:</span>
                                <span className="font-medium text-red-700">{cancelledItems}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Stats */}
                    <div className="bg-white/60 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-indigo-600" />
                            <span className="text-xs font-medium text-gray-700">Invoices</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-medium text-gray-900">{d.totalInvoices}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-green-600">Completed:</span>
                                <span className="font-medium text-green-700">
                                    {d.invoiceMap[InvoiceStatus.COMPLETED] ?? 0}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-red-600">Cancelled:</span>
                                <span className="font-medium text-red-700">
                                    {cancelledInvoices}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{getCompletionRate(d)}% completion</span>
                        </div>
                        {cancelledItems > 0 && (
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-red-600">Loss: {formatCurrency(d.totalLoss)}</span>
                            </div>
                        )}
                    </div>
                    {/* <div className="text-xs text-gray-500">Avg: {formatCurrency(seller.avgOrderValue)}</div> */}
                </div>
            </div>
        )
    }

    return (
        <>
            <CreateSellerModal
                isOpen={isOpenCreateModal}
                onClose={() => {
                    setIsOpenCreateModal(false)
                }}
                onCreateSeller={onCreateSeller}
            />
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex justify-between items-center gap-3 text-lg">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Sellers Performance
                            </span>
                        </div>
                        <Button onClick={() => { setIsOpenCreateModal(true) }} type='button' size={"sm"} className='bg-gradient-to-r from-purple-500 to-indigo-600'><PlusIcon /> Create Seller</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.length > 0 ? (
                        <>
                            {data.slice(0, 5).map((d, index) => (
                                <SellerCard seller={d} index={index} key={`${d.sellerId}-${index}`} />
                            ))}
                            <Button
                                variant="outline"
                                className="w-full mt-3 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                            >
                                View All Sellers
                            </Button>
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No seller data available</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default AdminSellerBreakdownCard