"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UserIcon } from "lucide-react"

import FormContainer from "@/components/forms/form-container"
import FormInput from "@/components/forms/input"
import { useLoading } from "@/components/providers/loading-provider"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { sellerLoginSchema } from "../_schema"
import { onLoginSellerSubmit } from "../_submit/login"

type Schema = z.infer<typeof sellerLoginSchema>

const SellerLoginForm = () => {
    const { setIsLoading, setLoadingMessage } = useLoading();

    const form = useForm<Schema>({
        resolver: zodResolver(sellerLoginSchema),
        defaultValues: {
            username: "",
        },
    })

    const onSubmit = async (values: Schema) => {
        try {
            setIsLoading(true)
            setLoadingMessage("Please wait while we validate your credentials!");
            await onLoginSellerSubmit(values);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TabsContent value="seller" className="space-y-4">
            <FormContainer
                form={form}
                onSubmit={onSubmit}
            >
                <FormInput
                    form={form}
                    name="username"
                    label="Username"
                    placeholder="Enter your seller username"
                    type="text"
                    leftIcon={<UserIcon className="size-4" />}
                />
                <Button
                    type="submit"
                    className="mt-6 w-full h-11 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                    Sign In as Seller
                </Button>
            </FormContainer>

        </TabsContent >
    )
}

export default SellerLoginForm
