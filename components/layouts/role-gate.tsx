'use client'
import { UserRole } from '@/types/roles';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import MainLoader from '../global/loader';

interface IRoleGateProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
}

const RoleGateLayout = ({ children, allowedRoles }: IRoleGateProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userRole = session?.user.role as UserRole

    useEffect(() => {
        if (status === 'authenticated' && !allowedRoles.includes(userRole)) {
            router.replace('/auth/error?error=Unauthorized');
        }
    }, [status, userRole]);

    if (status === 'loading') return <MainLoader message='Please wait while we fetch your user details' />

    return (
        <>{children}</>
    )
}

export default RoleGateLayout