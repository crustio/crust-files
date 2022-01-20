import { useState } from "react"

export interface WrapReCaptcha {
    loadingScript: boolean,
    token?: string,
    showReCaptcha: boolean,
    getToken: () => Promise<string | undefined>,
    _onLoaded: () => void,
    _onChange: (token: string) => void,
    _onExpired: () => void
}

export function initReCaptcha(): WrapReCaptcha {
    const [loadingScript, setLoadingScript] = useState(true)
    const _onLoaded = () => { setLoadingScript(false) }
    const [token, setToken] = useState<string>()
    const [showReCaptcha, toggleShow] = useState<boolean>(false)
    const [callWrap, setCallWrap] = useState<{ call?: (t: string) => void }>({})
    const getToken = () => {
        return new Promise<string>((resolve) => {
            setCallWrap({ call: resolve })
            toggleShow(true)
        })
    }
    const _onChange = (t: string) => {
        setToken(t)
        if (callWrap.call) callWrap.call(t)
        toggleShow(false)
    }
    const _onExpired = () => { setToken(undefined) }
    return {
        loadingScript,
        token,
        showReCaptcha,
        getToken,
        _onLoaded,
        _onChange,
        _onExpired
    }
}