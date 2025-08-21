'use client'
import { Button } from '@/components/ui/button';
import { trpc } from '@/server/trpc/client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react'

const Sample = () => {
    const { mutate: logout } = trpc.auth.logout.useMutation();

    return (
        <div>DashboardPage
            <Button onClick={async () => {
                logout(undefined, {
                    onSuccess: async () => {
                        await signOut({ redirectTo: "/", redirect: true });
                    }
                })
            }}>signout</Button>
        </div>
    )
}

export default Sample