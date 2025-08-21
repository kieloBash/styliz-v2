"use client"
import FormContainer from '@/components/forms/form-container'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { resetPasswordSchema } from '../_schema'
import FormInput from '@/components/forms/input'
import { Key, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoading } from '@/components/providers/loading-provider'
import { CardContent } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { trpc } from '@/server/trpc/client'
import { showToast } from '@/lib/utils'

type Schema = z.infer<typeof resetPasswordSchema>

const ResetPasswordForm = ({ handleSubmitted }: { handleSubmitted: () => void }) => {

    const { isLoading, setIsLoading, setLoadingMessage } = useLoading();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const form = useForm<Schema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            identifier: "",
            token: "",
            password: "",
            confirmPassword: "",
        },
        values: {
            identifier: email ?? "",
            token: token ?? "",
            password: "",
            confirmPassword: ""
        }
    })

    const { mutate } = trpc.auth.resetPassword.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage("Please wait while we update your password")
        },
        onSuccess: () => {
            setLoadingMessage("")
            handleSubmitted()
        },
        onError: (error) => {
            showToast("error", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
        },
    });

    const onSubmit = async (values: Schema) => { mutate(values) }

    return (
        <CardContent className="space-y-6">

            {email && (
                <div className="text-center text-sm text-slate-600">
                    Resetting password for: <span className="font-medium">{email}</span>
                </div>
            )}

            <FormContainer
                form={form}
                onSubmit={onSubmit}
            >
                <FormInput
                    form={form}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    leftIcon={<Key className="size-4" />}
                />
                <FormInput
                    form={form}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    leftIcon={<Key className="size-4" />}
                />

                <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-medium">Password must contain:</p>
                    <ul className="space-y-1 ml-4">
                        <li className={form.watch("password").length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                        <li className={/(?=.*[a-z])/.test(form.watch("password")) ? "text-green-600" : ""}>• One lowercase letter</li>
                        <li className={/(?=.*[A-Z])/.test(form.watch("password")) ? "text-green-600" : ""}>• One uppercase letter</li>
                        <li className={/(?=.*\d)/.test(form.watch("password")) ? "text-green-600" : ""}>• One number</li>
                    </ul>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Lock className="w-4 h-4 mr-2 animate-pulse" />
                            Updating Password...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                        </>
                    )}
                </Button>
            </FormContainer>
        </CardContent>
    )
}

export default ResetPasswordForm