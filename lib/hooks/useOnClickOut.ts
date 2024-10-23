import { useEffect, useLayoutEffect, useRef } from "react";

export default function useOnClickOutside(handler: (e: any) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const handRef = useRef(handler);
  useLayoutEffect(() => {
    handRef.current = handler;
  }, [handler]);
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      console.info("handleClick:", !ref.current, ref.current === e.target, ref.current.contains(e.target));
      if (!ref.current || ref.current === e.target || ref.current.contains(e.target)) return;
      if (handRef.current) handRef.current(e);
    };
    document?.addEventListener('mousedown', handleClickOutside)
    document?.addEventListener('touchstart', handleClickOutside)
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
      document?.removeEventListener("touchend", handleClickOutside);
    };
  }, [ref.current]);
  return ref;
}
