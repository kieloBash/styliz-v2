import { z } from "zod"

export const sellerLoginSchema = z.object({
    username: z.string(),
})

export const adminLoginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().refine(d => d !== "", { message: "Password is required" }),
})

export const registerSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),

        firstName: z
            .string()
            .min(2, { message: "First name must be at least 2 characters" })
            .max(50, { message: "First name must be at most 50 characters" }),

        lastName: z
            .string()
            .min(2, { message: "Last name must be at least 2 characters" })
            .max(50, { message: "Last name must be at most 50 characters" }),

        phone: z
            .string()
            .min(10, { message: "Phone number must be at least 10 digits" })
            .max(15, { message: "Phone number must be no more than 15 digits" })
            .regex(/^\+?[0-9]+$/, {
                message: "Phone number must only contain digits and optional '+'",
            }),

        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Password must contain at least one special character",
            }),

        confirmPassword: z.string(),

        agree: z.boolean()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.agree, {
        message: "Please click the agree button on the terms and privacy policy to continue",
        path: ["agree"],
    })
