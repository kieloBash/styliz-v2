"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Key, MailIcon } from "lucide-react"

import FormContainer from "@/components/forms/form-container"
import FormInput from "@/components/forms/input"
import { useLoading } from "@/components/providers/loading-provider"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { onLoginAdminSubmit } from "../_submit/login"
import { adminLoginSchema } from "../_schema"

type Schema = z.infer<typeof adminLoginSchema>

const AdminLoginForm = () => {
    const { setIsLoading, setLoadingMessage } = useLoading();

    const form = useForm<Schema>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: Schema) => {
        try {
            setIsLoading(true)
            setLoadingMessage("Please wait while we validate your credentials!");
            await onLoginAdminSubmit(values);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TabsContent value="admin" className="space-y-4">
            <FormContainer
                form={form}
                onSubmit={onSubmit}
            >
                <FormInput
                    form={form}
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    type="email"
                    leftIcon={<MailIcon className="size-4" />}
                />
                <FormInput
                    form={form}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    leftIcon={<Key className="size-4" />}
                />
                <Button
                    type="submit"
                    className="mt-6 w-full h-11 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                    Sign In as Admin
                </Button>
            </FormContainer>

        </TabsContent >
    )
}

export default AdminLoginForm
