'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FullCustomerType } from '@/types/db'
import { Crown, TrendingUp, User } from 'lucide-react'
import { useMemo } from 'react'

type Props = {
    data: FullCustomerType[]
}
const AdminTopCustomerCard = ({ data }: Props) => {
    const topCustomers = useMemo(() => data ?? [], [data])

    return (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Crown className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Top Customers
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {topCustomers.length > 0 ? (
                    <>
                        {topCustomers.slice(0, 5).map((customer, index) => {
                            const totalSpent = customer.invoices.reduce((prev, current) => current.subTotal + prev, 0)
                            const totalItems = customer.invoices.reduce((prev, current) => prev + current.items.length, 0)

                            return (
                                <div
                                    key={customer.id}
                                    className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                    <Crown className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 text-sm">{customer.name}</span>
                                                {index < 3 && (
                                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5">
                                                        #{index + 1}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                                <span>{customer.invoices.length} orders</span>
                                                <span>•</span>
                                                <span>{totalItems} items</span>
                                                {/* {customer.invoices.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Last: {formatDate(new Date(customer.invoices[0].dateIssued).toDateString())}</span>
                                                    </>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 text-sm">{formatCurrency(totalSpent)}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            Total Spent
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <Button
                            variant="outline"
                            className="w-full mt-3 border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 bg-transparent"
                        >
                            View Customer Analytics
                        </Button>
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Crown className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No customer data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default AdminTopCustomerCard