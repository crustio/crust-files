import { useCallback, useMemo, useState } from "react";

export interface WrapLoading {
  isLoading: boolean
  show: (msg?: string) => void,
  hide: () => void,
  msg: string
}

export function initLoading(): WrapLoading {
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState('Loading')
  const show = useCallback((message = 'Loading') => {
    setMsg(message)
    setIsLoading(() => true)
  }, [])
  const hide = useCallback(() => {
    setIsLoading(() => false)
  }, [])
  return useMemo(() => ({ isLoading, show, hide, msg }), [isLoading, show, hide, msg])
}
