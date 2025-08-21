import { authRouter } from "../services/auth.service";
import { categoriesRoute } from "../services/categories.service";
import { customerRoute } from "../services/customer.service";
import { invoiceRoute } from "../services/invoice.service";
import { sellerRouter } from "../services/seller.service";
import { router } from "../trpc/init";

export const appRouter = router({
    auth: authRouter,
    seller: sellerRouter,
    customer: customerRoute,
    category: categoriesRoute,
    invoice: invoiceRoute
})

export type AppRouter = typeof appRouter;