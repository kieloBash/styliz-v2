import { auth } from "@/auth";
import { logger } from "@/utils/logger";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

export const createTRPCContext = async () => {
    const session = await auth();

    return {
        session,
        db: prisma,
    };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {

        logger.error('tRPC error', {
            message: error.message,
            code: error.code,
            cause: error.cause,
            stack: error.stack,
        });

        return {
            ...shape,
            data: {
                ...shape.data,
                code: error.code,
                message: error.message,
            },
        };
    },
});

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
        ctx: {
            session: ctx.session,
            db: ctx.db,
        },
    });
});

const isAdmin = t.middleware(({ ctx, next }) => {
    if (ctx.session?.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admins only." });
    }
    return next();
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAuthed).use(isAdmin);
export const { createCallerFactory, router } = t;