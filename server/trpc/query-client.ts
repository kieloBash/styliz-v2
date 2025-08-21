import {
    defaultShouldDehydrateQuery,
    MutationCache,
    QueryCache,
    QueryClient,
} from '@tanstack/react-query';

export function makeQueryClient() {
    return new QueryClient({
        queryCache: new QueryCache({
            onError: (error, query) => {

            },
        }),
        mutationCache: new MutationCache({
            onError: (error, variables, context, mutation) => {
                const meta = mutation?.meta ?? {};
            },
        }),
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
            },
            dehydrate: {
                // serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            hydrate: {
                // deserializeData: superjson.deserialize,
            },
        },
    });
}