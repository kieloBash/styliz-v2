import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { AnalyticsChangeData } from '@/types/global';
import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react';

type Props = {
    totalRevenue: AnalyticsChangeData;
    activeSellers: AnalyticsChangeData;
    totalInvoices: AnalyticsChangeData;
}
const AdminStatsCards = ({ totalRevenue, totalInvoices, activeSellers }: Props) => {

    const totalCustomers = 0;

    const getIcon = (Icon: any) => {
        return <Icon className="h-3 w-3" />
    }

    const getContent = (data: AnalyticsChangeData, type: "currency" | "item" | "none") => {
        console.log(data)
        const displayType = (value: number) => {
            switch (type) {
                case 'currency': return formatCurrency(value);
                case 'item': return `${value} items`;
                case "none": return value;
                default: return value;
            }
        }

        return (
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold">{displayType(data.value)}</div>
                {data.change && data.prevValue !== undefined && data.prevValue > 0 && (
                    <p className="text-xs text-red-200 flex items-center gap-1 mt-1">
                        {getIcon(formatPercentage(data.change).Icon)}
                        {formatPercentage(data.change).value} from last month of                         {displayType(data.prevValue)}
                    </p>
                )}
            </CardContent>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-rose-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-red-100">Total Revenue</CardTitle>
                    <DollarSign className="h-5 w-5 text-red-200" />
                </CardHeader>
                {getContent(totalRevenue, "currency")}
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-rose-100">Active Sellers</CardTitle>
                    <Users className="h-5 w-5 text-rose-200" />
                </CardHeader>
                {getContent(activeSellers, "none")}
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-red-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-pink-100">Total Invoices</CardTitle>
                    <FileText className="h-5 w-5 text-pink-200" />
                </CardHeader>
                {getContent(totalInvoices, "none")}
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-indigo-100">Total Customers</CardTitle>
                    <Users className="h-5 w-5 text-indigo-200" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold">{totalCustomers}</div>
                    <p className="text-xs text-indigo-200 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +5 this week
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminStatsCards