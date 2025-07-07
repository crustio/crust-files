import { useEffect, useState } from "react";
import { MOBILE_WIDTH } from "../config";

export function useIsMobile() {
  const [isMobile, setMobile] = useState(window.innerWidth <= MOBILE_WIDTH);
  useEffect(() => {
    const onSizeChange = () => {
      setMobile(window.innerWidth <= MOBILE_WIDTH);
    };
    onSizeChange();
    window.addEventListener("resize", onSizeChange);
    return () => window.removeEventListener("resize", onSizeChange);
  }, []);
  return isMobile;
}
