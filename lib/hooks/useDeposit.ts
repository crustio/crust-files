import type { Callback, ISubmittableResult, Signer } from '@polkadot/types/types';
import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { ShareEarnENV } from "../config";
// import { doPremark } from "../http/share_earn";
// import { strToBn } from "../utils";
import { useContextWrapLoginUser } from "../wallet/hooks";

// export interface BlockExtrinsicInfo {
//     extrinsicIndex: number,
//     blockNumber: number,
// }
// function getBlockExtrinsicInfo(api: ApiPromise, blockHash: string, exHash: string): Promise<BlockExtrinsicInfo> {
//     return api.rpc.chain.getBlock(blockHash)
//         .then(block => {
//             const { block: { extrinsics, header: { number } } } = block
//             const blockNumber = number.toNumber()
//             let extrinsicIndex = -1
//             for (let index = 0; index < extrinsics.length; index++) {
//                 const ex = extrinsics[index];
//                 console.info('ex:', ex.hash && ex.hash.toString())
//                 if (ex.hash && ex.hash.toString() === exHash) {
//                     extrinsicIndex = index
//                     break
//                 }
//             }
//             return { blockNumber, extrinsicIndex }
//         })
// }

export interface UseDeposit {
    ready: boolean,
    finish: boolean,
    start: () => void;
}
export function useDeposit(dest: string, value: string, share_from?: string): UseDeposit {
    const { api, alert, loading } = useApp()
    const user = useContextWrapLoginUser()
    const [ready, setReady] = useState<boolean>(false)
    const [finish, setFinish] = useState<boolean>(false)
    useEffect(() => {
        setReady(false)
        if (!user.account || user.wallet !== 'crust' || !dest || !value) return
        if (!api) return;
        if (!user.crust.wallet) return;
        setReady(true)
    }, [api, user, dest, value])
    const start = () => {
        if (!ready) return
        // if (onGoing) return
        setFinish(false)
        loading.show()
        // const signer = user.crust.wallet.signer;
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
        // setOnGoing(true)
        // const amount = strToBn(value).toString()
        const amount = value
        console.info('deposit:', dest, value, amount)
        const tx = api.tx.balances.transfer(dest, amount)
        const remark = api.tx.system.remark(JSON.stringify({
            scope: 'crustFiles',
            env: ShareEarnENV,
            action: 'deposit',
            share_from,
        }))
        const batch = api.tx.utility.batchAll([tx, remark])
        // console.info('human', batch.toHuman(), batch.toJSON())
        const statusCb: Callback<ISubmittableResult> = (res) => {
            api.setSigner(undefined)
            if (res.status.isFinalized) {
                loading.hide()
                setFinish(true)
            }
        }
        batch.signAndSend(user.account, { nonce: -1, tip: 0 }, statusCb)
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

export interface UseClaim {
    ready: boolean,
    finish: boolean,
    start: () => void,
}
export function useClaim(): UseClaim {
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
            "action": "claimDeposit"
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