import { useEffect, useState } from "react";

const CacheObj: {
    [k: string]: {
        time: number,
        get: Promise<any>,
    }
} = {}

export function useGet<T>(get: () => Promise<T>, deeps: any[] = [], key?: string, time = 800): [T, () => Promise<T>, boolean] {
    const [value, setValue] = useState<T>()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const effectState = { cancel: false }
        doGet(effectState)
        return () => { effectState.cancel = true }
    }, deeps)
    const cacheGet = () => {
        if (key) {
            const c = new Date().getTime()
            const last = CacheObj[key]
            const needNew = !last || (c - last.time) > time
            const cPromise = needNew ? get() : last.get
            CacheObj[key] = {
                time: needNew ? c : last.time,
                get: cPromise
            }
            return cPromise
        } else {
            return get()
        }

    }
    const doGet = (effectState: { cancel: boolean } = { cancel: false }) => {
        if (deeps.length) {
            if (deeps.some(d => !d)) return Promise.resolve(value)
        }
        setValue(undefined)
        setLoading(true)
        const p = cacheGet()
        if (p.then) {
            return p
                .then((v) => {
                    if (key) {
                        console.info('cache:', key, v)
                    }
                    if (!effectState.cancel) setValue(v)
                    return v
                })
                .catch(console.error)
                .then((v) => {
                    if (!effectState.cancel) setLoading(false)
                    return v
                })
        }
    }
    return [value, doGet, loading]
}