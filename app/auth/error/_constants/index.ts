import { Mail, RefreshCw, Shield, XCircle, Clock, Settings, Home, LayoutDashboardIcon } from "lucide-react"

export const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "Please sign in using the same method you used during registration.",
    EmailVerify: "You need to verify your email address before signing in.",
    InvalidCredentials: "Invalid email or password.",
    TooManyAttempts: "Too many login attempts. Please try again later.",
    Configuration: "There was a configuration error.",
    default: "An unknown error occurred. Please try again.",
}

export const getErrorDetails = (errorCode: string) => {
    switch (errorCode) {
        case "Unauthorized":
            return {
                icon: Mail,
                title: "User is unauthorized",
                description: errorMessages[errorCode],
                color: "text-red-600",
                bgColor: "bg-red-100",
                borderColor: "border-red-200",
                actions: [
                    {
                        label: "Go back",
                        href: "/dashboard",
                        variant: "primary" as const,
                        icon: LayoutDashboardIcon,
                    },
                ],
            }
        case "EmailVerify":
            return {
                icon: Mail,
                title: "Email Verification Required",
                description: errorMessages[errorCode],
                color: "text-blue-600",
                bgColor: "bg-blue-100",
                borderColor: "border-blue-200",
                actions: [
                    {
                        label: "Try Again",
                        href: "/auth/sign-in",
                        variant: "primary" as const,
                        icon: RefreshCw,
                    },
                ],
            }
        case "OAuthAccountNotLinked":
            return {
                icon: Shield,
                title: "Account Linking Issue",
                description: errorMessages[errorCode],
                color: "text-orange-600",
                bgColor: "bg-orange-100",
                borderColor: "border-orange-200",
                actions: [
                ],
            }
        case "InvalidCredentials":
            return {
                icon: XCircle,
                title: "Invalid Credentials",
                description: errorMessages[errorCode],
                color: "text-red-600",
                bgColor: "bg-red-100",
                borderColor: "border-red-200",
                actions: [
                    {
                        label: "Try Again",
                        href: "/auth/sign-in",
                        variant: "primary" as const,
                        icon: RefreshCw,
                    },
                    {
                        label: "Reset Password",
                        href: "/forgot-password",
                        variant: "outline" as const,
                        icon: Shield,
                    },
                ],
            }
        case "TooManyAttempts":
            return {
                icon: Clock,
                title: "Too Many Attempts",
                description: errorMessages[errorCode],
                color: "text-yellow-600",
                bgColor: "bg-yellow-100",
                borderColor: "border-yellow-200",
                actions:
                    [
                        {
                            label: "Try Again",
                            href: "/auth/sign-in",
                            variant: "primary" as const,
                            icon: RefreshCw,
                        },
                        {
                            label: "Reset Password",
                            href: "/forgot-password",
                            variant: "outline" as const,
                            icon: Shield,
                        },
                    ]
            }
        case "Configuration":
            return {
                icon: Settings,
                title: "Configuration Error",
                description: errorMessages[errorCode],
                color: "text-purple-600",
                bgColor: "bg-purple-100",
                borderColor: "border-purple-200",
                actions: [
                    {
                        label: "Go Home",
                        href: "/",
                        variant: "outline" as const,
                        icon: Home,
                    },
                ],
            }
        default:
            return {
                icon: XCircle,
                title: "Authentication Error",
                description: errorMessages.default,
                color: "text-slate-600",
                bgColor: "bg-slate-100",
                borderColor: "border-slate-200",
                actions: [
                    {
                        label: "Try Again",
                        href: "/auth/sign-in",
                        variant: "primary" as const,
                        icon: RefreshCw,
                    },
                    {
                        label: "Go Home",
                        href: "/",
                        variant: "outline" as const,
                        icon: Home,
                    },
                ],
            }
    }
}