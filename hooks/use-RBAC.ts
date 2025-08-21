import { UserRole } from "@/types/roles";

export function useRBAC(userRole: UserRole) {
    return {
        canAccess: (allowedRoles: UserRole[]) => allowedRoles.includes(userRole),
        isAdmin: () => userRole === "ADMIN",
        isUser: () => userRole === "USER",
    };
}
