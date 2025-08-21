"use client"

import { showToast } from "@/lib/utils";
import axios from "axios";
import { z } from "zod";
import { registerSchema } from "../_schema";

type RegisterSchema = z.infer<typeof registerSchema>

export const onRegisterSubmit = async (values: RegisterSchema) => {
    console.log("✅ Register submitted", values)
    try {
        const res = await axios.post("/api/auth/register", values)

        if (res.status === 201) {
            showToast("success", res.data.message);
        }

    } catch (error: any) {
        showToast("error", "Something went wrong!", error?.response?.data?.message || error.message)
    }
}