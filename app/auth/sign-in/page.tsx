"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showToast } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import AdminLoginForm from "./_components/login-form"
import SellerLoginForm from "./_components/seller-login-form"

export default function AuthPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code")
    const router = useRouter();

    useEffect(() => {
        if (code === "credentials") {
            showToast("error", "Invalid credentials!")
            router.replace("/auth/sign-in");
        } else if (code === "EmailVerify") {
            router.replace(`/auth/error?error=${"EmailVerify"}`);
        } else if (code === "TooManyAttempts") {
            router.replace(`/auth/error?error=${"TooManyAttempts"}`);
        }
    }, [code, router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>
                                <span className="text-3xl font-bold">StylizSystem</span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                                Invoice and Inventory Management
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Let sellers and owner manage invoices and sales.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-slate-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Invoice Live Selling</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Sales Monitoring</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-600">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Inventory Management</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex justify-center">
                    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6">
                            <div className="lg:hidden flex items-center justify-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">S</span>
                                    </div>
                                    <span className="text-xl font-bold">StylizSystem</span>
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
                            <CardDescription className="text-center text-slate-600">
                                Sign in to your account or create a new one
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="seller" className="w-full">
                                <TabsList className="mb-4 w-full">
                                    <TabsTrigger value="seller">Seller</TabsTrigger>
                                    <TabsTrigger value="admin">Admin</TabsTrigger>
                                </TabsList>
                                <SellerLoginForm />
                                <AdminLoginForm />
                            </Tabs>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
