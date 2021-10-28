import {useEffect, useRef} from "react";

export default function useOnClickOutside(
  handler: (e: any) => void
) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!ref.current || ref.current === e.target || ref.current.contains(e.target)) return;
      if (handler) handler(e)
    }
    document?.addEventListener('mouseup', handleClickOutside)
    return () => {
      document?.removeEventListener('mouseup', handleClickOutside)
    }
  }, [ref.current])
  return ref
}
