import MainLoader from '@/components/global/loader'
import React from 'react'

const LoadingPage = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <MainLoader message={"Please wait while we fetch data on the live sale page"} />
        </div>
    )
}

export default LoadingPage