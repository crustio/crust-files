import { useEffect, useState } from "react";

export function useGet<T>(get: () => Promise<T>, deeps: any[] = []): [T, () => void, boolean] {
    const [value, setValue] = useState<T>()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setValue(undefined)
        doGet()
    }, deeps)
    const doGet = () => {
        if (deeps.length) {
            if (deeps.some(d => !d)) return Promise.resolve(value)
        }
        setLoading(true)
        const p = get()
        if (p.then) {
            return p
                .then((v) => {
                    setValue(v)
                    return v
                })
                .catch(console.error)
                .then((v) => {
                    setLoading(false)
                    return v
                })
        }
    }
    return [value, doGet, loading]
}