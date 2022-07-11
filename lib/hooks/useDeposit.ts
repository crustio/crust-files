import type { Callback, ISubmittableResult, Signer } from '@polkadot/types/types';
import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { ShareEarnENV } from "../config";
import { findEvent } from '../utils';
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
        loading.show("Sending the deposit transaction... This process may take a few seconds before the transaction is finalized on-chain.")
        // const signer = user.crust.wallet.signer;
        // let msg, signature
        const signer: Signer = {
            ...user.crust.wallet.signer,
            signPayload: (data) => {
                console.info('payload:', data)
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
                const batchCompletd = !!findEvent(res, 'utility(BatchCompleted)')
                const txCompletd = !!findEvent(res, 'system(ExtrinsicSuccess)')
                if (batchCompletd && txCompletd) {
                    loading.hide()
                    setFinish(true)
                } else {
                    loading.hide()
                    alert.error('Deposit Error')
                }
            } else if (res.isError) {
                loading.hide()
                alert.error('Deposit Error')
            }
            console.info('events:', res.events)
        }
        batch.signAndSend(user.account, { nonce: -1, tip: 0 }, statusCb)
            .catch(error => {
                if (typeof error === 'string') {
                    alert.error(error)
                } else if (error && typeof error.message === 'string') {
                    alert.error(error.message)
                } else {
                    console.error("Deposit:", JSON.stringify(error))
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
            "action": "claimDeposit"
        }))
        const statusCb: Callback<ISubmittableResult> = (res) => {
            api.setSigner(undefined)
            ex.hash.toString()
            if (res.status.isFinalized) {
                const exCompletd = !!findEvent(res, 'system(ExtrinsicSuccess)')
                if (exCompletd) {
                    loading.hide()
                    setFinish(true)
                } else {
                    loading.hide()
                    alert.error('Redeem Error')
                }
            }
        }
        ex.signAndSend(user.account, { nonce: -1, tip: 0 }, statusCb)
            .catch(error => {
                if (typeof error === 'string') {
                    alert.error(error)
                } else if (error && typeof error.message === 'string') {
                    alert.error(error.message)
                } else {
                    console.error("Deposit:", JSON.stringify(error))
                }
                loading.hide()
            })
    }
    return { start, ready, finish }
}