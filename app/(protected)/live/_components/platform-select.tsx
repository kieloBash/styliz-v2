import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentUser } from '@/hooks/use-Session'
import { trpc } from '@/server/trpc/client'
import { UserRole } from '@/types/roles'
import { BoxIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useInvoiceStore } from '../_stores/invoiceStore'

const PlatformSelectBar = () => {
    const { data } = trpc.platform.getList.useQuery();
    const { actions, selectedPlatform } = useInvoiceStore();

    const user = useCurrentUser();

    useEffect(() => {
        if (user?.role === UserRole.SELLER) {
            actions.setSelectedSeller({ id: user.id, email: user.email!!, name: user.name!! })
        }
    }, [user, data?.payload])

    return (
        <div className="w-full">
            <Select value={selectedPlatform?.id} onValueChange={(e) => {
                const selected = data?.payload?.find(d => d.id === e)
                if (selected) {
                    actions.setSelectedPlatform(selected);
                }
            }}>
                <SelectTrigger className="w-full h-12 border-rose-300 hover:bg-rose-50 hover:border-rose-400 rounded-xl text-left justify-start">
                    <BoxIcon className="h-4 w-4 mr-3 text-rose-600" />
                    <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                    {data?.payload?.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{platform.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default PlatformSelectBar