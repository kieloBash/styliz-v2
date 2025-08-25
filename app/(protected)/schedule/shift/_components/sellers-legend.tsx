"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface SellersLegendProps {
    sellers: any[]
    filteredShifts: any[]
}

export function SellersLegend({ sellers, filteredShifts }: SellersLegendProps) {
    return (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Sellers</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {sellers.map((seller) => {
                        const sellerShifts = filteredShifts.filter((s) => s.sellerId === seller.id)
                        return (
                            <div
                                key={seller.id}
                                className="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-r from-red-50 to-rose-50"
                            >
                                <div className={`w-4 h-4 rounded-full ${seller.color}`}></div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{seller.name}</div>
                                    <div className="text-xs text-gray-500">{sellerShifts.length} shifts this week</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
