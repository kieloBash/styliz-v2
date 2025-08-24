import { UserRole } from "@/types/roles";

export default function withRole<T>(
    Component: React.ComponentType<T>,
    allowedRoles: UserRole[]
) {
    return function WrappedComponent(props: T & { role: UserRole }) {
        if (!allowedRoles.includes(props.role)) {
            return null;
        }
        return <Component {...props} />;
    };
}
