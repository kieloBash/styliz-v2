import { Button } from '@/components/ui/button'
import { trpc } from '@/server/trpc/client'
import { DollarSign, Gift } from 'lucide-react'
import { useState } from 'react'
import { useInvoiceStore } from '../_stores/invoiceStore'
import { ItemStatus } from '@prisma/client'


const ItemsGridDisplay = () => {
    const { data } = trpc.category.getList.useQuery();
    const categories = data?.payload ?? [];

    const { actions } = useInvoiceStore();
    const addItem = (categoryId: string, price: number, isFreebie = false) => {
        console.log("added item")
        actions.addItem({
            categoryId,
            price,
            isFreebie,
            status: ItemStatus.COMPLETED
        })
    }

    const [showCustomPrice, setShowCustomPrice] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    return (
        <div className="flex-1 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-200 p-4">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <span className="text-2xl">{category.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                            </div>
                        </div>

                        {/* Quick Price Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {category.quickPrices.map((price) => (
                                <Button
                                    key={price}
                                    onClick={() => addItem(category.id, price)}
                                    className="h-12 bg-gradient-to-r from-gray-50 to-rose-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 hover:border-rose-300 text-gray-900 font-bold text-lg rounded-xl shadow-sm hover:shadow-md transition-all"
                                    variant="outline"
                                >
                                    ₱{price}
                                </Button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button
                                onClick={() => {
                                    actions.setSelectedCategory(category.id)
                                    actions.setOpenCustomModal(true)
                                }}
                                variant="outline"
                                className="w-full h-10 border-rose-200 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-sm"
                            >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Custom Price
                            </Button>
                            <Button
                                onClick={() => addItem(category.id, 0, true)}
                                variant="outline"
                                className="w-full h-10 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl text-sm"
                            >
                                <Gift className="h-4 w-4 mr-2" />
                                Freebie
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ItemsGridDisplay