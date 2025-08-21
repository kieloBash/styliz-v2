import { HydrateClient, trpc } from '@/server/trpc/server';
import LiveSaleClientPage from './client';

const LiveSalePage = async () => {
    void trpc.category.getList.prefetch();

    return (
        <HydrateClient>
            <LiveSaleClientPage />
        </HydrateClient>
    )
}

export default LiveSalePage