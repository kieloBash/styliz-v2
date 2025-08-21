import { UserRole } from "@/types/roles";
import AdminDashboard from "./pages/admin";
import UserDashboard from "./pages/user";
import SellerLayout from "@/components/layouts/seller-layout";


export const roleComponents: Record<UserRole, React.ReactNode> = {
    ADMIN: <AdminDashboard />,
    SELLER: <SellerLayout><UserDashboard /></SellerLayout>,
    STAFF: <div className="">You are a staff</div>,
    GUEST: <div className="">You are a guest</div>,
};
