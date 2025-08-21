import { HydrateClient } from '@/server/trpc/server'
import { getUserRoleSession } from '@/utils/sessions/server'
import DashboardClient from './client'

const DashboardPage = async () => {
    // void trpc.auth.register.prefetch();

    const role = await getUserRoleSession();

    return (
        <HydrateClient>
            <DashboardClient role={role} />
            {/* <Sample /> */}
        </HydrateClient>
    )
}

export default DashboardPage