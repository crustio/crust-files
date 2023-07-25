import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { uniqueId } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useChainId } from "./useChainId";
import { CHAIN_SYMBOL } from "./wallet/config";
import { useContextWrapLoginUser } from "./wallet/hooks";
import { useEvmStorage } from "./wallet/useEvmStorage";

export type UseEvmPin = {
  pin: (cid: string) => Promise<string>;
  fee: string;
  chainId: number;
};

export function useEvmPin(size: number, isPermanent: boolean): UseEvmPin {
  const chainId = useChainId();
  const evms = useEvmStorage();
  const { wallet } = useContextWrapLoginUser();
  const [fee, setFee] = useState("-");
  const uniq = useRef("");
  useEffect(() => {
    const id = uniqueId();
    uniq.current = id;
    setFee("-");
    if (wallet === "metamask" && evms) {
      evms
        .getPrice(BigNumber.from(size), isPermanent)
        .then((price) => {
          if (uniq.current == id) setFee(formatEther(price) + " " + (CHAIN_SYMBOL[chainId] || "ETH"));
        })
        .catch(console.error);
    }
    return () => {};
  }, [size, isPermanent, chainId, wallet]);

  const pin = async (cid: string) => {
    const mSize = BigNumber.from(size);
    const amount = await evms.getPrice(mSize, isPermanent);
    const args = [cid, mSize, isPermanent];
    const gas = await evms.estimateGas.placeOrder(...args, { value: amount });
    const tx = await evms.placeOrder(...args, { value: amount, gasLimit: gas.mul(120).div(100) });
    const { transactionHash } = await tx.wait();
    return transactionHash;
  };
  return { pin: evms ? pin : undefined, chainId, fee };
}
