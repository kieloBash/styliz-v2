import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/server/trpc/client'
import { DollarSign, X } from 'lucide-react'
import { useState } from 'react'
import { useInvoiceStore } from '../../_stores/invoiceStore'
import { ItemStatus } from '@prisma/client'

const CustomPriceModal = () => {
    const { selectedCategory, actions } = useInvoiceStore();
    const [customPrice, setCustomPrice] = useState("")
    const { data } = trpc.category.getList.useQuery();
    const categories = data?.payload ?? [];

    const addCustomPriceItem = () => {
        if (!selectedCategory || !customPrice) return null;

        actions.addItem({
            categoryId: selectedCategory,
            price: parseInt(customPrice),
            isFreebie: false,
            status: ItemStatus.COMPLETED,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        actions.setOpenCustomModal(false);
        actions.setSelectedCategory(null);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Custom Price</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                actions.setOpenCustomModal(false)
                                setCustomPrice("")
                                actions.setSelectedCategory(null)
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-4xl mb-2">
                                {categories.find(c => c.id === selectedCategory)?.icon}
                            </div>
                            <div className="font-semibold text-gray-900">
                                {categories.find(c => c.id === selectedCategory)?.name}
                            </div>
                        </div>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={customPrice}
                                onChange={(e) => setCustomPrice(e.target.value)}
                                className="pl-10 text-center text-2xl font-bold border-rose-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl h-16"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    actions.setOpenCustomModal(false)
                                    setCustomPrice("")
                                    actions.setSelectedCategory(null)
                                }}
                                className="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => addCustomPriceItem()}
                                disabled={!customPrice}
                                className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl"
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomPriceModal