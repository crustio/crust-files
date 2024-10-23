import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { BaseWallet, LoginUser } from "./types";
import { WALLETMAP } from "./hooks";

export function sleep(time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });
}

const findEvent = (res, key) => {
  return res.events.find((e) => `${e.event.section.toString()}(${e.event.method.toString()})` === key);
};

export function finalTxSignAndSend(tx: SubmittableExtrinsic<"promise", ISubmittableResult>, pair) {
  return new Promise<void>((resolve, reject) => {
    tx.signAndSend(pair, { nonce: -1, tip: 0 }, (res) => {
      if (res.status.isFinalized) {
        const txCompletd = !!findEvent(res, "system(ExtrinsicSuccess)");
        if (txCompletd) {
          resolve();
        } else {
          reject("Error");
        }
      }
      if (res.status.isFinalityTimeout || res.status.isRetracted) {
        reject("Timeout");
      }
    }).catch(reject);
  });
}
export function finalTxSend(tx: SubmittableExtrinsic<"promise", ISubmittableResult>) {
  return new Promise<void>((resolve, reject) => {
    tx.send((res) => {
      if (res.status.isFinalized) {
        const txCompletd = !!findEvent(res, "system(ExtrinsicSuccess)");
        if (txCompletd) {
          resolve();
        } else {
          reject("Error");
        }
      }
      if (res.status.isFinalityTimeout || res.status.isRetracted) {
        reject("Timeout");
      }
    }).catch(reject);
  });
}

export const getPerfix = (user: LoginUser): string => {
  if (user.wallet.startsWith("metamask") || user.wallet === "metax" || user.wallet === "wallet-connect") {
    return "eth";
  }
  if (user.wallet === "flow") {
    return "flow";
  }

  if (user.wallet === "solana") {
    return "sol";
  }

  if (user.wallet === "elrond") {
    return "elrond";
  }

  if (user.wallet === "algorand") {
    return "algo";
  }

  if (user.wallet == "aptos-martian") {
    return "aptos";
  }

  if (user.wallet == "aptos-petra") {
    return "aptos";
  }
  if (user.wallet == "ton-connect") {
    return "ton";
  }
  return "substrate";
};

export async function updateAuth(u: LoginUser, w: BaseWallet = WALLETMAP[u.wallet]) {
  const data = u.wallet === "aptos-martian" || u.wallet == "aptos-petra" || u.wallet == "ton-connect" ? u.pubKey || "" : u.account;
  const signature = await w.sign(data, u.account);
  u.signature = signature;
  const prefix = getPerfix(u);
  const authdata = `${prefix}-${data}${signature.includes(":") ? "-" + signature : ":" + signature}`;
  const base64Auth = window.btoa(authdata);
  const authBasic = `${base64Auth}`;
  const authBearer = `${base64Auth}`;
  u.authBasic = authBasic;
  u.authBearer = authBearer;
}
