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
import { loginSchema } from "../_schema"
import { onLoginSubmit } from "../_submit/login"

type Schema = z.infer<typeof loginSchema>

const LoginForm = () => {
    const { setIsLoading, setLoadingMessage } = useLoading();

    const form = useForm<Schema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: Schema) => {
        try {
            setIsLoading(true)
            setLoadingMessage("Please wait while we validate your credentials!");
            await onLoginSubmit(values);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TabsContent value="login" className="space-y-4">
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
                    className="mt-6 w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    Sign In
                </Button>
            </FormContainer>

        </TabsContent >
    )
}

export default LoginForm
