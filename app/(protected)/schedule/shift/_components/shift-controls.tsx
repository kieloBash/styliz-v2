"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface ShiftControlsProps {
    weekDates: Date[]
    navigateWeek: (direction: "prev" | "next") => void
    setCurrentDate: (date: Date) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedSeller: string
    setSelectedSeller: (seller: string) => void
    sellers: any[]
}

export function ShiftControls({
    weekDates,
    navigateWeek,
    setCurrentDate,
    searchTerm,
    setSearchTerm,
    selectedSeller,
    setSelectedSeller,
    sellers,
}: ShiftControlsProps) {
    return (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek("prev")}
                                className="border-red-200 hover:bg-red-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-lg font-semibold min-w-[200px] text-center">
                                {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} -{" "}
                                {weekDates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek("next")}
                                className="border-red-200 hover:bg-red-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentDate(new Date())}
                            className="border-red-200 hover:bg-red-50"
                        >
                            Today
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search shifts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-48 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                            />
                        </div>
                        <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                            <SelectTrigger className="w-48 border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                                <SelectValue placeholder="Filter by seller" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sellers</SelectItem>
                                {sellers.map((seller) => (
                                    <SelectItem key={seller.id} value={seller.id}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${seller.color}`}></div>
                                            {seller.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
