import { useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { IS_DEV } from "./env";
import { Deposit, Rewards } from "./http/types";

export interface AppStore {
    deposit?: Deposit,
    rewards?: Rewards
}

export interface UpdateAction {
    key: keyof AppStore,
    value?: AppStore[UpdateAction['key']]
}
export interface WrapAppStore {
    store: AppStore,
    update: (action: UpdateAction) => void
}

export function initAppStore(): WrapAppStore {
    const [store, setStore] = useState<AppStore>({})
    const update = (action: UpdateAction) => {
        setStore((old) => {
            if (IS_DEV) console.info('store->', action, old)
            return { ...old, [action.key]: action.value }
        })
    }
    if (IS_DEV) {
        (window as unknown as { __store: AppStore }).__store = store
    }
    return { store, update }
}

export function useAppStore(): WrapAppStore {
    const { store } = useApp()
    return store
}

export function useAutoUpdateToStore(action: UpdateAction): AppStore {
    const { store, update } = useAppStore()
    useEffect(() => action.value && update(action), [action.value])
    return store
}