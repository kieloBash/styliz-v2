"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import { ArrowRight, CheckCircle, Home, Mail, RefreshCw, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { v4 as uuidv4 } from "uuid"

type VerificationState = "verifying" | "success" | "error" | "expired" | "invalid" | "resending" | "resend-success"

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

export default function VerifyEmailPage() {
    const [verificationState, setVerificationState] = useState<VerificationState>("verifying")
    const [errorMessage, setErrorMessage] = useState("")
    const [countdown, setCountdown] = useState(5)

    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    useEffect(() => {
        if (!token) {
            setVerificationState("invalid")
            setErrorMessage("Invalid verification link. No token provided.")
            return
        }

        verifyEmail()
    }, [token])

    // Countdown and redirect on success
    useEffect(() => {
        if (verificationState === "success" && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (verificationState === "success" && countdown === 0) {
            router.push("/dashboard")
        }
    }, [verificationState, countdown, router])

    const { mutate: verifyEmailMutate } = trpc.auth.verify.useMutation({
        onSuccess: (data) => {
            showToast("success", data.message)
            setVerificationState("success")
        },
        onError: (error) => {
            console.log({ error })
            switch (error.message) {
                case "TOKEN_EXPIRED":
                    setVerificationState("expired")
                    setErrorMessage("Your verification link has expired. Please request a new one.")
                    break
                case "TOKEN_INVALID":
                    setVerificationState("invalid")
                    setErrorMessage("Invalid verification token. Please check your link and try again.")
                    break
                case "EMAIL_ALREADY_VERIFIED":
                    setVerificationState("success")
                    break
                default:
                    setVerificationState("error")
                    setErrorMessage(error.message || "An unexpected error occurred during verification.")
            }
        }
    })

    const { mutate: resendMutate } = trpc.auth.resend.useMutation({
        onMutate: () => {
            setVerificationState("resending")
            setErrorMessage("")
        },
        onSuccess: (data) => {
            setErrorMessage("")
            showToast("success", data.message)
            setVerificationState("resend-success")
        },
        onError: (error) => {
            setVerificationState("error")
            setErrorMessage(error.message || "An unexpected error occurred during resending.")
        }
    })

    const verifyEmail = async () => {
        if (!token || !email) return null;
        verifyEmailMutate({ token, identifier: email })
    }

    const handleRetry = () => {
        if (token) {
            setVerificationState("verifying")
            setErrorMessage("")
            verifyEmail()
        }
    }

    const handleResendVerification = async () => {
        if (!email) return null;
        resendMutate({ token: uuidv4(), identifier: email })
    }

    const getStatusIcon = () => {
        switch (verificationState) {
            case "verifying":
                return <RefreshCw className="w-16 h-16 text-blue-600 animate-spin" />
            case "resending":
                return <RefreshCw className="w-16 h-16 text-blue-600 animate-spin" />
            case "success":
                return <CheckCircle className="w-16 h-16 text-green-600" />
            case "resend-success":
                return <CheckCircle className="w-16 h-16 text-green-600" />
            case "error":
            case "expired":
            case "invalid":
                return <XCircle className="w-16 h-16 text-red-600" />
            default:
                return <Mail className="w-16 h-16 text-slate-400" />
        }
    }

    const getStatusTitle = () => {
        switch (verificationState) {
            case "verifying":
                return "Verifying Your Email"
            case "resending":
                return "Resending New Token"
            case "resend-success":
                return "New Token Sent"
            case "success":
                return "Email Verified Successfully!"
            case "expired":
                return "Verification Link Expired"
            case "invalid":
                return "Invalid Verification Link"
            case "error":
                return "Verification Failed"
            default:
                return "Email Verification"
        }
    }

    const getStatusDescription = () => {
        switch (verificationState) {
            case "verifying":
                return "Please wait while we verify your email address..."
            case "resending":
                return "Please wait while we resend another verification email..."
            case "resend-success":
                return "Please check your email and verify again!"
            case "success":
                return `Welcome to Next PSQT! You'll be redirected back to the login page in ${countdown} seconds.`
            case "expired":
                return "Your verification link has expired. Please request a new verification email."
            case "invalid":
                return "The verification link is invalid or malformed. Please check your email and try again."
            case "error":
                return "We encountered an error while verifying your email. Please try again."
            default:
                return "Verifying your email address..."
        }
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

                        <div className="flex justify-center">{getStatusIcon()}</div>

                        <div className="space-y-2">
                            <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
                            <CardDescription className="text-center">{getStatusDescription()}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {errorMessage && (
                            <Alert className="border-red-200 bg-red-50">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        {email && verificationState === "verifying" && (
                            <div className="text-center text-sm text-slate-600">
                                Verifying: <span className="font-medium">{email}</span>
                            </div>
                        )}

                        {email && verificationState === "resending" && (
                            <div className="text-center text-sm text-slate-600">
                                Resending email: <span className="font-medium">{email}</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            {verificationState === "success" && (
                                <Button
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onClick={() => router.push("/auth/sign-in")}
                                >
                                    Go to Login
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}

                            {(verificationState === "error" || verificationState === "invalid") && (
                                <Button variant="outline" className="w-full h-11 bg-transparent" onClick={handleRetry}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                            )}

                            {verificationState === "expired" && email && (
                                <Button
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onClick={handleResendVerification}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Resend Verification Email
                                </Button>
                            )}

                            <Button variant="ghost" className="w-full h-11" asChild>
                                <Link href="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Link>
                            </Button>

                            {verificationState !== "success" && (
                                <Button variant="ghost" className="w-full h-11" asChild>
                                    <Link href="/auth/sign-in">Sign In Instead</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Help */}
                <div className="mt-6 text-center text-sm text-slate-600">
                    <p>Didn't receive the email? Check your spam folder or</p>
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={handleResendVerification}>
                        request a new verification email
                    </Button>
                </div>
            </div>
        </div>
    )
}
