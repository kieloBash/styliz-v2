import z from "zod";

export const emailSchema = z.object({
    email: z.string().email("Enter a valid email"),
})