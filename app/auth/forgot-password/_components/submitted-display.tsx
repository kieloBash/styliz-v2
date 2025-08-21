import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, Mail, Send } from 'lucide-react'
import Link from 'next/link'

const SubmittedDisplay = ({ handleResendSubmitted }: { handleResendSubmitted: () => void }) => {

    const handleResend = () => {
        handleResendSubmitted();
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
                                <span className="text-xl font-bold">Next PSQT</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-2xl">Check Your Email</CardTitle>
                            <CardDescription className="text-center">
                                We've sent password reset instructions to your email address.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert className="border-green-200 bg-green-50">
                            <Mail className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                Reset link sent!
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                            <Button variant="outline" className="w-full h-11 bg-transparent" onClick={handleResend}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Another Email
                            </Button>

                            <Button variant="ghost" className="w-full h-11" asChild>
                                <Link href="/auth/sign-in">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Sign In
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-slate-600">
                    <p>Didn't receive the email? Check your spam folder or try again.</p>
                </div>
            </div>
        </div>
    )
}

export default SubmittedDisplay