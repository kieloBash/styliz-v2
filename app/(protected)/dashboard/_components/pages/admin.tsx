'use client'
import { trpc } from "@/server/trpc/client"
import AdminRecentCustomerCard from "./admin/recent-customers-card"
import AdminStatsCards from "./admin/stats-cards"
import AdminTopCustomerCard from "./admin/top-customers-card"

const AdminDashboard = () => {
    const { data } = trpc.invoice.getDashboardAnalytics.useQuery({})

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <AdminStatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminRecentCustomerCard data={data?.payload?.recentCustomers ?? []} />
                <AdminTopCustomerCard data={data?.payload?.topCustomers ?? []} />
            </div>
        </div>
    )
}

export default AdminDashboard