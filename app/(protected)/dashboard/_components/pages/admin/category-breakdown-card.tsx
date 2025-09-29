"use client"

import { CreateItemCategoryType } from "@/app/(protected)/live/_schema"
import { useLoading } from "@/components/providers/loading-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, showToast } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import { ItemPerformanceDTO } from "@/types/dto/item-category-performance"
import { Package, Plus } from "lucide-react"
import { useState } from "react"
import { CreateCategoryModal } from "./create-category-modal"

interface CategoryBreakdownCardProps {
    categories: ItemPerformanceDTO[]
}

export function CategoryBreakdownCard({ categories }: CategoryBreakdownCardProps) {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const { isLoading, setIsLoading, setLoadingMessage } = useLoading();
    const utils = trpc.useUtils();


    const getCategoryMetrics = (category: ItemPerformanceDTO) => {
        const completedTotal = category.totals.find((t) => t.status === "COMPLETED")?.totalPrice || 0
        const totalRevenue = category.totals.reduce((sum, total) => sum + total.totalPrice, 0)
        const totalItems = category.totals.length > 0 ? category.totals.reduce((sum, total) => sum + 1, 0) : 0

        return {
            totalRevenue,
            completedRevenue: completedTotal,
            totalItems,
        }
    }

    const { mutate } = trpc.category.create.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage(`Creating new category...`);
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message)
            utils.invoice.getList.invalidate()
            utils.invoice.getDashboardAnalytics.invalidate()
            utils.category.getList.invalidate()
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })

    const onCreateCategory = (category: CreateItemCategoryType) => {
        mutate({ ...category })
    }

    const totalCategoryRevenue = categories.reduce((sum, cat) => {
        return sum + cat.totals.reduce((catSum, total) => catSum + total.totalPrice, 0)
    }, 0)

    const totalCategoryItems = categories.reduce((sum, cat) => {
        return sum + cat.totals.length
    }, 0)

    return (
        <>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            Category Breakdown
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            {categories.length} categories • {totalCategoryItems} total items • {formatCurrency(totalCategoryRevenue)}{" "}
                            revenue
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Category
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        {categories.map((category) => {
                            const metrics = getCategoryMetrics(category)
                            return (
                                <Card
                                    key={category.id}
                                    className="border border-red-100 hover:border-red-200 transition-colors duration-200 bg-gradient-to-br from-red-50/50 to-rose-50/50"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-sm`}
                                                >
                                                    <span className="text-sm">{category.icon}</span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                                            </div>
                                            <Package className="h-4 w-4 text-gray-400" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Total Revenue</span>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">{formatCurrency(metrics.totalRevenue)}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Completed</span>
                                                <div className="text-right">
                                                    <div className="font-semibold text-green-600">{formatCurrency(metrics.completedRevenue)}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Total Items</span>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">{metrics.totalItems}</div>
                                                </div>
                                            </div>

                                            {/* Status Breakdown */}
                                            {category.totals.length > 0 && (
                                                <div className="pt-2 border-t border-red-100">
                                                    <div className="text-xs text-gray-500 mb-1">Status Breakdown</div>
                                                    <div className="space-y-1">
                                                        {category.totals.map((total, index) => (
                                                            <div key={index} className="flex justify-between items-center text-xs">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={`text-xs ${total.status === "COMPLETED"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : total.status === "JOYJOY"
                                                                            ? "bg-purple-100 text-purple-700"
                                                                            : "bg-gray-100 text-gray-700"
                                                                        }`}
                                                                >
                                                                    {total.status}
                                                                </Badge>
                                                                <span className="font-medium text-gray-700">{formatCurrency(total.totalPrice)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quick Prices */}
                                            {category.quickPrices.length > 0 && (
                                                <div className="pt-2 border-t border-red-100">
                                                    <div className="text-xs text-gray-500 mb-1">Quick Prices</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {category.quickPrices.map((price, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-xs bg-red-100 text-red-700 hover:bg-red-200"
                                                            >
                                                                {formatCurrency(price)}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {categories.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Create your first item category to start organizing your inventory.
                                </p>
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Category
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <CreateCategoryModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateCategory={onCreateCategory}
            />
        </>
    )
}
