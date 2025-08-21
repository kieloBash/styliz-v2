"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import EmailForm from "./_components/email-form"
import SubmittedDisplay from "./_components/submitted-display"

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    if (isSubmitted) {
        return <SubmittedDisplay handleResendSubmitted={() => setIsSubmitted(false)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">N</span>
                                </div>
                                <span className="text-xl font-bold">{APP_NAME}</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Mail className="w-16 h-16 text-blue-600" />
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <EmailForm handleSubmitted={() => setIsSubmitted(true)} />
                </Card>

                <div className="mt-6 text-center text-sm text-slate-600">
                    <p>
                        Remember your password?{" "}
                        <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
