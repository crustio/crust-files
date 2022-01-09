import numbro from "numbro";
import { useEffect, useState } from "react";

export function useCountdown(secends: number, def = '--:--:--'): string {
    const [time, setTime] = useState(def)
    useEffect(() => {
        let s = secends
        console.info('countdown:', secends)
        const task = setInterval(() => {
            s -= 1
            if (s >= 0) {
                setTime(numbro(s).format({ output: 'time' }))
            } else {
                clearInterval(task)
            }
        }, 1000)
        return () => {
            clearInterval(task)
        }
    }, [secends])
    return time
}