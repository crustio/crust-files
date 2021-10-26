import {useCallback, useState} from "react";

export function useToggle(def = false): [boolean, (n?: boolean) => void] {
  const [open, setOpen] = useState<boolean>(def)
  const toggle = useCallback((n?: boolean) => {
    if (n !== undefined) {
      setOpen(n)
    } else {
      setOpen(o => !o)
    }
  }, [])
  return [open, toggle]
}
