"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getErrorDetails } from "./_constants"

export default function AuthErrorPage() {
    const searchParams = useSearchParams()

    const error = searchParams.get("error") || "default"

    const errorDetails = getErrorDetails(error)
    const ErrorIcon = errorDetails.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-4">
                        {/* Brand Header */}
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">N</span>
                                </div>
                                <span className="text-xl font-bold">Next PSQT</span>
                            </div>
                        </div>

                        {/* Error Icon */}
                        <div className="flex justify-center">
                            <div className={`w-16 h-16 ${errorDetails.bgColor} rounded-full flex items-center justify-center`}>
                                <ErrorIcon className={`w-8 h-8 ${errorDetails.color}`} />
                            </div>
                        </div>

                        {/* Error Title and Description */}
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold">{errorDetails.title}</CardTitle>
                            <CardDescription className="text-center">{errorDetails.description}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Error Alert */}
                        <Alert
                            className={`${errorDetails.borderColor} ${errorDetails.bgColor.replace("bg-", "bg-opacity-50 bg-")}`}
                        >
                            <ErrorIcon className={`h-4 w-4 ${errorDetails.color}`} />
                            <AlertDescription className={errorDetails.color.replace("text-", "text-opacity-90 text-")}>
                                <div className="space-y-2">
                                    <p className="font-medium">What happened?</p>
                                    <p className="text-sm">{errorDetails.description}</p>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            {errorDetails.actions.map((action, index) => {
                                const ActionIcon = action.icon


                                if (action.variant === "primary") {
                                    return (
                                        <Link href={action.href} key={index}>
                                            <Button
                                                key={index}
                                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            >
                                                <ActionIcon className="w-4 h-4 mr-2" />
                                                {action.label}
                                            </Button>
                                        </Link>
                                    )
                                } else {
                                    return (
                                        <Link key={index}
                                            href={action.href}>
                                            <Button
                                                variant="outline"
                                                className="w-full h-11 bg-transparent"
                                            >
                                                <ActionIcon className="w-4 h-4 mr-2" />
                                                {action.label}
                                            </Button>
                                        </Link>
                                    )
                                }
                            })}
                        </div>

                        {/* Back to Sign In */}
                        <div className="pt-4 border-t">
                            <Button variant="ghost" className="w-full h-11" asChild>
                                <Link href="/auth/sign-in">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Sign In
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
