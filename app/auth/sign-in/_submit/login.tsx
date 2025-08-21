"use client"

import { showToast } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { loginSchema } from "../_schema";

type LoginSchema = z.infer<typeof loginSchema>

export const onLoginSubmit = async (values: LoginSchema) => {
    console.log("✅ Login submitted", values)
    try {
        await signIn("credentials", {
            redirect: true,
            email: values.email,
            password: values.password,
        });

    } catch (error: any) {
        showToast("error", "Something went wrong!", error?.response?.data?.message || error.message)
    }
}