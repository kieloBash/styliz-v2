"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, Lock, Mail, Plus, UserPlus, X } from "lucide-react"
import { useState } from "react"
import { NewSellerSchemaType } from "../../../_schemas"

interface CreateSellerModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateSeller: (seller: NewSellerSchemaType) => void
}

export function CreateSellerModal({ isOpen, onClose, onCreateSeller }: CreateSellerModalProps) {
    const [formData, setFormData] = useState<NewSellerSchemaType>({
        name: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    if (!isOpen) return null

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.password.trim()) newErrors.password = "Password is required"
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            onCreateSeller(formData)

            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
            })

            onClose()
        } catch (error) {
            console.error("Error creating seller:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: keyof NewSellerSchemaType, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Create New Seller</h2>
                                <p className="text-purple-100 text-sm">Add a new seller to the platform</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-xl"
                            disabled={isSubmitting}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={`border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 ${errors.name ? "border-red-400" : ""
                                }`}
                            placeholder="Enter seller's full name"
                        />
                        {errors.name && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email Address *
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={`pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 ${errors.email ? "border-red-400" : ""
                                    }`}
                                placeholder="seller@example.com"
                            />
                        </div>
                        {errors.email && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertCircle className="h-3 w-3" />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password *
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className={`pl-10 pr-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-12 ${errors.password ? "border-red-400" : ""
                                    }`}
                                placeholder="Enter password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-purple-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {errors.password && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertCircle className="h-3 w-3" />
                                {errors.password}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 border-gray-300 hover:bg-gray-100 h-12 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white h-12 font-semibold"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Seller
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
