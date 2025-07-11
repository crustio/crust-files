'use client'

import { FarcasterWallet } from "@/lib/wallet/FarcasterEvm";
import { ContextWrapLoginUser, useLoginUser, WALLETMAP, WrapLoginUser } from "@/lib/wallet/hooks";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
export function WrapLoginUserProvier(props: { children: ReactNode | ((p: { user: WrapLoginUser }) => ReactNode) }) {
    // const { setFrameReady, isFrameReady, context } = useMiniKit();
    // console.info('Minikit:', context)
    // // The setFrameReady() function is called when your mini-app is ready to be shown
    // useEffect(() => {
    //     if (!isFrameReady) {
    //         setFrameReady();
    //     }
    // }, [setFrameReady, isFrameReady]);
    const wUser = useLoginUser();
    const sq = useSearchParams()

    const showPage = !wUser.isLoad
    useEffect(() => {
        if (showPage) {
            (WALLETMAP.farcaster as FarcasterWallet).ready()
        }
    }, [showPage])
    return <ContextWrapLoginUser.Provider value={wUser}>{typeof props.children === 'function' ? props.children({ user: wUser }) : props.children}</ContextWrapLoginUser.Provider>
}