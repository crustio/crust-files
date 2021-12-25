import { useEffect, useState } from "react"
import { useApp } from "../AppContext"
import { useContextWrapLoginUser } from "../wallet/hooks"
import type { Callback, ISubmittableResult, Signer } from '@polkadot/types/types';
import { ShareEarnENV } from "../config";

export interface UseClaimRewards {
    ready: boolean,
    finish: boolean,
    start: () => void,
}
export function useClaimRewards(): UseClaimRewards {
    const { api, alert, loading } = useApp()
    const user = useContextWrapLoginUser()
    const [ready, setReady] = useState<boolean>(false)
    const [finish, setFinish] = useState<boolean>(false)
    useEffect(() => {
        setReady(false)
        if (!user.account || user.wallet !== 'crust') return
        if (!api) return;
        if (!user.crust.wallet) return;
        setReady(true)
    }, [api, user])
    const start = () => {
        // {"scope":"crustFiles","env":"prod","action":"claimDeposit"}
        // {"scope":"crustFiles","env":"prod","action":"claimRewards"}
        if (!ready) return
        loading.show()
        setFinish(false)
        //--setSigner
        // let msg, signature
        const signer: Signer = {
            ...user.crust.wallet.signer,
            signPayload: (data) => {
                // console.info('payload:', data)
                // msg = data
                return user.crust.wallet.signer.signPayload(data)
            }
        }
        api.setSigner(signer)
        // remark
        const ex = api.tx.system.remark(JSON.stringify({
            "scope": "crustFiles",
            "env": ShareEarnENV,
            "action": "claimRewards"
        }))
        const statusCb: Callback<ISubmittableResult> = (res) => {
            api.setSigner(undefined)
            if (res.status.isFinalized) {
                loading.hide()
                setFinish(true)
            }
        }
        ex.signAndSend(user.account, { nonce: -1, tip: 0 }, statusCb)
            .catch(error => {
                if (typeof error === 'string') {
                    alert.error(error)
                } else {
                    console.error(error)
                }
                loading.hide()
            })
    }
    return { start, ready, finish }
}