import { BigNumber, ethers } from "ethers";
import _, { uniqueId } from "lodash";
import { useEffect, useRef, useState } from "react";
import { CHAIN_SYMBOL, algorandConfig } from "./wallet/config";
import { useContextWrapLoginUser } from "./wallet/hooks";
import algosdk, { ABIValue, BoxReference, Transaction, verifyBytes } from "algosdk";
import algorandABI from "./abi/algorand_storage_abi.json";
import { PeraWalletConnect } from "@perawallet/connect";
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";

const algodClient = new algosdk.Algodv2(algorandConfig.token, algorandConfig.algodUrl);

class GetPriceParams {
  base_price = BigNumber.from(0);
  byte_price = BigNumber.from(0);
  service_rate = BigNumber.from(0);
  algo_price = BigNumber.from(0);
  cru_price = BigNumber.from(0);
}

export type UseAlgoPin = {
  pin: (cid: string) => Promise<string>;
  fee: string;
  chainId: number;
};

export function useAlgoPin(size: number, isPermanent: boolean): UseAlgoPin {
  const { wallet } = useContextWrapLoginUser();
  const wUser = useContextWrapLoginUser();
  const [fee, setFee] = useState("-");
  const uniq = useRef("");
  useEffect(() => {
    const id = uniqueId();
    uniq.current = id;
    setFee("-");
    if (wallet === "algorand") {
      getPrice(BigInt(size), isPermanent)
      .then((price) => {
        if (uniq.current == id) setFee(ethers.utils.formatUnits(price.toString(),6) + " " + (CHAIN_SYMBOL[algorandConfig.chainId] || "ETH"));
      })
      .catch(console.error);
    }
    return () => {};
  }, [size, isPermanent, wallet]);

  const pin = async (cid: string) => {
    return await placeOrder(wUser, cid, BigInt(size), isPermanent);
  };
  return { pin, chainId: algorandConfig.chainId, fee };
}

async function getPrice(size: bigint, isPermanent: boolean): Promise<BigNumber> {
  const application = await algodClient.getApplicationByID(algorandConfig.applicationId).do();
  const t = new GetPriceParams();
  const keySet = new Set(Object.keys(t));
  for (const kv of application.params['global-state']) {
    const key = Buffer.from(kv.key,'base64').toString();
    if (keySet.has(key)) {
      t[key] = BigNumber.from(kv.value.uint);
    }
  }
  const price = t.base_price.add(t.byte_price.mul(size).div(1024).div(1024))
         .mul(t.service_rate.add(100)).div(100)
         .mul(t.cru_price).div(t.algo_price).div(BigNumber.from(`1${'0'.repeat(12)}`));
  return isPermanent ? price.mul(200) : price;
}

async function placeOrder(wUser, cid: string, size: bigint, isPermanent: boolean): Promise<string> {
  const algoTxnSigner = getAlgoSigner(wUser.algorand.wallet);
  const suggestedParams = await algodClient.getTransactionParams().do();
  const contract = new algosdk.ABIContract(algorandABI);
  const price = await getPrice(size, isPermanent);
  const orderNode = await getRandomOrderNode();
  const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: wUser.algorand.account,
    to: algorandConfig.applicationAddress,
    amount: BigInt(price.toString()),
    suggestedParams,
  });
  const atc = new algosdk.AtomicTransactionComposer();
  const paymentTxnWithSigner = {
    txn: paymentTxn,
    signer: algoTxnSigner
  };
  const boxes: BoxReference[] = [];
  boxes.push(
    {
      appIndex: algorandConfig.applicationId, 
      name: algosdk.decodeAddress(orderNode).publicKey
    },
    {
      appIndex: algorandConfig.applicationId, 
      name: new Uint8Array(Buffer.from("nodes"))
    }
  );
  atc.addMethodCall({
    appID: algorandConfig.applicationId,
    method: contract.getMethodByName('place_order'),
    methodArgs: [
      paymentTxnWithSigner,
      orderNode,
      cid,
      size,
      isPermanent
    ],
    sender: wUser.algorand.account,
    signer: algoTxnSigner,
    boxes,
    suggestedParams,
  });

  const result = await atc.execute(algodClient, 4);
  for (const mr of result.methodResults) {
    return mr.txID;
  }
}

function getAlgoSigner(wallet: PeraWalletConnect) {
  return async (txnGroup: Transaction[], indexesToSign: number[]) => {
    const walletTxns: SignerTransaction[] = _.map(indexesToSign, t => { return { txn: txnGroup[t] } });
    const signedTxns = await wallet.signTransaction([walletTxns]);
    return Promise.resolve(signedTxns);
  };
}

async function getRandomOrderNode() {
  const keyName = 'node_num';
  const appInfo = await algodClient.getApplicationByID(algorandConfig.applicationId).do();
  const stringCodec = algosdk.ABIType.from('string');
  const encodedKey = stringCodec.encode(keyName).slice(-keyName.length);
  const base64Key = Buffer.from(encodedKey).toString('base64');
  let node_num = 0;
  for (const e of appInfo.params['global-state']) {
      if (e.key === base64Key) {
          node_num = e.value.uint;
          break;
      }
  }
  if (node_num === 0) throw new Error('No merchant node for algorand user to order.');
  const nodeIndex = Math.floor(Math.random() * node_num)
  const nodesKey = 'nodes';
  const encodedNodesKey = stringCodec.encode(nodesKey).slice(-nodesKey.length);
  const res = await algodClient.getApplicationBoxByName(algorandConfig.applicationId, encodedNodesKey).do();
  const bucketItemCodec = algosdk.ABIType.from(`uint8[32][30]`);
  const array = bucketItemCodec.decode(res.value) as ABIValue[][];
  const nodeUint8Array = array[nodeIndex] as Uint8Array[];
  const nodeNumberArray = new Uint8Array(nodeUint8Array.map(i => Number(i)));

  return algosdk.encodeAddress(nodeNumberArray);
}