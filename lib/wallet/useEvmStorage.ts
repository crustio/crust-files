import { ContractFactory } from "ethers";
import { useMemo } from "react";
import { useWeb3Provider } from "../hooks/useProvider";
import { EVMStorageABI, EVMStorageContract } from "./config";

export function useEvmStorage() {
  const provider = useWeb3Provider();
  return useMemo(() => {
    if (!provider) return undefined;
    const address = EVMStorageContract[provider.network.chainId];
    if (!address) return undefined;
    return ContractFactory.getContract(address, EVMStorageABI, provider.getSigner());
  }, [provider]);
}
