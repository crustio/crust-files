import { BaseWallet, LoginUser } from "./types";
import { InjectedExtension, InjectedWindowProvider } from "@polkadot/extension-inject/types";
import { stringToHex } from "@polkadot/util";
import { sleep, UserRejectError } from "./tools";
import { getErrorMsg } from "../utils";

export class PolkadotJs extends BaseWallet {
  name = "Polkadot";
  icon = "/images/wallet_polkadot.png";

  provider?: InjectedWindowProvider;
  wallet?: InjectedExtension;
  async init(old?: LoginUser) {
    if (this.isInit) return;
    const win = window as { injectedWeb3?: Record<string, InjectedWindowProvider> };
    win.injectedWeb3 = win.injectedWeb3 || {};
    this.provider = win.injectedWeb3["polkadot-js"];
    if (!this.provider) {
      await sleep(2000);
      this.provider = win.injectedWeb3["polkadot-js"];
    }
    this.isInit = true;
    await super.init(old);
  }
  async fetchAccounts(): Promise<string[]> {
    try {
      await this.enable();
      const accounts = await this.wallet.accounts.get();
      return accounts.map((a) => a.address);
    } catch (e) {
      return [];
    }
  }

  async connect(): Promise<LoginUser> {
    try {
      if (!this.isConnected) {
        if (!this.provider) throw "PolkadotJs Wallet not installed";
        const hasAuth = await this.enable();
        if (!hasAuth) throw UserRejectError;
        const accounts = await this.fetchAccounts();
        if (accounts.length === 0) throw UserRejectError;
        this.isConnected = true;
        this.account = accounts[0];
      }
    } catch (error) {
      console.info("error:", getErrorMsg(error), error);
      if (getErrorMsg(error) == "Cancelled") {
        throw UserRejectError;
      }
      throw error;
    }
    return { account: this.account, wallet: "polkadot-js" };
  }

  async sign(data: string, account: string | undefined): Promise<string> {
    try {
      const res: { signature } = await this.wallet.signer.signRaw({
        address: account,
        type: "bytes",
        data: stringToHex(data),
      });
      return res.signature;
    } catch (error) {
      console.info("sign error:", getErrorMsg(error), error);
      if (getErrorMsg(error) == "Cancelled") {
        throw UserRejectError;
      }
      throw error;
    }
  }

  async enable(): Promise<boolean> {
    try {
      const ext = await this.provider.enable("crust files");
      if (!ext) {
        return false;
      }
      this.wallet = {
        ...ext,
        name: "polkadot-js",
        version: this.provider.version,
      };
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(): Promise<string[]> {
    const hasAuth = await this.enable();
    if (!hasAuth) throw "Error: cancel";
    return await this.fetchAccounts();
  }
}
