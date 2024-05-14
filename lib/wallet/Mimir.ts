import { MIMIR_REGEXP, inject, isMimirReady } from "@mimirdev/apps-inject";
import { InjectedExtension, InjectedWindowProvider } from "@polkadot/extension-inject/types";
import { stringToHex } from "@polkadot/util";
import { BaseWallet } from "./types";

export class Mimir implements BaseWallet {
  isInit = false;

  provider?: InjectedWindowProvider;
  wallet?: InjectedExtension;

  async init() {
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
    const res: { signature } = await this.wallet.signer.signRaw({
      address: account,
      type: "bytes",
      data: stringToHex(data),
    });
    return res.signature;
  }

  async getAccounts(): Promise<string[]> {
    try {
      await this.enable();
      const accounts = await this.wallet.accounts.get(true);
      return accounts.map((a) => a.address);
    } catch (e) {
      return [];
    }
  }

  async login(): Promise<string[]> {
    const hasAuth = await this.enable();
    if (!hasAuth) throw "Error: cancel";
    return await this.getAccounts();
  }
}
