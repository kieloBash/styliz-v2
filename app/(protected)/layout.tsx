import RoleGateLayout from '@/components/layouts/role-gate'
import { UserRole } from '@/types/roles'
import React from 'react'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RoleGateLayout allowedRoles={[UserRole.ADMIN, UserRole.SELLER]}>{children}</RoleGateLayout>
    )
}

export default ProtectedLayout