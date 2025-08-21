import { auth } from "@/auth"
import { UserRole } from "@/types/roles";


export const getUserSession = async () => {
    const session = await auth();
    return session?.user;
}

export const getUserRoleSession = async (): Promise<UserRole> => {
    const session = await auth();
    return session?.user?.role as UserRole ?? "GUEST";
}