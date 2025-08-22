import { useLoading } from '@/components/providers/loading-provider'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/utils'
import { trpc } from '@/server/trpc/client'
import { Badge, Check, X } from 'lucide-react'
import { useInvoiceStore } from '../_stores/invoiceStore'

const BottomCartDisplay = () => {
    const { setIsLoading, setLoadingMessage, } = useLoading();
    const utils = trpc.useUtils();

    const { data } = trpc.category.getList.useQuery();
    const { taxRate, items, selectedSeller, selectedCustomer, actions, selectedDate, selectedPlatform } = useInvoiceStore();
    const { mutate } = trpc.invoice.create.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage("Creating your invoice...");
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message)
            utils.invoice.getList.invalidate()
            utils.customer.getList.invalidate()
            actions.clearItems();
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })

    const categories = data?.payload ?? [];
    const subTotal = items.reduce((sum, item) => sum + (item.price), 0)
    const tax = subTotal * taxRate
    const grandTotal = subTotal + tax
    const totalItems = items.length

    const handleSaveInvoice = async () => {
        if (!selectedSeller || !selectedCustomer || !selectedDate || !selectedPlatform) return null;

        mutate({
            items,
            grandTotal,
            tax,
            subTotal,
            customerName: selectedCustomer.name,
            sellerId: selectedSeller.id,
            dateIssued: selectedDate.toISOString(),
            platformId: selectedPlatform.id
        });

    }
    // if (items.length > 0)
        return (
            <div className="bg-white/95 backdrop-blur-lg border-t border-rose-200 p-4 space-y-4 sticky bottom-0 left-0">
                {/* Cart Items */}
                <div className="max-h-32 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 overflow-y-auto space-y-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-rose-50 p-3 rounded-xl border border-rose-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-lg">
                                    {categories.find(c => c.id === item.categoryId)?.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{categories.find(c => c.id === item.categoryId)?.name}</span>
                                        {item.isFreebie && (
                                            <Badge className="bg-green-500 text-white text-xs px-1 py-0.5">FREE</Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {item.isFreebie ? "Free" : `₱${item.price.toFixed(2)}`}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="text-right mr-2">
                                    <div className="font-bold text-gray-900 text-sm">
                                        {item.isFreebie ? "Free" : `₱${(item.price).toFixed(2)}`}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => actions.removeItem(item)}
                                    className="h-7 w-7 text-red-500 hover:bg-red-50 rounded-lg ml-1"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total and Checkout */}
                <div className="flex items-center justify-between pt-3 border-t border-rose-200">
                    <div className="flex gap-6 justify-center items-center">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">₱{subTotal.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">{totalItems} items</div>
                        </div>
                        <Button disabled={items.length === 0} onClick={() => actions.clearItems()} className='bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700'>Clear Items</Button>
                    </div>
                    <Button
                        onClick={handleSaveInvoice}
                        disabled={!selectedCustomer || !selectedSeller || !selectedPlatform}
                        className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl h-12 px-8 text-lg font-semibold disabled:opacity-50"
                    >
                        <Check className="h-5 w-5 mr-2" />
                        Complete Sale
                    </Button>
                </div>
            </div>
        )
}

export default BottomCartDisplay