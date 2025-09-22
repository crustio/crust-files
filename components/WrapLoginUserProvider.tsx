'use client'

import { ContextWrapLoginUser, useLoginUser, WrapLoginUser } from "@/lib/wallet/hooks";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { ReactNode, useEffect } from "react";
export function WrapLoginUserProvier(props: { children: ReactNode | ((p: { user: WrapLoginUser }) => ReactNode) }) {
    const { setFrameReady, isFrameReady } = useMiniKit();
    const wUser = useLoginUser();
    const showPage = !wUser.isLoad
    useEffect(() => {
        if (showPage && !isFrameReady) {
            setFrameReady();
        }
    }, [showPage])
    return <ContextWrapLoginUser.Provider value={wUser}>{typeof props.children === 'function' ? props.children({ user: wUser }) : props.children}</ContextWrapLoginUser.Provider>
}