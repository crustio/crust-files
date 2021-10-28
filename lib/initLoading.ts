import {useCallback, useMemo, useState} from "react";

export interface WrapLoading {
  isLoading: boolean
  show: () => void,
  hide: () => void,
}

export function initLoading(): WrapLoading {
  const [isLoading, setIsLoading] = useState(false)
  const show = useCallback(() => {
    setIsLoading(() => true)
  }, [])
  const hide = useCallback(() => {
    setIsLoading(() => false)
  }, [])
  return useMemo(() => ({isLoading, show, hide}), [isLoading, show, hide])
}
