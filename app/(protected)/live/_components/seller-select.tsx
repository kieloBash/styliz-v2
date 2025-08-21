import { trpc } from '@/server/trpc/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from 'lucide-react'
import { useState } from 'react'
import { useInvoiceStore } from '../_stores/invoiceStore'

const SellerSelectBar = () => {
    // const [selectedSeller, setSelectedSeller] = useState<string>("")
    const { data } = trpc.seller.getList.useQuery();
    const { actions, selectedSeller } = useInvoiceStore();

    return (
        <div className="bg-white/90 backdrop-blur-sm border-b border-rose-200 px-4 py-3">
            <Select value={selectedSeller?.id} onValueChange={(e) => {
                const selected = data?.payload?.find(d => d.id === e)
                if (selected)
                    actions.setSelectedSeller(selected);
            }}>
                <SelectTrigger className="w-full h-12 border-rose-300 hover:bg-rose-50 hover:border-rose-400 rounded-xl text-left justify-start">
                    <User className="h-4 w-4 mr-3 text-rose-600" />
                    <SelectValue placeholder="Select Seller" />
                </SelectTrigger>
                <SelectContent>
                    {data?.payload?.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{seller.name}</span>
                                <span className="text-sm text-gray-500">{seller.email}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SellerSelectBar