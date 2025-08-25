"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface BulkShiftFormProps {
    onSave: (shifts: any[]) => void
    onClose: () => void
    sellers: any[]
    locations: string[]
}

export function BulkShiftForm({ onSave, onClose, sellers, locations }: BulkShiftFormProps) {
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

        const newShifts: any[] = []
        const startDate = new Date(bulkData.startDate)
        const endDate = new Date(bulkData.endDate)

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (bulkData.daysOfWeek.includes(d.getDay())) {
                bulkData.sellerIds.forEach((sellerId) => {
                    const seller = sellers.find((s) => s.id === sellerId)
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
                            {sellers.map((seller) => (
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
                        <Select value={bulkData.location} onValueChange={(value) => setBulkData({ ...bulkData, location: value })}>
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
                                        const seller = sellers.find((s) => s.id === sellerId)
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
