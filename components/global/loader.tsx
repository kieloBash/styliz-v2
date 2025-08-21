interface IProps {
    message?: string
}
export default function MainLoader({ message = "Loading your experience..." }: IProps) {
    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-[9999] bg-gradient-to-br from-pink-50 via-red-50 to-rose-100 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-6">
                {/* Animated S-Motion Clothing Logo */}
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl shadow-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-16 h-16">
                            {/* Animated clothing piece forming S shape */}
                            <div className="absolute w-2 h-16 bg-white rounded-full animate-pulse origin-bottom transform rotate-12 translate-x-2"></div>
                            <div className="absolute w-2 h-12 bg-white/80 rounded-full animate-pulse origin-center transform -rotate-12 translate-x-4 translate-y-2 animation-delay-200"></div>
                            <div className="absolute w-2 h-8 bg-white/60 rounded-full animate-pulse origin-top transform rotate-12 translate-x-6 translate-y-6 animation-delay-400"></div>
                            {/* S curve highlight */}
                            <div className="absolute w-10 h-10 border-4 border-white/40 rounded-full animate-spin-slow transform translate-x-1 translate-y-2"></div>
                        </div>
                    </div>
                    {/* Floating accent */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce animation-delay-300"></div>
                </div>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent animate-fade-in">
                    StylizSystem
                </h1>
                <p className="text-lg text-gray-600 animate-fade-in animation-delay-500">
                    {message}
                </p>
            </div>
        </div>
    )
}
