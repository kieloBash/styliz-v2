"use client"

import { showToast } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { adminLoginSchema, sellerLoginSchema } from "../_schema";

type SellerLoginType = z.infer<typeof sellerLoginSchema>
type AdminLoginType = z.infer<typeof adminLoginSchema>

export const onLoginAdminSubmit = async (values: AdminLoginType) => {
    console.log("✅ Login submitted Admin", values)
    try {
        await signIn("admin-login", {
            redirect: true,
            email: values.email,
            password: values.password,
        });

    } catch (error: any) {
        showToast("error", "Something went wrong!", error?.response?.data?.message || error.message)
    }
}

export const onLoginSellerSubmit = async (values: SellerLoginType) => {
    console.log("✅ Login submitted Seller", values)
    try {
        await signIn("seller-login", {
            redirect: true,
            username: values.username
        });

    } catch (error: any) {
        showToast("error", "Something went wrong!", error?.response?.data?.message || error.message)
    }
}