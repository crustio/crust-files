'use client'

import MApp from "@/components/root/MApp";
import { docsMenus } from "@/components/root/menus";
import { usePathname } from "@/lib/usePathname";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { Fragment } from "react";

const MdPages = ["/privacy-policy", "/terms-of-service", ...docsMenus
    .map(item => item.path)]


import { useEffect } from 'react'

function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
            <div style={{ fontSize: 12, lineHeight: 1.1, color: '#ff4141', maxHeight: 200, overflowY: 'auto' }}>
                {JSON.stringify(error, undefined, 2)}
            </div>
        </div>
    )
}
export function ClientRoot({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return <ErrorBoundary errorComponent={Error as any}>
        {MdPages.includes(pathname) ? <Fragment>{children}</Fragment> : <MApp>{children}</MApp>}
    </ErrorBoundary>
}