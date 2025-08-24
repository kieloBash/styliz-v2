'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { trpc } from '@/server/trpc/client'
import { User } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Props = {
    paramName: string;
}

const SellerSelectBar = ({ paramName }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const filterSellerIdParams = searchParams.get(paramName) ?? "all"

    const [selected, setSelected] = useState(filterSellerIdParams)

    const { data } = trpc.seller.getList.useQuery();

    const handleChangeSellerId = (newSellerId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, newSellerId);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="w-full">
            <Select value={selected} onValueChange={(e) => {
                const selected = data?.payload?.find(d => d.id === e)
                if (selected) {
                    setSelected(selected.id)
                    handleChangeSellerId(selected.id);
                } else {
                    setSelected("all")
                    handleChangeSellerId("all")
                }
            }}>
                <SelectTrigger className="w-full h-12 text-left justify-start">
                    <User className="h-4 w-4 mr-3 text-rose-600" />
                    <SelectValue placeholder="Select Seller" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"all"}>
                        <div className="flex flex-col">
                            <span className="font-medium">All</span>
                        </div>
                    </SelectItem>
                    {data?.payload?.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{seller.name}</span>
                                {/* <span className="text-sm text-gray-500">{seller.email}</span> */}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SellerSelectBar