import { useWeb3Provider } from "./hooks/useProvider";

export function useChainId(){
   const provider = useWeb3Provider()
   return provider?.network?.chainId
}