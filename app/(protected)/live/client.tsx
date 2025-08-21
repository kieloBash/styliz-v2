"use client"

import BottomCartDisplay from "./_components/bottom-cart"
import CustomerSelectBar from "./_components/customer-select"
import LiveSaleHeader from "./_components/header"
import ItemsGridDisplay from "./_components/items-grid"
import CustomPriceModal from "./_components/modals/custom-price"
import PlatformSelectBar from "./_components/platform-select"
import SellerSelectBar from "./_components/seller-select"
import { useInvoiceStore } from "./_stores/invoiceStore"

export default function LiveInvoiceCreation() {
    const { openCustom, selectedCategory } = useInvoiceStore()
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col">
            <LiveSaleHeader />
            <div className="flex-1 flex flex-col">
                <CustomerSelectBar />
                <div className="flex justify-center items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-3 relative">
                    <SellerSelectBar />
                    <PlatformSelectBar />
                </div>
                <ItemsGridDisplay />
            </div>
            <BottomCartDisplay />

            {/* Custom Price Modal */}
            {openCustom && selectedCategory && (
                <CustomPriceModal />
            )}

        </div>
    )
}
