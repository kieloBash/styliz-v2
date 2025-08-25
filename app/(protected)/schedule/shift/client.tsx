"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CalendarGrid } from "./_components/calendar-grid"
import { ShiftHeader } from "./_components/header"
import { SellersLegend } from "./_components/sellers-legend"
import { ShiftControls } from "./_components/shift-controls"
import { ShiftSwapManager } from "./_components/shift-swap-manager"
import { BulkShiftForm } from "./_forms/bulk-shift-form"
import { ShiftForm } from "./_forms/shift-form"

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

export default function ShiftScheduleClientPage() {
    const [userEmail, setUserEmail] = useState("")
    const [currentDate, setCurrentDate] = useState(new Date())
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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">
            <ShiftHeader
                userEmail={userEmail}
                isBulkCreateOpen={isBulkCreateOpen}
                setIsBulkCreateOpen={setIsBulkCreateOpen}
                isShiftSwapOpen={isShiftSwapOpen}
                setIsShiftSwapOpen={setIsShiftSwapOpen}
                isAddShiftOpen={isAddShiftOpen}
                setIsAddShiftOpen={setIsAddShiftOpen}
                BulkShiftForm={() => (
                    <BulkShiftForm
                        onSave={handleSaveShift}
                        onClose={() => setIsBulkCreateOpen(false)}
                        sellers={mockSellers}
                        locations={locations}
                    />
                )}
                ShiftSwapManager={() => (
                    <ShiftSwapManager
                        onClose={() => setIsShiftSwapOpen(false)}
                        swapRequests={swapRequests}
                        setSwapRequests={setSwapRequests}
                        shifts={shifts}
                        setShifts={setShifts}
                        sellers={mockSellers}
                    />
                )}
                ShiftForm={() => (
                    <ShiftForm
                        onSave={handleSaveShift}
                        onClose={() => setIsAddShiftOpen(false)}
                        sellers={mockSellers}
                        locations={locations}
                        shiftStatuses={shiftStatuses}
                    />
                )}
                handleSaveShift={handleSaveShift}
            />

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <ShiftControls
                    weekDates={weekDates}
                    navigateWeek={navigateWeek}
                    setCurrentDate={setCurrentDate}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedSeller={selectedSeller}
                    setSelectedSeller={setSelectedSeller}
                    sellers={mockSellers}
                />

                <CalendarGrid
                    weekDates={weekDates}
                    dayNames={dayNames}
                    getShiftsForDate={getShiftsForDate}
                    setEditingShift={setEditingShift}
                    getStatusBadge={getStatusBadge}
                />

                <SellersLegend sellers={mockSellers} filteredShifts={filteredShifts} />
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
                        <ShiftForm
                            shift={editingShift}
                            onSave={handleSaveShift}
                            onClose={() => setEditingShift(null)}
                            sellers={mockSellers}
                            locations={locations}
                            shiftStatuses={shiftStatuses}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
