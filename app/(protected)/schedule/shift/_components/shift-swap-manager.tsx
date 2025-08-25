"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, ArrowRightLeft } from "lucide-react"

interface ShiftSwapManagerProps {
    onClose: () => void
    swapRequests: any[]
    setSwapRequests: (requests: any[]) => void
    shifts: any[]
    setShifts: (shifts: any[]) => void
    sellers: any[]
}

export function ShiftSwapManager({
    onClose,
    swapRequests,
    setSwapRequests,
    shifts,
    setShifts,
    sellers,
}: ShiftSwapManagerProps) {
    const [newSwapRequest, setNewSwapRequest] = useState({
        fromShiftId: "",
        toSellerId: "",
        reason: "",
    })

    const handleApproveSwap = (requestId: string) => {
        const request = swapRequests.find((r) => r.id === requestId)
        if (request) {
            // Update the original shift with new seller
            setShifts(
                shifts.map((shift) =>
                    shift.id === request.shiftId
                        ? { ...shift, sellerId: request.toSellerId, sellerName: request.toSellerName }
                        : shift,
                ),
            )

            // Remove the swap request
            setSwapRequests(swapRequests.filter((r) => r.id !== requestId))
        }
    }

    const handleRejectSwap = (requestId: string) => {
        setSwapRequests(swapRequests.filter((r) => r.id !== requestId))
    }

    const createSwapRequest = () => {
        const fromShift = shifts.find((s) => s.id === newSwapRequest.fromShiftId)
        const toSeller = sellers.find((s) => s.id === newSwapRequest.toSellerId)

        if (fromShift && toSeller) {
            const newRequest = {
                id: Date.now().toString(),
                fromSellerId: fromShift.sellerId,
                fromSellerName: fromShift.sellerName,
                toSellerId: toSeller.id,
                toSellerName: toSeller.name,
                shiftId: fromShift.id,
                shiftDate: fromShift.date,
                shiftTime: `${fromShift.startTime} - ${fromShift.endTime}`,
                status: "pending",
                requestDate: new Date().toISOString().split("T")[0],
                reason: newSwapRequest.reason,
            }

            setSwapRequests([...swapRequests, newRequest])
            setNewSwapRequest({ fromShiftId: "", toSellerId: "", reason: "" })
        }
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="requests">Swap Requests</TabsTrigger>
                    <TabsTrigger value="create">Create Request</TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="space-y-4">
                    <div className="space-y-3">
                        {swapRequests.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <ArrowRightLeft className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>No swap requests</p>
                            </div>
                        ) : (
                            swapRequests.map((request) => (
                                <Card key={request.id} className="border-l-4 border-l-rose-400">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-rose-600 border-rose-200">
                                                        {request.status}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">
                                                        Requested on {new Date(request.requestDate).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm">
                                                        <span className="font-medium">{request.fromSellerName}</span>
                                                        <span className="text-gray-500"> wants to swap with </span>
                                                        <span className="font-medium">{request.toSellerName}</span>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(request.shiftDate).toLocaleDateString()} • {request.shiftTime}
                                                    </div>
                                                </div>

                                                {request.reason && (
                                                    <div className="text-sm">
                                                        <span className="font-medium">Reason: </span>
                                                        <span className="text-gray-600">{request.reason}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApproveSwap(request.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRejectSwap(request.id)}
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Shift to Swap</Label>
                            <Select
                                value={newSwapRequest.fromShiftId}
                                onValueChange={(value) => setNewSwapRequest({ ...newSwapRequest, fromShiftId: value })}
                            >
                                <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                                    <SelectValue placeholder="Choose shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shifts
                                        .filter((s) => s.status === "scheduled")
                                        .map((shift) => (
                                            <SelectItem key={shift.id} value={shift.id}>
                                                {shift.sellerName} • {new Date(shift.date).toLocaleDateString()} • {shift.startTime}-
                                                {shift.endTime}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Swap With Seller</Label>
                            <Select
                                value={newSwapRequest.toSellerId}
                                onValueChange={(value) => setNewSwapRequest({ ...newSwapRequest, toSellerId: value })}
                            >
                                <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                                    <SelectValue placeholder="Choose seller" />
                                </SelectTrigger>
                                <SelectContent>
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

                        <div className="space-y-2">
                            <Label>Reason (Optional)</Label>
                            <Textarea
                                placeholder="Explain why this swap is needed..."
                                value={newSwapRequest.reason}
                                onChange={(e) => setNewSwapRequest({ ...newSwapRequest, reason: e.target.value })}
                                rows={3}
                                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                            />
                        </div>

                        <Button
                            onClick={createSwapRequest}
                            disabled={!newSwapRequest.fromShiftId || !newSwapRequest.toSellerId}
                            className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                        >
                            Create Swap Request
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 border-t border-rose-200">
                <Button variant="outline" onClick={onClose} className="border-rose-200 hover:bg-rose-50 bg-transparent">
                    Close
                </Button>
            </div>
        </div>
    )
}
