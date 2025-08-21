'use client'
import { trpc } from '@/server/trpc/client';
import { getUserSessionClient } from '@/utils/sessions/client';
import { LogOut, Zap } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';

const Navbar = () => {
    const user = getUserSessionClient();
    const { mutate: logout } = trpc.auth.logout.useMutation();

    return (
        <header className="fixed top-0 left-0 w-screen z-[10] bg-white/80 backdrop-blur-md border-b border-red-100 px-4 py-6 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    {/* Animated StylizSystem Logo */}
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-gradient-to-br from-rose-500 to-red-600 rounded-sm animate-spin"></div>
                            </div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                                StylizSystem
                            </span>
                        </h1>
                        <p className="text-gray-600 font-medium">{user?.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/live">
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6">
                            <Zap className="h-4 w-4" />
                            <span>Live Sale</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={async () => {
                            logout(undefined, {
                                onSuccess: async () => {
                                    await signOut({ redirectTo: "/", redirect: true });
                                }
                            })
                        }}
                        className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Navbar