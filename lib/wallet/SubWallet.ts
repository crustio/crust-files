import { BaseWallet } from "./types";
import {sleep} from "./tools";
import {InjectedExtension, InjectedWindowProvider} from "@polkadot/extension-inject/types";
import {stringToHex} from "@polkadot/util";

export class SubWallet implements BaseWallet {
  isInit = false;
  wallet?: InjectedExtension;
  provider?: any;

  connectInfo: any;

  async init() {
    if (this.isInit) return
    const win = window as { injectedWeb3?: Record<string, InjectedWindowProvider> };
    win.injectedWeb3 = win.injectedWeb3 || {};
    this.provider = win.injectedWeb3['subwallet-js'];
    if (!this.provider) {
      await sleep(2000)
      this.provider = win.injectedWeb3['subwallet-js'];
    }
    this.isInit = true
  }

  async sign(data: string, account: string | undefined): Promise<string> {
    if (!this.provider) throw "Error: no wallet"
    if (!this.wallet.signer) throw "Error: wallet error no signer"
    const res: { signature } = await this.wallet.signer.signRaw({
      address: account,
      type: 'bytes',
      data: stringToHex(data)
    })
    return res.signature;
  }

  async enable(): Promise<boolean> {
    try {
      const ext = await this.provider.enable()
      console.info('enable::', ext)
      if (!ext) {
        return false
      }
      this.wallet = {
        version: this.provider.version,
        name: 'subWallet',
        ...ext,
      }
      return true;
    } catch (e) {
      return false
    }
  }

  async getAccounts(): Promise<string[]> {
    try {
      await this.enable()
      const accounts = await this.wallet.accounts.get()
      console.info('getAccounts::', accounts)
      return accounts.map(a => (a.address))
    } catch (e) {
      return []
    }
  }

  async login(): Promise<string[]> {
    const hasAuth = await this.enable()
    if (!hasAuth) throw "Error: cancel"
    return await this.getAccounts()
  }

}