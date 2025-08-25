"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ShiftFormProps {
    shift?: any
    onSave: (shiftData: any) => void
    onClose: () => void
    sellers: any[]
    locations: string[]
    shiftStatuses: string[]
}

export function ShiftForm({ shift, onSave, onClose, sellers, locations, shiftStatuses }: ShiftFormProps) {
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
        const seller = sellers.find((s) => s.id === formData.sellerId)
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
