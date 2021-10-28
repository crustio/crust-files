import {useEffect, useState} from "react";

export function useAutoToggle(interval = 2000) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const task = setInterval(() => {
      setVisible(v => !v);
    }, interval)
    return () => clearInterval(task)
  }, [interval])
  return visible
}
