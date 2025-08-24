import { useLoading } from '@/components/providers/loading-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, showToast } from '@/lib/utils'
import { trpc } from '@/server/trpc/client'
import { SellerPerformanceDTO } from '@/types/dto/seller-performance'
import { Crown, FileText, Package, PlusIcon, User, Users } from 'lucide-react'
import { useState } from 'react'
import { CreateSellerModal } from './create-seller-modal'

type Props = { data: SellerPerformanceDTO[] }

const AdminSellerBreakdownCard = ({ data }: Props) => {
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const { setIsLoading, setLoadingMessage } = useLoading()
    const utils = trpc.useUtils();

    const getCompletionRate = (seller: SellerPerformanceDTO) => {
        if (seller.invoiceCount === 0) return 0
        return Math.round((seller.completedItems / seller.totalItems) * 100)
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
                                <div
                                    key={d.sellerId}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow"
                                >
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
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    <span>{d.invoiceCount} invoices</span>
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <Package className="h-3 w-3" />
                                                    <span>{d.totalItems} items</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 text-sm">{formatCurrency(d.totalRevenue)}</div>
                                        <div className="text-xs text-gray-500">Total Revenue</div>
                                        <div className="text-xs text-green-600 font-medium mt-1">
                                            {getCompletionRate(d)}% completion
                                        </div>
                                    </div>
                                </div>
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