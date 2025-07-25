import { BaseWallet, LoginUser } from "./types";
import { sleep } from "./tools";
import { InjectedExtension, InjectedWindowProvider } from "@polkadot/extension-inject/types";
import { stringToHex } from "@polkadot/util";

export class SubWallet extends BaseWallet {
  name = "SubWallet";
  icon = "/images/subwallet.png";

  wallet?: InjectedExtension;
  provider?: any;

  connectInfo: any;

  async init(old?: LoginUser) {
    if (this.isInit) return;
    const win = window as { injectedWeb3?: Record<string, InjectedWindowProvider> };
    win.injectedWeb3 = win.injectedWeb3 || {};
    this.provider = win.injectedWeb3["subwallet-js"];
    if (!this.provider) {
      await sleep(2000);
      this.provider = win.injectedWeb3["subwallet-js"];
    }
    this.isInit = true;
    await super.init(old);
  }
  async connect(): Promise<LoginUser> {
    await this.init();
    if (!this.isConnected) {
      if (!this.provider) throw "SubWallet (Extension) not installed";
      this.accounts = await this.fetchAccounts();
      this.account = this.accounts[0];
    }
    return { account: this.account, wallet: "subWallet" };
  }
  async sign(data: string, account: string | undefined): Promise<string> {
    if (!this.provider) throw "Error: no wallet";
    if (!this.wallet!.signer) throw "Error: wallet error no signer";
    const res: { signature } = await this.wallet!.signer.signRaw!({
      address: account!,
      type: "bytes",
      data: stringToHex(data),
    });
    return res.signature;
  }

  async enable(): Promise<boolean> {
    try {
      const ext = await this.provider.enable();
      console.info("enable::", ext);
      if (!ext) {
        return false;
      }
      this.wallet = {
        version: this.provider.version,
        name: "subWallet",
        ...ext,
      };
      return true;
    } catch (e) {
      return false;
    }
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      await this.enable();
      const accounts = await this.wallet!.accounts.get();
      console.info("getAccounts::", accounts);
      return accounts.map((a) => a.address);
    } catch (e) {
      return [];
    }
  }

  async login(): Promise<string[]> {
    const hasAuth = await this.enable();
    if (!hasAuth) throw "Error: cancel";
    return await this.fetchAccounts();
  }
}
