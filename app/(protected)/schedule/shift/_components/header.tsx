"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, ArrowRightLeft, Calendar, Copy, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"

interface ShiftHeaderProps {
    userEmail: string
    isBulkCreateOpen: boolean
    setIsBulkCreateOpen: (open: boolean) => void
    isShiftSwapOpen: boolean
    setIsShiftSwapOpen: (open: boolean) => void
    isAddShiftOpen: boolean
    setIsAddShiftOpen: (open: boolean) => void
    BulkShiftForm: React.ComponentType<any>
    ShiftSwapManager: React.ComponentType<any>
    ShiftForm: React.ComponentType<any>
    handleSaveShift: (shiftData: any) => void
}

export function ShiftHeader({
    userEmail,
    isBulkCreateOpen,
    setIsBulkCreateOpen,
    isShiftSwapOpen,
    setIsShiftSwapOpen,
    isAddShiftOpen,
    setIsAddShiftOpen,
    BulkShiftForm,
    ShiftSwapManager,
    ShiftForm,
    handleSaveShift,
}: ShiftHeaderProps) {
    const router = useRouter()

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-red-100 px-4 py-6 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/dashboard")}
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
    )
}
