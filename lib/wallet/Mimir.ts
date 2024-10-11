import { MIMIR_REGEXP, inject, isMimirReady } from "@mimirdev/apps-inject";
import { ApiPromise } from "@polkadot/api";
import { InjectedExtension, InjectedWindowProvider } from "@polkadot/extension-inject/types";
import { GenericCall, GenericExtrinsicEra } from "@polkadot/types";
import { SignerPayloadJSON } from "@polkadot/types/types";
import { numberToHex, stringToHex, u8aToHex } from "@polkadot/util";
import { signatureVerify } from "@polkadot/util-crypto";
import { templateApi } from "../initApi";
import { getPerfix } from "./tools";
import { BaseWallet, LoginUser } from "./types";
/**
 * getPayloadHex
 * @param {ApiPromise} api
 * @returns
 */
export async function payloadTools(api: ApiPromise, address: string) {
  function makeEraOptions({ header, nonce, mortalLength }) {
    return {
      blockHash: "0x8b404e7ed8789d813982b9cb4c8b664c05b3fbf433309f603af014ec9ce56a8c", // header.hash,
      genesisHash: "0x8b404e7ed8789d813982b9cb4c8b664c05b3fbf433309f603af014ec9ce56a8c",
      runtimeVersion: api.runtimeVersion,
      signedExtensions: api.registry.signedExtensions,
      // @ts-ignore
      version: api.extrinsicType,
      era: api.registry.createTypeUnsafe<GenericExtrinsicEra>("ExtrinsicEra", [{ current: 1, period: 55 }]),
      nonce,
      tip: 0,
      assetId: 0,
    };
  }
  const signInfo = await api.derive.tx.signingInfo(address);
  const earOptions = makeEraOptions(signInfo);
  return {
    signOptions: earOptions,
  };
}

export class Mimir extends BaseWallet {
  name = "Mimir";
  icon = "/images/wallet_mimir.svg";

  isInit = false;

  provider?: InjectedWindowProvider;
  wallet?: InjectedExtension;
  account: string;

  async init(old?: LoginUser) {
    if (this.isInit) return;
    const openInIframe = window !== window.parent;
    console.info("initMimir:", openInIframe);
    if (openInIframe) {
      const origin = await isMimirReady();
      console.info("initMimir:origin", origin);
      if (origin && MIMIR_REGEXP.test(origin)) {
        inject();
        this.provider = (window as any).injectedWeb3["mimir"];
        console.info("inject:", (window as any).injectedWeb3);
      }
    }
    this.isInit = true;
    await super.init(old);
  }
  async fetchAccounts(): Promise<string[]> {
    try {
      await this.enable();
      const accounts = await this.wallet.accounts.get(true);
      return accounts.map((a) => a.address);
    } catch (e) {
      return [];
    }
  }

  public async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.provider) {
        window.open("https://app.mimir.global", "_blank");
      } else {
        const accounts = await this.fetchAccounts();
        this.account = accounts[0];
        this.isConnected = true;
      }
    }
    return { account: this.account, wallet: "mimir" };
  }

  async enable(): Promise<boolean> {
    try {
      const ext = await this.provider.enable("crust files");
      console.info("mimir:enable", ext);
      if (!ext) {
        return false;
      }
      this.wallet = {
        ...ext,
        name: "mimir",
        version: this.provider.version,
      };
      return true;
    } catch (e) {
      console.error("mimir:", e);
      return false;
    }
  }

  async sign(data: string, account: string | undefined): Promise<string> {
    if (!this.provider) throw "Error: no wallet";
    if (!this.wallet.signer) throw "Error: wallet error no signer";
    const api = await templateApi();
    const accounts = await this.fetchAccounts();
    const address = account || accounts[0];
    const remark = api.tx.system.remark("Signature for CrustFiles");
    const { signOptions } = await payloadTools(api, address);
    const res = await this.wallet.signer.signPayload({
      address,
      blockHash: signOptions.blockHash,
      genesisHash: signOptions.genesisHash,
      blockNumber: "0x0",
      era: signOptions.era.toHex(),
      method: remark.inner.method.toHex(),
      nonce: signOptions.nonce.toHex(),
      tip: numberToHex(signOptions.tip),
      specVersion: signOptions.runtimeVersion.toHex(),
      transactionVersion: signOptions.runtimeVersion.toHex(),
      signedExtensions: signOptions.signedExtensions,
      version: 4,
    });

    console.info("mimir:res:", res);
    const payload = (res as any).payload as SignerPayloadJSON;
    const era = api.registry.createType<GenericExtrinsicEra>("ExtrinsicEra", payload.era);
    const method = api.registry.createType<GenericCall>("GenericCall", payload.method);
    // const signer = payload.address;
    console.info("method:", method.toHex() == payload.method, method.toHex(), payload.method, remark.inner.method.toHex());
    console.info("era:", era.toHex(), payload.era);
    const signPayload = remark.inner.signature.createPayload(method, {
      era,
      blockHash: payload.blockHash,
      genesisHash: payload.genesisHash,
      nonce: payload.nonce,
      runtimeVersion: signOptions.runtimeVersion,
    });
    const payloadU8a = signPayload.toU8a({ method: true });
    const hexData = u8aToHex(payloadU8a.length > 256 ? api.registry.hash(payloadU8a) : payloadU8a);
    // const signature = res.signature;
    return hexData + ":" + res.signature;
  }

  async login(f?: LoginUser): Promise<[string[], LoginUser]> {
    // const hasAuth = await this.enable();
    // if (!hasAuth) throw "Error: cancel";
    // return await this.getAccounts();
    const accounts = await this.fetchAccounts();
    // accounts = accounts.map((item) => formatToCrustAccount(item));
    if (accounts.length == 0) throw "Error: no account";
    console.info("mimir:accounts", accounts);
    if (f && f.account && f.wallet == "mimir" && accounts.includes(f.account)) {
      return [accounts, f];
    } else if (accounts.length) {
      // use remark as singmsg
      const api = await templateApi();
      const address = accounts[0];
      const remark = api.tx.system.remark("Signature for CrustFiles");
      const { signOptions } = await payloadTools(api, address);
      const res = await this.wallet.signer.signPayload({
        address,
        blockHash: signOptions.blockHash,
        genesisHash: signOptions.genesisHash,
        blockNumber: "0x0",
        era: signOptions.era.toHex(),
        method: remark.inner.method.toHex(),
        nonce: signOptions.nonce.toHex(),
        tip: numberToHex(signOptions.tip),
        specVersion: signOptions.runtimeVersion.toHex(),
        transactionVersion: signOptions.runtimeVersion.toHex(),
        signedExtensions: signOptions.signedExtensions,
        version: 4,
      });

      console.info("mimir:res:", res);
      const payload = (res as any).payload as SignerPayloadJSON;
      const era = api.registry.createType<GenericExtrinsicEra>("ExtrinsicEra", payload.era);
      const method = api.registry.createType<GenericCall>("GenericCall", payload.method);
      const signer = payload.address;
      console.info("method:", method.toHex() == payload.method, method.toHex(), payload.method, remark.inner.method.toHex());
      console.info("era:", era.toHex(), payload.era);
      const signPayload = remark.inner.signature.createPayload(method, {
        era,
        blockHash: payload.blockHash,
        genesisHash: payload.genesisHash,
        nonce: payload.nonce,
        runtimeVersion: signOptions.runtimeVersion,
      });
      const payloadU8a = signPayload.toU8a({ method: true });
      const hexData = u8aToHex(payloadU8a.length > 256 ? api.registry.hash(payloadU8a) : payloadU8a);
      const signature = res.signature;
      const prefix = getPerfix({ wallet: "mimir", account: address });
      const perSignData = `${prefix}-${signer}-${hexData}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      const authBasic = `${base64Signature}`;
      const authBearer = `${base64Signature}`;
      const acc: LoginUser = {
        wallet: "mimir",
        account: address,
        authBasic,
        authBearer,
        signature,
      };
      const sv = signatureVerify(hexData, signature, signer);
      console.info("mimir:valid", sv.isValid);
      return [accounts, acc];
    }
  }
}
