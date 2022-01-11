import { useEffect, useState, SetStateAction, Dispatch } from "react";


export interface SafeEffectStat {
    safe: boolean
}

type Fun<A> = () => A

export function useSafeState<S>(def?: S | Fun<S>): [S, Dispatch<SetStateAction<S>>] {
    const [state, setState] = useState<S>(def)
    const [ss] = useState<SafeEffectStat>({ safe: true })
    useEffect(() => {
        ss.safe = true
        return () => {
            ss.safe = false
        }
    })
    const mSetState = (action: SetStateAction<S>) => {
        if (ss.safe) setState(action)
    }
    return [state, mSetState]
}