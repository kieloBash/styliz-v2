import React from 'react'
import Navbar from '../global/navbar'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen pt-28 bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 relative">
            <Navbar />
            {children}
        </div>
    )
}

export default AdminLayout