import { TRPCRouterRecord } from "@trpc/server";
import { resend } from "./resend";
import { verify } from "./verify";
import { forgotPassword } from "./forgot-password";
import { resetPassword } from "./reset-password";
import { logout } from "./logout";

export const authRouter = {
    verify,
    resend,
    forgotPassword,
    resetPassword,
    logout
} satisfies TRPCRouterRecord;