import { useEffect, useState } from "react";

export function useGet<T>(get: () => Promise<T>, deeps: any[] = []): [T, () => void] {
    const [value, setValue] = useState<T>()
    useEffect(() => {
        setValue(undefined)
        doGet()
    }, deeps)
    const doGet = () => {
        if (deeps.length) {
            if (deeps.some(d => !d)) return
        }
        const p = get()
        if (p.then) {
            p.then(setValue).catch(console.error)
        }
    }
    return [value, doGet]
}