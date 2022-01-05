import { useEffect, useState } from "react";
import mDayjs from "../mDayjs";

export function useCountdown(secends: number, format = 'HH:mm:ss', def = '--:--:--'): string {
    const [time, setTime] = useState(def)
    useEffect(() => {
        let s = secends
        const task = setInterval(() => {
            s -= 1
            if (s >= 0) {
                setTime(mDayjs.utc(s * 1000).format(format))
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