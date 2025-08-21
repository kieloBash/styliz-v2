"/api/trpc/[trpc]/route.ts"
import { appRouter } from "@/server/controller";
import { createTRPCContext } from "@/server/trpc/init";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createTRPCContext()
    })
}

export { handler as GET, handler as POST }