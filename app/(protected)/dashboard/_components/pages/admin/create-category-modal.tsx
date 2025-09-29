"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, Plus, X } from "lucide-react"
import { useState } from "react"
import { CreateItemCategoryType } from "@/app/(protected)/live/_schema"
import { formatCurrency } from "@/lib/utils"

interface CreateCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateCategory: (category: CreateItemCategoryType) => void
}

const predefinedColors = [
    "from-red-500 to-rose-500",
    "from-pink-500 to-red-500",
    "from-red-600 to-rose-600",
    "from-rose-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-red-500 to-pink-500",
    "from-rose-600 to-red-600",
    "from-pink-600 to-rose-600",
    "from-red-400 to-rose-400",
    "from-rose-400 to-pink-400",
    "from-purple-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-blue-500 to-indigo-500",
    "from-cyan-500 to-blue-500",
    "from-teal-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-lime-500 to-green-500",
    "from-yellow-500 to-lime-500",
    "from-amber-500 to-yellow-500",
    "from-orange-500 to-amber-500",
]

const commonIcons = [
    "👔",
    "🧥",
    "👗",
    "👠",
    "👜",
    "🧢",
    "👖",
    "👕",
    "🧦",
    "🥿",
    "👒",
    "🎒",
    "💍",
    "⌚",
    "🕶️",
    "🧤",
    "🧣",
    "👘",
    "👚",
    "🩱",
]

export function CreateCategoryModal({ isOpen, onClose, onCreateCategory }: CreateCategoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        icon: "👔",
        color: "from-red-500 to-rose-500",
        quickPrices: [] as number[],
    })
    const [newPrice, setNewPrice] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        onCreateCategory(formData)
        handleClose()
    }

    const handleClose = () => {
        setFormData({
            name: "",
            icon: "👔",
            color: "from-red-500 to-rose-500",
            quickPrices: [],
        })
        setNewPrice("")
        setErrors({})
        onClose()
    }

    const addQuickPrice = () => {
        const price = Number.parseFloat(newPrice)
        if (!isNaN(price) && price > 0) {
            setFormData((prev) => ({
                ...prev,
                quickPrices: [...prev.quickPrices, price], // Store as dollars, not cents
            }))
            setNewPrice("")
        }
    }

    const removeQuickPrice = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            quickPrices: prev.quickPrices.filter((_, i) => i !== index),
        }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                        Create New Category
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Blazers, Dresses, Accessories"
                            className="border-red-200 focus:border-red-400 focus:ring-red-400"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Category Icon</Label>
                        <div className="grid grid-cols-10 gap-2">
                            {commonIcons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-lg ${formData.icon === icon
                                            ? "border-red-500 bg-red-50 scale-110"
                                            : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Category Color
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                            {predefinedColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`h-10 rounded-lg border-2 transition-all duration-200 bg-gradient-to-r ${color} ${formData.color === color ? "border-gray-900 scale-105" : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Quick Prices (Optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="Enter price"
                                className="border-red-200 focus:border-red-400 focus:ring-red-400"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addQuickPrice()
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={addQuickPrice}
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {formData.quickPrices.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.quickPrices.map((price, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                                        onClick={() => removeQuickPrice(index)}
                                    >
                                        {formatCurrency(price)}
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-500">Add common prices for this category to speed up item creation</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                        >
                            Create Category
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
