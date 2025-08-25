"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    ArrowRightLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock data - replace with actual data fetching
const mockSellers = [
    { id: "1", name: "John Doe", email: "john@example.com", color: "bg-red-500" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", color: "bg-rose-500" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", color: "bg-pink-500" },
    { id: "4", name: "Sarah Wilson", email: "sarah@example.com", color: "bg-red-600" },
    { id: "5", name: "Tom Brown", email: "tom@example.com", color: "bg-rose-600" },
]

const mockShifts = [
    {
        id: "1",
        sellerId: "1",
        sellerName: "John Doe",
        date: "2024-01-15",
        startTime: "09:00",
        endTime: "17:00",
        location: "Store A",
        status: "scheduled",
        color: "bg-red-500",
    },
    {
        id: "2",
        sellerId: "2",
        sellerName: "Jane Smith",
        date: "2024-01-15",
        startTime: "13:00",
        endTime: "21:00",
        location: "Store B",
        status: "scheduled",
        color: "bg-rose-500",
    },
    {
        id: "3",
        sellerId: "1",
        sellerName: "John Doe",
        date: "2024-01-16",
        startTime: "10:00",
        endTime: "18:00",
        location: "Store A",
        status: "completed",
        color: "bg-red-500",
    },
]

const locations = ["Store A", "Store B", "Store C", "Online", "Event"]
const shiftStatuses = ["scheduled", "completed", "cancelled", "no-show"]

export default function ScheduleShiftClientPage() {
    const [userEmail, setUserEmail] = useState("")
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedView, setSelectedView] = useState<"week" | "month">("week")
    const [shifts, setShifts] = useState(mockShifts)
    const [isAddShiftOpen, setIsAddShiftOpen] = useState(false)
    const [editingShift, setEditingShift] = useState<any>(null)
    const [selectedSeller, setSelectedSeller] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false)
    const [isShiftSwapOpen, setIsShiftSwapOpen] = useState(false)
    const [swapRequests, setSwapRequests] = useState([
        {
            id: "1",
            fromSellerId: "1",
            fromSellerName: "John Doe",
            toSellerId: "2",
            toSellerName: "Jane Smith",
            shiftId: "1",
            shiftDate: "2024-01-15",
            shiftTime: "09:00 - 17:00",
            status: "pending",
            requestDate: "2024-01-14",
            reason: "Family emergency",
        },
    ])
    const router = useRouter()

    // Get current week dates
    const getWeekDates = (date: Date) => {
        const week = []
        const startDate = new Date(date)
        const day = startDate.getDay()
        const diff = startDate.getDate() - day
        startDate.setDate(diff)

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + i)
            week.push(currentDate)
        }
        return week
    }

    const weekDates = getWeekDates(currentDate)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Navigation functions
    const navigateWeek = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
        setCurrentDate(newDate)
    }

    // Filter shifts
    const filteredShifts = shifts.filter((shift) => {
        const matchesSeller = selectedSeller === "all" || shift.sellerId === selectedSeller
        const matchesSearch =
            shift.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shift.location.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSeller && matchesSearch
    })

    // Get shifts for a specific date
    const getShiftsForDate = (date: Date) => {
        const dateStr = date.toISOString().split("T")[0]
        return filteredShifts.filter((shift) => shift.date === dateStr)
    }

    // Add/Edit shift form component
    const ShiftForm = ({ shift, onSave, onClose }: any) => {
        const [formData, setFormData] = useState({
            sellerId: shift?.sellerId || "",
            date: shift?.date || new Date().toISOString().split("T")[0],
            startTime: shift?.startTime || "09:00",
            endTime: shift?.endTime || "17:00",
            location: shift?.location || "",
            status: shift?.status || "scheduled",
        })

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            const seller = mockSellers.find((s) => s.id === formData.sellerId)
            const newShift = {
                id: shift?.id || Date.now().toString(),
                ...formData,
                sellerName: seller?.name || "",
                color: seller?.color || "bg-red-500",
            }
            onSave(newShift)
            onClose()
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label>Seller</Label>
                    <Select value={formData.sellerId} onValueChange={(value) => setFormData({ ...formData, sellerId: value })}>
                        <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                            <SelectValue placeholder="Select seller" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockSellers.map((seller) => (
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

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                            <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                        {location}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {shiftStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    <Badge
                                        variant={status === "completed" ? "default" : status === "cancelled" ? "destructive" : "secondary"}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-rose-200 hover:bg-rose-50 bg-transparent"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                    >
                        Save Shift
                    </Button>
                </div>
            </form>
        )
    }

    // Bulk Shift Creation Component
    const BulkShiftForm = ({ onSave, onClose }: any) => {
        const [bulkData, setBulkData] = useState({
            sellerIds: [] as string[],
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "17:00",
            location: "",
            daysOfWeek: [] as number[],
            template: "custom",
        })

        const templates = [
            { id: "morning", name: "Morning Shift", startTime: "09:00", endTime: "17:00" },
            { id: "evening", name: "Evening Shift", startTime: "13:00", endTime: "21:00" },
            { id: "weekend", name: "Weekend Shift", startTime: "10:00", endTime: "18:00" },
            { id: "custom", name: "Custom", startTime: "09:00", endTime: "17:00" },
        ]

        const daysOfWeek = [
            { id: 0, name: "Sunday" },
            { id: 1, name: "Monday" },
            { id: 2, name: "Tuesday" },
            { id: 3, name: "Wednesday" },
            { id: 4, name: "Thursday" },
            { id: 5, name: "Friday" },
            { id: 6, name: "Saturday" },
        ]

        const handleTemplateChange = (templateId: string) => {
            const template = templates.find((t) => t.id === templateId)
            if (template) {
                setBulkData({
                    ...bulkData,
                    template: templateId,
                    startTime: template.startTime,
                    endTime: template.endTime,
                })
            }
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()

            const newShifts = []
            const startDate = new Date(bulkData.startDate)
            const endDate = new Date(bulkData.endDate)

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                if (bulkData.daysOfWeek.includes(d.getDay())) {
                    bulkData.sellerIds.forEach((sellerId) => {
                        const seller = mockSellers.find((s) => s.id === sellerId)
                        if (seller) {
                            newShifts.push({
                                id: `bulk-${Date.now()}-${sellerId}-${d.getTime()}`,
                                sellerId,
                                sellerName: seller.name,
                                date: d.toISOString().split("T")[0],
                                startTime: bulkData.startTime,
                                endTime: bulkData.endTime,
                                location: bulkData.location,
                                status: "scheduled",
                                color: seller.color,
                            })
                        }
                    })
                }
            }

            onSave(newShifts)
            onClose()
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="sellers" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="sellers">Sellers</TabsTrigger>
                        <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        <TabsTrigger value="template">Template</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sellers" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Sellers</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-rose-200 rounded-lg p-3">
                                {mockSellers.map((seller) => (
                                    <div key={seller.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={seller.id}
                                            checked={bulkData.sellerIds.includes(seller.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setBulkData({
                                                        ...bulkData,
                                                        sellerIds: [...bulkData.sellerIds, seller.id],
                                                    })
                                                } else {
                                                    setBulkData({
                                                        ...bulkData,
                                                        sellerIds: bulkData.sellerIds.filter((id) => id !== seller.id),
                                                    })
                                                }
                                            }}
                                        />
                                        <label htmlFor={seller.id} className="flex items-center gap-2 cursor-pointer">
                                            <div className={`w-3 h-3 rounded-full ${seller.color}`}></div>
                                            <span className="text-sm">{seller.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="schedule" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={bulkData.startDate}
                                    onChange={(e) => setBulkData({ ...bulkData, startDate: e.target.value })}
                                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={bulkData.endDate}
                                    onChange={(e) => setBulkData({ ...bulkData, endDate: e.target.value })}
                                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Days of Week</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {daysOfWeek.map((day) => (
                                    <div key={day.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`day-${day.id}`}
                                            checked={bulkData.daysOfWeek.includes(day.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setBulkData({
                                                        ...bulkData,
                                                        daysOfWeek: [...bulkData.daysOfWeek, day.id],
                                                    })
                                                } else {
                                                    setBulkData({
                                                        ...bulkData,
                                                        daysOfWeek: bulkData.daysOfWeek.filter((d) => d !== day.id),
                                                    })
                                                }
                                            }}
                                        />
                                        <label htmlFor={`day-${day.id}`} className="text-sm cursor-pointer">
                                            {day.name.slice(0, 3)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Select
                                value={bulkData.location}
                                onValueChange={(value) => setBulkData({ ...bulkData, location: value })}
                            >
                                <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    <TabsContent value="template" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Shift Template</Label>
                            <Select value={bulkData.template} onValueChange={handleTemplateChange}>
                                <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name} ({template.startTime} - {template.endTime})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input
                                    type="time"
                                    value={bulkData.startTime}
                                    onChange={(e) => setBulkData({ ...bulkData, startTime: e.target.value })}
                                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Input
                                    type="time"
                                    value={bulkData.endTime}
                                    onChange={(e) => setBulkData({ ...bulkData, endTime: e.target.value })}
                                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Preview ({bulkData.sellerIds.length} sellers selected)</Label>
                            <div className="max-h-48 overflow-y-auto border border-rose-200 rounded-lg p-3 bg-rose-50">
                                {bulkData.sellerIds.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No sellers selected</p>
                                ) : (
                                    <div className="space-y-2">
                                        {bulkData.sellerIds.map((sellerId) => {
                                            const seller = mockSellers.find((s) => s.id === sellerId)
                                            return (
                                                <div key={sellerId} className="flex items-center gap-2 text-sm">
                                                    <div className={`w-3 h-3 rounded-full ${seller?.color}`}></div>
                                                    <span className="font-medium">{seller?.name}</span>
                                                    <span className="text-gray-500">
                                                        • {bulkData.daysOfWeek.length} days/week • {bulkData.startTime}-{bulkData.endTime}•{" "}
                                                        {bulkData.location}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t border-rose-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-rose-200 hover:bg-rose-50 bg-transparent"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={bulkData.sellerIds.length === 0 || bulkData.daysOfWeek.length === 0}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                    >
                        Create {bulkData.sellerIds.length * bulkData.daysOfWeek.length} Shifts
                    </Button>
                </div>
            </form>
        )
    }

    // Shift Swap Management Component
    const ShiftSwapManager = ({ onClose }: any) => {
        const [newSwapRequest, setNewSwapRequest] = useState({
            fromShiftId: "",
            toSellerId: "",
            reason: "",
        })

        const handleApproveSwap = (requestId: string) => {
            const request = swapRequests.find((r) => r.id === requestId)
            if (request) {
                // Update the original shift with new seller
                setShifts((prevShifts) =>
                    prevShifts.map((shift) =>
                        shift.id === request.shiftId
                            ? { ...shift, sellerId: request.toSellerId, sellerName: request.toSellerName }
                            : shift,
                    ),
                )

                // Remove the swap request
                setSwapRequests((prev) => prev.filter((r) => r.id !== requestId))
            }
        }

        const handleRejectSwap = (requestId: string) => {
            setSwapRequests((prev) => prev.filter((r) => r.id !== requestId))
        }

        const createSwapRequest = () => {
            const fromShift = shifts.find((s) => s.id === newSwapRequest.fromShiftId)
            const toSeller = mockSellers.find((s) => s.id === newSwapRequest.toSellerId)

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

                setSwapRequests((prev) => [...prev, newRequest])
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
                                        {mockSellers.map((seller) => (
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

    const handleSaveShift = (shiftData: any) => {
        if (Array.isArray(shiftData)) {
            // Bulk creation
            setShifts([...shifts, ...shiftData])
        } else if (editingShift) {
            // Single edit
            setShifts(shifts.map((s) => (s.id === editingShift.id ? shiftData : s)))
            setEditingShift(null)
        } else {
            // Single creation
            setShifts([...shifts, shiftData])
        }
        setIsAddShiftOpen(false)
        setIsBulkCreateOpen(false)
    }

    const handleDeleteShift = (shiftId: string) => {
        setShifts(shifts.filter((s) => s.id !== shiftId))
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            scheduled: "secondary",
            completed: "default",
            cancelled: "destructive",
            "no-show": "outline",
        }
        return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 relative">
            {/* Header */}
            <header className="z-[10] sticky top-0 left-0 bg-white/80 backdrop-blur-md border-b border-red-100 px-4 py-6 shadow-sm">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="text-red-600 hover:bg-red-50 p-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                Shift Planner
                            </h1>
                            <p className="text-gray-600 font-medium">{userEmail}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isBulkCreateOpen} onOpenChange={setIsBulkCreateOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                                >
                                    <Copy className="h-4 w-4" />
                                    Bulk Create
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-red-600">Bulk Shift Creation</DialogTitle>
                                </DialogHeader>
                                <BulkShiftForm onSave={handleSaveShift} onClose={() => setIsBulkCreateOpen(false)} />
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isShiftSwapOpen} onOpenChange={setIsShiftSwapOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                                >
                                    <ArrowRightLeft className="h-4 w-4" />
                                    Shift Swaps
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-red-600">Shift Swap Management</DialogTitle>
                                </DialogHeader>
                                <ShiftSwapManager onClose={() => setIsShiftSwapOpen(false)} />
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                    <Plus className="h-4 w-4" />
                                    Add Shift
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-red-600">Add New Shift</DialogTitle>
                                </DialogHeader>
                                <ShiftForm onSave={handleSaveShift} onClose={() => setIsAddShiftOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Filters and Controls */}
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
                                        {mockSellers.map((seller) => (
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

                {/* Calendar Grid */}
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                Weekly Schedule
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day Headers */}
                            {weekDates.map((date, index) => (
                                <div key={index} className="p-3 text-center border-b border-red-100">
                                    <div className="font-semibold text-sm">{dayNames[index]}</div>
                                    <div
                                        className={`text-lg ${date.toDateString() === new Date().toDateString() ? "text-red-600 font-bold" : ""}`}
                                    >
                                        {date.getDate()}
                                    </div>
                                </div>
                            ))}

                            {/* Day Cells */}
                            {weekDates.map((date, index) => {
                                const dayShifts = getShiftsForDate(date)
                                return (
                                    <div key={index} className="min-h-[200px] p-2 border-r border-b border-red-50 bg-rose-50/30">
                                        <div className="space-y-1">
                                            {dayShifts.map((shift) => (
                                                <div
                                                    key={shift.id}
                                                    className="p-2 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-l-red-500 hover:shadow-md"
                                                    onClick={() => setEditingShift(shift)}
                                                >
                                                    <div className="font-semibold text-gray-800">{shift.sellerName}</div>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Clock className="h-3 w-3" />
                                                        {shift.startTime} - {shift.endTime}
                                                    </div>
                                                    <div className="text-gray-600">{shift.location}</div>
                                                    <div className="mt-1">{getStatusBadge(shift.status)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sellers Legend */}
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
                            {mockSellers.map((seller) => {
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
            </div>

            {/* Edit Shift Dialog */}
            <Dialog open={!!editingShift} onOpenChange={() => setEditingShift(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-red-600">
                            Edit Shift
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    handleDeleteShift(editingShift.id)
                                    setEditingShift(null)
                                }}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    {editingShift && (
                        <ShiftForm shift={editingShift} onSave={handleSaveShift} onClose={() => setEditingShift(null)} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
