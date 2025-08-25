"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import type React from "react"

interface CalendarGridProps {
    weekDates: Date[]
    dayNames: string[]
    getShiftsForDate: (date: Date) => any[]
    setEditingShift: (shift: any) => void
    getStatusBadge: (status: string) => React.ReactNode
}

export function CalendarGrid({
    weekDates,
    dayNames,
    getShiftsForDate,
    setEditingShift,
    getStatusBadge,
}: CalendarGridProps) {
    return (
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
    )
}
