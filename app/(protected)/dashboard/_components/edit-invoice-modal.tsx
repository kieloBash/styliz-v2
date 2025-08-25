'use client'
import { useLoading } from '@/components/providers/loading-provider';
import { showToast } from '@/lib/utils';
import { trpc } from '@/server/trpc/client';
import { FullInvoiceType } from '@/types/db';
import UpdateInvoiceForm from '../_forms/update-invoice';
import { UpdateInvoiceType } from '../_schemas';

type Props = {
    isOpen: boolean
    onClose: () => void
    invoice: FullInvoiceType | null
}

const EditInvoiceModal = ({ isOpen, invoice, onClose }: Props) => {
    const platformData = trpc.platform.getList.useQuery();
    const categoryData = trpc.category.getList.useQuery();
    const sellerData = trpc.seller.getList.useQuery();
    const { setIsLoading, setLoadingMessage } = useLoading();
    const utils = trpc.useUtils();
    console.log({ invoice })

    const onUpdateInvoice = trpc.invoice.update.invoice.useMutation({
        onMutate: (data) => {
            setIsLoading(true)
            setLoadingMessage(`Updating invoice ${data.invoiceId}`);
        },
        onSuccess: (data) => {
            if (data.success) {
                showToast("success", "Success", data.message)
                utils.invoice.getList.invalidate()
                onClose();
            } else {
                showToast("error", "Something went wrong!", data.message)
            }
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })

    const handleSaveChanges = async (values: UpdateInvoiceType) => {
        onUpdateInvoice.mutate(values);
    }

    if (isOpen && invoice)
        return (
            <div className='fixed w-screen h-screen top-0 left-0 z-[10] bg-black/70 flex justify-center items-center'>
                {/* <Card className='z-[10] h-[80vh] overflow-auto'>
                    <CardContent> */}
                <UpdateInvoiceForm invoice={invoice} onSave={handleSaveChanges} onClose={onClose}
                    sellers={sellerData.data?.payload}
                    platforms={platformData.data?.payload}
                    categories={categoryData.data?.payload}
                />
                {/* </CardContent>
                    <CardFooter>
                        <Button type='button' onClick={onClose}>Close</Button>
                    </CardFooter>
                </Card> */}
            </div>
        )
}

export default EditInvoiceModal

// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { formatCurrency } from "@/lib/utils"
// import { trpc } from "@/server/trpc/client"
// import { FullInvoiceType } from "@/types/db"
// import { Invoice, InvoiceStatus, Item, ItemStatus } from "@prisma/client"
// import { Calculator, DollarSign, Edit3, Package, Plus, Save, Trash2, UserIcon, X } from "lucide-react"
// import { useEffect, useMemo, useState } from "react"

// interface EditInvoiceModalProps {
//     isOpen: boolean
//     onClose: () => void
//     invoice: FullInvoiceType | null
//     onSaveInvoice: (updatedInvoice: FullInvoiceType) => void
// }

// export function EditInvoiceModal({ isOpen, onClose, invoice, onSaveInvoice }: EditInvoiceModalProps) {
//     const platformData = trpc.platform.getList.useQuery();
//     const categoryData = trpc.category.getList.useQuery();
//     const sellerData = trpc.seller.getList.useQuery();

//     const [editedInvoice, setEditedInvoice] = useState<FullInvoiceType | null>(null)
//     const [isLoading, setIsLoading] = useState(false)

//     const platforms = useMemo(() => platformData.data?.payload ?? [], [platformData.data]);
//     const categories = useMemo(() => categoryData.data?.payload ?? [], [categoryData.data]);
//     const sellers = useMemo(() => sellerData?.data?.payload ?? [], [sellerData.data]);

//     // Initialize edited invoice when modal opens
//     useEffect(() => {
//         if (isOpen && invoice) {
//             setEditedInvoice({ ...invoice, items: [...invoice.items] })
//         }
//     }, [isOpen, invoice])

//     if (!isOpen || !invoice || !editedInvoice) return null

//     const handleSave = async () => {
//         setIsLoading(true)
//         try {
//             // Recalculate totals
//             const activeItems = editedInvoice.items.filter((item) => item.status === "Active")
//             const subTotal = activeItems.reduce((sum, item) => sum + (item.isFreebie ? 0 : item.price * item.quantity), 0)
//             const tax = subTotal * 0.08 // 8% tax rate
//             const grandTotal = subTotal + tax

//             const updatedInvoice = {
//                 ...editedInvoice,
//                 subTotal,
//                 tax,
//                 grandTotal,
//             }

//             await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
//             onSaveInvoice(updatedInvoice)
//             onClose()
//         } catch (error) {
//             console.error("Error saving invoice:", error)
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const updateInvoiceField = (field: keyof Invoice, value: any) => {
//         if (field === "sellerId") {
//             const seller = sellers.find((s) => s.id === value)
//             setEditedInvoice((prev) =>
//                 prev
//                     ? {
//                         ...prev,
//                         sellerId: value,
//                         sellerName: seller?.name || "",
//                         sellerEmail: seller?.email || "",
//                     }
//                     : null,
//             )
//         } else {
//             setEditedInvoice((prev) => (prev ? { ...prev, [field]: value } : null))
//         }
//     }

//     const updateItem = (itemId: string, field: keyof Item, value: any) => {
//         setEditedInvoice((prev) => {
//             if (!prev) return null

//             const updatedItems = prev.items.map((item) => {
//                 if (item.id === itemId) {
//                     if (field === "categoryId") {
//                         const category = categories.find((c) => c.id === value)
//                         return {
//                             ...item,
//                             categoryId: value,
//                             categoryName: category?.name || "",
//                         }
//                     }
//                     return { ...item, [field]: value }
//                 }
//                 return item
//             })

//             return { ...prev, items: updatedItems }
//         })
//     }

//     const removeItem = (itemId: string) => {
//         setEditedInvoice((prev) => {
//             if (!prev) return null
//             return {
//                 ...prev,
//                 items: prev.items.filter((item) => item.id !== itemId),
//             }
//         })
//     }

//     const addNewItem = () => {
//         const newItem: Item = {
//             id: `new-${Date.now()}`,
//             price: 0,
//             categoryId: categories[0].id,
//             categoryName: categories[0].name,
//             isFreebie: false,
//             quantity: 1,
//             status: "Active",
//         }

//         setEditedInvoice((prev) => {
//             if (!prev) return null
//             return {
//                 ...prev,
//                 items: [...prev.items, newItem],
//             }
//         })
//     }

//     const getStatusBadgeColor = (status: string) => {
//         switch (status) {
//             case "Completed":
//             case "Active":
//                 return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
//             case "Pending":
//                 return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0"
//             case "Cancelled":
//                 return "bg-gradient-to-r from-red-400 to-red-500 text-white border-0"
//             case "Returned":
//                 return "bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0"
//             default:
//                 return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
//         }
//     }

//     const getCategoryColor = (categoryName: string) => {
//         const category = categories.find((c) => c.name === categoryName)
//         return category?.color || "from-gray-500 to-gray-600"
//     }

//     const getCategoryIcon = (categoryName: string) => {
//         const category = categories.find((c) => c.name === categoryName)
//         return category?.icon || "📦"
//     }

//     // Calculate totals for display
//     const activeItems = editedInvoice.items.filter((item) => item.status === ItemStatus.COMPLETED)
//     const calculatedSubTotal = activeItems.reduce(
//         (sum, item) => sum + item.price,
//         0,
//     )
//     const calculatedTax = calculatedSubTotal * 0.08
//     const calculatedGrandTotal = calculatedSubTotal + calculatedTax

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
//                 {/* Compact Header */}
//                 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <Edit3 className="h-5 w-5" />
//                             <div>
//                                 <h2 className="text-lg font-bold">Edit Invoice {editedInvoice.id}</h2>
//                                 <p className="text-blue-100 text-sm">{editedInvoice.sku}</p>
//                             </div>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-lg">
//                             <X className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Compact Content */}
//                 <div className="flex-1 overflow-y-auto max-h-[calc(95vh-140px)]">
//                     <div className="p-4 space-y-4">
//                         {/* Invoice & Customer Info - Side by Side */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                             {/* Invoice Details */}
//                             <Card className="border-blue-200">
//                                 <CardHeader className="pb-2">
//                                     <CardTitle className="text-sm flex items-center gap-2">
//                                         <Package className="h-4 w-4 text-blue-600" />
//                                         Invoice Details
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-3">
//                                     <div className="grid grid-cols-2 gap-3">
//                                         <div className="space-y-1">
//                                             <Label className="text-xs text-gray-600">Status</Label>
//                                             <Select
//                                                 value={editedInvoice.status}
//                                                 onValueChange={(value: "Completed" | "Pending" | "Cancelled") =>
//                                                     updateInvoiceField("status", value)
//                                                 }
//                                             >
//                                                 <SelectTrigger className="h-8 text-sm">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {Object.keys(InvoiceStatus).map((status) => (
//                                                         <SelectItem key={status} value={status}>
//                                                             <Badge className={getStatusBadgeColor(status)}>{status}</Badge>
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
// <div className="space-y-1">
//     <Label className="text-xs text-gray-600">Platform</Label>
//     <Select
//         value={editedInvoice.platform.id}
//         onValueChange={(value: string) =>
//             updateInvoiceField("platformId", value)
//         }
//     >
//         <SelectTrigger className="h-8 text-sm">
//             <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//             {platforms.map((platform) => (
//                 <SelectItem key={platform.id} value={platform.id}>
//                     {platform.name}
//                 </SelectItem>
//             ))}
//         </SelectContent>
//     </Select>
// </div>
//                                     </div>
//                                     <div className="space-y-1">
//                                         <Label className="text-xs text-gray-600">Seller</Label>
//                                         <Select
//                                             value={editedInvoice.seller.id}
//                                             onValueChange={(value) => updateInvoiceField("sellerId", value)}
//                                         >
//                                             <SelectTrigger className="h-8 text-sm">
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {sellers.map((seller) => (
//                                                     <SelectItem key={seller.id} value={seller.id}>
//                                                         <div className="flex flex-col">
//                                                             <span className="font-medium text-sm">{seller.name}</span>
//                                                             <span className="text-xs text-gray-500">{seller.email}</span>
//                                                         </div>
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Customer & Summary */}
//                             <Card className="border-green-200">
//                                 <CardHeader className="pb-2">
//                                     <CardTitle className="text-sm flex items-center gap-2">
//                                         <UserIcon className="h-4 w-4 text-green-600" />
//                                         Customer & Summary
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-3">
//                                     <div className="bg-green-50 p-2 rounded-lg">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
//                                                 {editedInvoice.customer.name.charAt(0)}
//                                             </div>
//                                             <div>
//                                                 <div className="font-medium text-sm">{editedInvoice.customer.name}</div>
//                                                 <div className="text-xs text-gray-600">{editedInvoice.customer.name}</div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg">
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-xs text-gray-600">Subtotal:</span>
//                                             <span className="font-semibold text-sm">${calculatedSubTotal.toFixed(2)}</span>
//                                         </div>
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-xs text-gray-600">Tax (8%):</span>
//                                             <span className="font-semibold text-sm">${calculatedTax.toFixed(2)}</span>
//                                         </div>
//                                         <Separator className="my-1" />
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-sm font-bold">Total:</span>
//                                             <span className="text-lg font-bold text-green-600">${calculatedGrandTotal.toFixed(2)}</span>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* Compact Items List */}
//                         <Card className="border-purple-200">
//                             <CardHeader className="pb-2">
//                                 <div className="flex items-center justify-between">
//                                     <CardTitle className="text-sm flex items-center gap-2">
//                                         <Package className="h-4 w-4 text-purple-600" />
//                                         Items ({editedInvoice.items.length})
//                                     </CardTitle>
//                                     <Button
//                                         onClick={addNewItem}
//                                         size="sm"
//                                         className="h-7 px-2 text-xs bg-purple-500 hover:bg-purple-600 text-white"
//                                     >
//                                         <Plus className="h-3 w-3 mr-1" />
//                                         Add
//                                     </Button>
//                                 </div>
//                             </CardHeader>
//                             <CardContent className="space-y-2">
//                                 {editedInvoice.items.map((item, index) => (
//                                     <div key={item.id} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <div className="flex items-center gap-2">
//                                                 <span className="text-lg">{getCategoryIcon(item.category.name)}</span>
//                                                 <div className="flex items-center gap-1">
//                                                     <Badge className={getStatusBadgeColor(item.status)}>{item.status}</Badge>
//                                                 </div>
//                                                 <span className="text-xs text-gray-600">#{index + 1}</span>
//                                             </div>
//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() => removeItem(item.id)}
//                                                 className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
//                                             >
//                                                 <Trash2 className="h-3 w-3" />
//                                             </Button>
//                                         </div>

//                                         <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
//                                             <div className="space-y-1">
//                                                 <Label className="text-xs text-gray-600">Status</Label>
//                                                 <Select
//                                                     value={item.status}
//                                                     onValueChange={(value: "Active" | "Cancelled" | "Returned") =>
//                                                         updateItem(item.id, "status", value)
//                                                     }
//                                                 >
//                                                     <SelectTrigger className="h-7 text-xs">
//                                                         <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {Object.keys(ItemStatus).map((status) => (
//                                                             <SelectItem key={`item-${status}`} value={status}>
//                                                                 {status}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </div>

//                                             <div className="space-y-1">
//                                                 <Label className="text-xs text-gray-600">Category</Label>
//                                                 <Select
//                                                     value={item.categoryId}
//                                                     onValueChange={(value) => updateItem(item.id, "categoryId", value)}
//                                                 >
//                                                     <SelectTrigger className="h-7 text-xs">
//                                                         <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {categories.map((category) => (
//                                                             <SelectItem key={category.id} value={category.id}>
//                                                                 <div className="flex items-center gap-1">
//                                                                     <span className="text-sm">{category.icon}</span>
//                                                                     <span className="text-xs">{category.name}</span>
//                                                                 </div>
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </div>

//                                             <div className="space-y-1">
//                                                 <Label className="text-xs text-gray-600">Price</Label>
//                                                 <Input
//                                                     type="number"
//                                                     step="0.01"
//                                                     value={item.price}
//                                                     onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
//                                                     className="h-7 text-xs"
//                                                 />
//                                             </div>

//                                             <div className="space-y-1">
//                                                 <Label className="text-xs text-gray-600">Total</Label>
//                                                 <div className="h-7 flex items-center">
//                                                     <span className="text-xs font-bold">
//                                                         {formatCurrency(item.price)}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}

//                                 {editedInvoice.items.length === 0 && (
//                                     <div className="text-center py-6 text-gray-500">
//                                         <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
//                                         <p className="text-sm">No items in this invoice</p>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>

//                 {/* Compact Footer */}
//                 <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
//                     <div className="flex gap-2">
//                         <Button
//                             variant="outline"
//                             onClick={onClose}
//                             disabled={isLoading}
//                             className="flex-1 h-9 text-sm bg-transparent"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleSave}
//                             disabled={isLoading}
//                             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-9 text-sm font-medium"
//                         >
//                             {isLoading ? (
//                                 <div className="flex items-center gap-1">
//                                     <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                                     Saving...
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-1">
//                                     <Save className="h-3 w-3" />
//                                     Save Changes
//                                 </div>
//                             )}
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
