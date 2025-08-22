import { UserRole } from "@/types/roles";
import AdminDashboard from "./pages/admin";
import UserDashboard from "./pages/user";
import SellerLayout from "@/components/layouts/seller-layout";
import AdminLayout from "@/components/layouts/admin-layout";


export const roleComponents: Record<UserRole, React.ReactNode> = {
    ADMIN: <AdminLayout><AdminDashboard /></AdminLayout>,
    SELLER: <SellerLayout><UserDashboard /></SellerLayout>,
    STAFF: <div className="">You are a staff</div>,
    GUEST: <div className="">You are a guest</div>,
};
