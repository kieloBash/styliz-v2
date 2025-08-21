'use client'
import { IClientProps } from '@/types/global';
import { roleComponents } from './_components/role-components';

const DashboardClient = ({ role }: IClientProps) => {
    const ComponentToRender = roleComponents[role] ?? roleComponents["GUEST"];

    return <>{ComponentToRender}</>;
}

export default DashboardClient