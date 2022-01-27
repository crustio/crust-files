import type { Callback, ISubmittableResult, Signer } from '@polkadot/types/types';
import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { ShareEarnENV } from "../config";
import { findEvent, getErrorMsg } from "../utils";
import { useContextWrapLoginUser } from "../wallet/hooks";

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
        setFinish(false)
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
                const exCompletd = !!findEvent(res, 'system(ExtrinsicSuccess)')
                if (exCompletd) {
                    loading.hide()
                    setFinish(true)
                } else {
                    loading.hide()
                    alert.error('Claim Error')
                }
            }
        }
        ex.signAndSend(user.account, { nonce: -1, tip: 0 }, statusCb)
            .catch(error => {
                const msg = getErrorMsg(error)
                if (msg.includes('account balance too low')) {
                    alert.warnModal('Insufficient Funds!')
                } else {
                    alert.error(msg)
                }
                loading.hide()
            })
    }
    return { start, ready, finish }
}