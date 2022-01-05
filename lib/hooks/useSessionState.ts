import { Dispatch, SetStateAction, useState } from "react"

type Fun<A> = () => A
type FunSet<A> = (prevState: A) => A

export function useSessionState<S>(initialState: S | Fun<S>, key: string): [S, Dispatch<SetStateAction<S>>] {
    const [state, mSetState] = useState<S>(() => {
        let init: S
        try {
            init = JSON.parse(window.sessionStorage.getItem(key)) as S
        } catch (error) {
            console.info(error)
        }
        if (!init) {
            if (typeof initialState === 'function') {
                init = (initialState as Fun<S>)()
            } else {
                init = initialState as S
            }
        }
        return init
    })
    const setState = (action: SetStateAction<S>) => {
        if (typeof action === 'function') {
            mSetState((old) => {
                const nS = (action as FunSet<S>)(old)
                window.sessionStorage.setItem(key, JSON.stringify(nS))
                return nS
            })
        } else {
            const nS = action as S
            window.sessionStorage.setItem(key, JSON.stringify(nS))
            mSetState(nS)
        }
    }

    return [state, setState]
}