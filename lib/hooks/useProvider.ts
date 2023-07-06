import { useMemo } from "react";
import { useContextWrapLoginUser } from "../wallet/hooks";

export function useWeb3Provider() {
  const wUser = useContextWrapLoginUser();
  return useMemo(() => {
    const hasGet = !!wUser.useWallet?.getProvider;
    if (!hasGet) return undefined;
    return wUser.useWallet?.getProvider();
  }, [wUser]);
}
