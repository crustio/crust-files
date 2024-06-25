import { BaseWallet, LoginUser } from "./types";
import { InjectedExtension, InjectedWindowProvider } from "@polkadot/extension-inject/types";
import { stringToHex } from "@polkadot/util";
import { getPerfix, sleep } from "./tools";
import { formatToCrustAccount } from "../utils";
import { ApiPromise } from "@polkadot/api";
import { typesBundleForPolkadot } from "@crustio/type-definitions";

export class Crust implements BaseWallet {
  isInit = false;

  provider?: InjectedWindowProvider;
  wallet?: InjectedExtension;

  getApi() {
    return new ApiPromise({ provider: this.wallet.provider, typesBundle: typesBundleForPolkadot });
  }

  async init() {
    if (this.isInit) return;
    const win = window as { injectedWeb3?: Record<string, InjectedWindowProvider> };
    win.injectedWeb3 = win.injectedWeb3 || {};
    this.provider = win.injectedWeb3["crust wallet"];
    if (!this.provider) {
      await sleep(2000);
      this.provider = win.injectedWeb3["crust wallet"];
    }
    this.isInit = true;
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

  async enable(): Promise<boolean> {
    try {
      const ext = await this.provider.enable("crust files");
      console.info("enable::", ext);
      if (!ext) {
        return false;
      }
      this.wallet = {
        version: this.provider.version,
        name: "crust wallet",
        ...ext,
      };
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAccounts(): Promise<string[]> {
    try {
      await this.enable();
      const accounts = await this.wallet.accounts.get();
      console.info("getAccounts::", accounts);
      return accounts.map((a) => formatToCrustAccount(a.address));
    } catch (e) {
      return [];
    }
  }

  async login(f?: LoginUser): Promise<[string[], LoginUser]> {
    const hasAuth = await this.enable();
    if (!hasAuth) throw "Error: cancel";
    const accounts = await this.getAccounts();
    if (accounts.length === 0) throw "Error: no account";
    if (f && accounts.includes(f.account)) return [accounts, f];
    const account = accounts[0];
    const nUser: LoginUser = { account, wallet: "crust" };
    const prefix = getPerfix(nUser);
    const signature = await this.sign(account, account);
    const perSignData = `${prefix}-${account}:${signature}`;
    const base64Signature = window.btoa(perSignData);
    const authBasic = `${base64Signature}`;
    const authBearer = `${base64Signature}`;
    nUser.authBasic = authBasic;
    nUser.authBearer = authBearer;
    return [accounts, nUser];
  }
}
