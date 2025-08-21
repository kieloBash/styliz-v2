"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ArrowLeft, MailIcon, Send } from "lucide-react"

import FormContainer from "@/components/forms/form-container"
import FormInput from "@/components/forms/input"
import { useLoading } from "@/components/providers/loading-provider"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { showToast } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import Link from "next/link"
import { emailSchema } from "../_schema"

type Schema = z.infer<typeof emailSchema>

const EmailForm = ({ handleSubmitted }: { handleSubmitted: () => void }) => {
    const { setIsLoading, setLoadingMessage, isLoading } = useLoading();
    const { mutate } = trpc.auth.forgotPassword.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage("Please wait while we send a password reset email to your account");
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message)
            handleSubmitted()
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    });

    const form = useForm<Schema>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (values: Schema) => {
        mutate(values);
    }

    return (
        <CardContent className="space-y-6">
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

                <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Send className="w-4 h-4 mr-2 animate-pulse" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Reset Link
                        </>
                    )}
                </Button>
            </FormContainer>
            <div className="space-y-3">
                <Button variant="ghost" className="w-full h-11" asChild>
                    <Link href="/auth/sign-in">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                    </Link>
                </Button>
            </div>
        </CardContent >
    )
}

export default EmailForm
