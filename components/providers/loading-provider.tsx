'use client';

import { createContext, useContext, useState } from 'react';
import { Toaster } from '../ui/sonner';
import MainLoader from '../global/loader';

const LoadingContext = createContext<{
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
    message: string;
    setLoadingMessage: (val: string) => void;
}>({ isLoading: false, setIsLoading: () => { }, message: "", setLoadingMessage: () => { } });

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setLoadingMessage] = useState("Loading experience");

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, message, setLoadingMessage }}>

            {children}
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <MainLoader message={message} />
                </div>
            )}
            <Toaster />

        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
