import { useEffect } from "react";


export interface SafeEffectStat {
    safe: boolean
}

type FunVoid = () => void

export function useSafeEffect(task: (s: SafeEffectStat) => (void | FunVoid)) {
    const stat: SafeEffectStat = { safe: true }
    useEffect(() => {
        const cancel = task(stat)
        return () => {
            stat.safe = false
            if (cancel) cancel()
        }
    })
}