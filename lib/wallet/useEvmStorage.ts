import { ContractFactory } from "ethers";
import { useMemo } from "react";
import { useWeb3Provider } from "../hooks/useProvider";
import { EVMStorageABI, EVMStorageContract } from "./config";
import { useChainId } from "../useChainId";

export function useEvmStorage() {
  const provider = useWeb3Provider();
  const chainId = useChainId();
  return useMemo(() => {
    if (!provider || chainId === undefined || chainId === null) return undefined;
    const address = EVMStorageContract[chainId];
    if (!address) return undefined;
    return ContractFactory.getContract(address, EVMStorageABI, provider.getSigner());
  }, [provider, chainId]);
}
