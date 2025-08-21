import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useInvoiceStore } from '../_stores/invoiceStore'

const LiveSaleHeader = () => {
    const { taxRate, items, selectedDate, actions } = useInvoiceStore();
    const subTotal = items.reduce((sum, item) => sum + (item.price), 0)
    const tax = subTotal * taxRate
    const grandTotal = subTotal + tax
    const totalItems = items.length

    return (
        <div className="bg-white/95 backdrop-blur-lg border-b border-rose-200 sticky top-0 z-50">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-100 rounded-xl">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Live Sale</h1>
                                <p className="text-sm text-gray-600">StylizSystem</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <DatePicker
                            date={selectedDate}
                            setDate={actions.setSelectedDate}
                        />
                        <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">₱{subTotal.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{totalItems} items</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveSaleHeader