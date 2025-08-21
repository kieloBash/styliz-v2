import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

const SubmittedDisplay = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (countdown === 0) {
            router.push("/auth/sign-in")
        }
    }, [countdown, router])

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
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-2xl">Password Reset Successful!</CardTitle>
                            <CardDescription className="text-center">
                                Your password has been updated successfully. You'll be redirected to sign in in {countdown} seconds.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                You can now sign in with your new password.
                            </AlertDescription>
                        </Alert>

                        <Button
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => router.push("/auth/sign-in")}
                        >
                            Sign In Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SubmittedDisplay