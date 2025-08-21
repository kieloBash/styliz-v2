import { UserRole } from "@/types/roles";
import { redirect } from "next/navigation";

export default function withRole<T>(
    Component: React.ComponentType<T>,
    allowedRoles: UserRole[]
) {
    return function WrappedComponent(props: T & { role: UserRole }) {
        if (!allowedRoles.includes(props.role)) {
            return <div className="">Can't show component</div>
        }
        return <Component {...props} />;
    };
}
