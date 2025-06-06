import { useContextWrapLoginUser } from "./wallet/hooks";
import { Metamask } from "./wallet/Metamask";

export function useChainId() {
  const wUser = useContextWrapLoginUser();
  return (wUser.useWallet as Metamask)?.chainId;
}
