import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { FullCustomerType } from '@/types/db'
import { Clock, Mail, Phone, User } from 'lucide-react'
import { useMemo } from 'react'

type Props = {
    data: FullCustomerType[]
}
const AdminRecentCustomerCard = ({ data }: Props) => {
    const recentCustomers = useMemo(() => data ?? [], [data])

    return (
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Recent Customers
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {recentCustomers.length > 0 ? (
                    <>
                        {recentCustomers.slice(0, 5).map((customer) => (
                            <div
                                key={customer.id}
                                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 text-sm">{customer.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Joined</div>
                                    <div className="text-sm font-medium text-gray-900">{formatDate(new Date(customer.createdAt).toDateString())}</div>
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            className="w-full mt-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                        >
                            View All Customers
                        </Button>
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No recent customers</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default AdminRecentCustomerCard