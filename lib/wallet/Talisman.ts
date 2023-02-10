import { BaseWallet } from "./types";
import {sleep} from "./tools";
import {stringToHex} from "@polkadot/util";
import { getWallets, Wallet } from '@talismn/connect-wallets';

interface AccountInfo {
    address: string;
    type: string
}

export class Talisman implements BaseWallet {
  isInit = false;
  wallet?: Wallet;
  provider?: any;
  accounts?: AccountInfo[]

  connectInfo: any;

  async init() {
    if (this.isInit) return
    // const win = window as { injectedWeb3?: Record<string, InjectedWindowProvider> };
    // win.injectedWeb3 = win.injectedWeb3 || {};
    const installedWallets = getWallets().filter(wallet => wallet.installed)
    const talismanWallet = installedWallets.find(wallet => wallet.extensionName === 'talisman')

    // enable the wallet
    if (talismanWallet) {  
        await talismanWallet.enable("crust-files")
        this.provider = talismanWallet;
        this.wallet = talismanWallet;
    }

    if (!this.provider) {
      await sleep(2000)
    }
    this.isInit = true
  }

  async sign(data: string, account: string | undefined): Promise<string> {
    if (!this.provider) throw "Error: no wallet"
    if (!this.wallet.signer) throw "Error: wallet error no signer"
    const accounts = await new Promise((resolve, _) => {
        this.provider.subscribeAccounts((accounts) => {
            resolve(accounts)
        });
    }) as unknown as any[]
    const walletAccount = accounts.find(e => e.address === account)
    /**
     * walletAccount.type:  "ethereum" | "sr25519"
     */
    console.log('walletAccount:::', walletAccount)

    const res: { signature } = await walletAccount.signer.signRaw({
        address: account,
        type: 'bytes',
        data
    })
    return res.signature;
  }

  async enable(): Promise<boolean> {
    try {
        await this.provider.enable("crust files")
        const connectInfo = await new Promise((resolve, _) => {
            this.provider.subscribeAccounts((accounts) => {
                resolve(accounts)
            });
        }) as unknown as any[]

      if (!connectInfo.length) {
        return false
      }
      return true;
    } catch (e) {
      return false
    }
  }

  async getAccounts(): Promise<string[]> {
    try {
      await this.enable()
      const accounts = await new Promise((resolve, _) => {
        this.provider.subscribeAccounts((accounts) => {
            resolve(accounts)
        });
    }) as unknown as any[]
      this.accounts = accounts.map(a => {
        return { address: a.address, type: a.type }
      })
      return this.accounts.map(e => e.address)
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