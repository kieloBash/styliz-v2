import { useSession } from "next-auth/react"

export const useCurrentUser = () => {
    return useSession().data?.user;
}