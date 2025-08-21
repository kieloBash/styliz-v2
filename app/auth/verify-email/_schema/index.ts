import z from "zod";

export const verificationSchema = z.object({
    token: z.string().min(1, "Token is required"),
    identifier: z.string().email("Valid email is required"),
})