import { HydrateClient } from '@/server/trpc/server'
import ScheduleShiftClientPage from './client'

const ScheduleShiftPage = async () => {
    return (
        <HydrateClient>
            <ScheduleShiftClientPage />
        </HydrateClient>
    )
}

export default ScheduleShiftPage