"use client"

import { useSession } from "next-auth/react"

export function getUserSessionClient() {
    const { data } = useSession();
    return data?.user
}