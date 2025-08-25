"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { FullInvoiceType, FullItemType } from "@/types/db"
import { zodResolver } from "@hookform/resolvers/zod"
import { InvoiceStatus, type ItemCategory, ItemStatus, type Platform, type User } from "@prisma/client"
import { Calendar, Monitor, Package, Plus, RotateCcw, Trash2, UserIcon } from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { UpdateInvoiceSchema, type UpdateInvoiceType } from "../_schemas"

type Props = {
    invoice: FullInvoiceType
    platforms?: Platform[]
    categories?: ItemCategory[]
    sellers?: Pick<User, "id" | "name" | "email">[]
    onSave: (values: UpdateInvoiceType) => void
    onClose: () => void
}

type ItemBaskets = "removedItems" | "updatedItems" | "newItems"

export default function UpdateInvoiceForm({ invoice, platforms = [], categories = [], sellers = [], onSave, onClose }: Props) {
    const formatToItems = (i: FullItemType) => {
        return {
            id: i.id,
            itemId: i.id,
            price: i.price,
            status: i.status,
            category: { id: i.category.id, name: i.category.name },
        }
    }

    const form = useForm<UpdateInvoiceType>({
        resolver: zodResolver(UpdateInvoiceSchema),
        defaultValues: {
            invoiceId: invoice.id,
            freebies: 0,
            dateIssued: new Date(invoice.dateIssued).toISOString().split("T")[0],
            status: InvoiceStatus.COMPLETED,
            platform: { id: invoice.platform.id, name: invoice.platform.name },
            seller: { id: invoice.seller.id, name: invoice.seller.name },
            customer: { id: invoice.customer.id, name: invoice.customer.name },
            updatedItems: invoice.items.map((i) => formatToItems(i)),
            newItems: [],
            removedItems: [],
        },
    })

    const updatedItems = useFieldArray({
        control: form.control,
        name: "updatedItems" as ItemBaskets,
    })

    const newItems = useFieldArray({
        control: form.control,
        name: "newItems" as ItemBaskets,
    })

    const removedItems = useFieldArray({
        control: form.control,
        name: "removedItems" as ItemBaskets,
    })

    const onSubmit = (data: UpdateInvoiceType) => {
        console.log("Submitted Invoice", data)
        onSave(data)
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-500 text-white"
            case "PENDING":
                return "bg-yellow-500 text-white"
            case "CANCELLED":
                return "bg-red-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }

    const getSellerSelect = () => (
        <div className="space-y-1">
            <Label className="text-xs text-gray-600 flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                Seller
            </Label>
            <Controller
                control={form.control}
                name="seller"
                render={({ field }) => (
                    <Select
                        onValueChange={(val) => {
                            const selected = sellers.find((s) => s.id === val)
                            if (selected) {
                                field.onChange({ id: selected.id, name: selected.name })
                            }
                        }}
                        value={field.value.id}
                    >
                        <SelectTrigger className="h-8 text-sm w-full">
                            <SelectValue placeholder="Choose seller" />
                        </SelectTrigger>
                        <SelectContent>
                            {sellers.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{d.name}</span>
                                        <span className="text-xs text-gray-500">{d.email}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    )

    const getPlatformSelect = () => (
        <div className="space-y-1">
            <Label className="text-xs text-gray-600 flex items-center gap-1">
                <Monitor className="h-3 w-3" />
                Platform
            </Label>
            <Controller
                control={form.control}
                name="platform"
                render={({ field }) => (
                    <Select
                        onValueChange={(val) => {
                            const selected = platforms.find((s) => s.id === val)
                            if (selected) {
                                field.onChange({ id: selected.id, name: selected.name })
                            }
                        }}
                        value={field.value.id}
                    >
                        <SelectTrigger className="h-8 text-sm w-full">
                            <SelectValue placeholder="Choose platform" />
                        </SelectTrigger>
                        <SelectContent>
                            {platforms.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    )

    const getCategorySelect = (name: `${ItemBaskets}.${number}.category`, disabled?: boolean) => (
        <Controller
            control={form.control}
            name={name}
            render={({ field }) => (
                <Select
                    disabled={disabled}
                    onValueChange={(val) => {
                        const selected = categories.find((s) => s.id === val)
                        if (selected) {
                            field.onChange({ id: selected.id, name: selected.name })
                        }
                    }}
                    value={field.value.id}
                >
                    <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                                {d.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
    )

    const getItemStatusSelect = (name: `${ItemBaskets}.${number}.status`, disabled?: boolean) => (
        <Controller
            control={form.control}
            name={name}
            render={({ field }) => (
                <Select
                    onValueChange={(val) => {
                        field.onChange(val)
                    }}
                    disabled={disabled}
                    value={field.value}
                >
                    <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(ItemStatus).map((d) => (
                            <SelectItem key={`${d}-item`} value={d}>
                                <Badge className={getStatusBadgeColor(d)} variant="secondary">
                                    {d}
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
    )

    const getInvoiceStatusSelect = () => (
        <div className="space-y-1">
            <Label className="text-xs text-gray-600">Status</Label>
            <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-8 text-sm w-full">
                            <SelectValue placeholder="Choose status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(InvoiceStatus).map((d) => (
                                <SelectItem key={`${d}-invoice`} value={d}>
                                    <Badge className={getStatusBadgeColor(d)} variant="secondary">
                                        {d}
                                    </Badge>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    )

    const getItem = (type: "existing" | "new" | "removed") => {
        let items = null
        let itemsString: ItemBaskets | null = null
        let title = ""
        let bgColor = ""
        let borderColor = ""

        switch (type) {
            case "existing":
                items = updatedItems
                itemsString = "updatedItems"
                title = "Current Items"
                bgColor = "bg-blue-50"
                borderColor = "border-blue-200"
                break
            case "new":
                items = newItems
                itemsString = "newItems"
                title = "New Items"
                bgColor = "bg-green-50"
                borderColor = "border-green-200"
                break
            case "removed":
                items = removedItems
                itemsString = "removedItems"
                title = "Removed Items"
                bgColor = "bg-red-50"
                borderColor = "border-red-200"
                break
        }

        const isDisabled = type === "removed"
        if (!items || !itemsString) return null

        return (
            <Card className={`${borderColor}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {title} ({items.fields.length})
                        </CardTitle>
                        {type === "existing" && (
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() =>
                                    newItems.append({
                                        id: `new-${newItems.fields.length}`,
                                        itemId: `new-${newItems.fields.length}`,
                                        price: 0,
                                        category: { id: categories[0]?.id || "", name: categories[0]?.name || "" },
                                        status: ItemStatus.COMPLETED as any,
                                    })
                                }
                                className="h-7 px-2 text-xs"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Item
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {items.fields.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No {title.toLowerCase()}</p>
                        </div>
                    ) : (
                        items.fields.map((item, index) => {
                            const name = `${itemsString}.${index}` as `${ItemBaskets}.${number}`
                            return (
                                <div key={item.id} className={`${bgColor} p-3 rounded-lg border ${borderColor}`}>
                                    <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-6 gap-1 items-center">
                                        <div className="space-y-1">
                                            {/* <Label className="text-xs text-gray-600">Price</Label> */}
                                            <Input
                                                disabled={isDisabled}
                                                placeholder="0.00"
                                                type="number"
                                                step="0.01"
                                                className="h-9 text-xs"
                                                {...form.register(`${name}.price`, { valueAsNumber: true })}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            {/* <Label className="text-xs text-gray-600">Category</Label> */}
                                            {getCategorySelect(`${name}.category`, isDisabled)}
                                        </div>

                                        <div className="space-y-1">
                                            {/* <Label className="text-xs text-gray-600">Status</Label> */}
                                            {getItemStatusSelect(`${name}.status`, isDisabled)}
                                        </div>

                                        <div className="space-y-1 lg:col-span-1 col-span-3">
                                            {/* <Label className="text-xs text-gray-600">Action</Label> */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                type="button"
                                                onClick={() => {
                                                    const currentItem = items.fields[index]
                                                    if (type === "existing") {
                                                        removedItems.append(currentItem)
                                                    } else if (type === "removed") {
                                                        updatedItems.append(currentItem)
                                                    }
                                                    items.remove(index)
                                                }}
                                                className="h-7 px-2 text-xs lg:w-auto w-full"
                                            >
                                                {type === "removed" ? (
                                                    <>
                                                        <RotateCcw className="h-3 w-3 mr-1" />
                                                        Restore
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Remove
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4 w-2xl">
            {/* Invoice Details */}
            <Card className="border-gray-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Invoice Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative overflow-y-auto max-h-[60vh]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-600 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Date Issued
                                </Label>
                                <Input type="date" className="h-8 text-sm" {...form.register("dateIssued")} />
                            </div>

                            {getInvoiceStatusSelect()}

                            <div className="space-y-1">
                                <Label className="text-xs text-gray-600">Customer</Label>
                                <div className="h-8 flex items-center px-3 bg-gray-50 rounded-md border">
                                    <span className="text-sm text-gray-700">{invoice.customer.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-600">Freebie</Label>
                                <Input
                                    placeholder="0.00"
                                    type="number"
                                    step="1"
                                    className="h-9 text-xs"
                                    {...form.register(`freebies`, { valueAsNumber: true })}
                                />
                            </div>
                            {getSellerSelect()}
                            {getPlatformSelect()}
                        </div>

                        <Separator />

                        {/* Items Sections */}
                        <div className="space-y-4">
                            {getItem("existing")}
                            {newItems.fields.length > 0 && getItem("new")}
                            {removedItems.fields.length > 0 && getItem("removed")}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end items-center gap-2 pt-4 border-t sticky bottom-0 left-0 w-full bg-white z-[10]">
                            <div className="flex items-center gap-2">
                                {form.formState.isDirty && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => form.reset()}
                                        className="h-8 px-3 text-xs"
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1" />
                                        Reset Changes
                                    </Button>
                                )}
                            </div>
                            <Button
                                disabled={!form.formState.isDirty}
                                type="submit"
                                size="sm"
                                className="h-8 px-4 text-xs bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Save Invoice
                            </Button>

                            <Button
                                type="submit"
                                size="sm"
                                variant={"outline"}
                                className="h-8 px-4 text-x"
                                onClick={onClose}
                            >
                                Close
                            </Button>

                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
