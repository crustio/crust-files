import { getWallets, Wallet } from "@talismn/connect-wallets";
import { sleep, UserRejectError } from "./tools";
import { BaseWallet, LoginUser } from "./types";
import { getErrorMsg } from "../utils";

interface AccountInfo {
  address: string;
  type: string;
}

export class Talisman extends BaseWallet {
  name = "Talisman";
  icon = "/images/talisman.png";

  wallet?: Wallet;
  provider?: any;
  connectInfo: any;

  async init(old?: LoginUser) {
    if (this.isInit) return;
    // const win = window as { injectedWeb3?: Record<string, InjectedWindowProvider> };
    // win.injectedWeb3 = win.injectedWeb3 || {};
    const installedWallets = getWallets().filter((wallet) => wallet.installed);
    const talismanWallet = installedWallets.find((wallet) => wallet.extensionName === "talisman");

    // enable the wallet
    if (talismanWallet) {
      await talismanWallet.enable("crust-files");
      this.provider = talismanWallet;
      this.wallet = talismanWallet;
    }

    if (!this.provider) {
      await sleep(2000);
    }
    this.isInit = true;
    await super.init(old);
  }

  async connect(): Promise<LoginUser> {
    try {
      if (!this.isConnected) {
        if (!this.provider) throw "Talisman Wallet not installed";
        const hasAuth = await this.enable();
        if (!hasAuth) throw UserRejectError;
        this.accounts = await this.fetchAccounts();
        if (this.accounts.length === 0) throw UserRejectError;
        this.isConnected = true;
        this.account = this.accounts[0];
      }
    } catch (error) {
      console.info("error:", getErrorMsg(error), error);
      if (getErrorMsg(error) == "Cancelled") {
        throw UserRejectError;
      }
      throw error;
    }
    return { account: this.account, wallet: "talisman" };
  }
  async sign(data: string, account: string | undefined): Promise<string> {
    try {
      const accounts = ((await new Promise((resolve, _) => {
        this.provider.subscribeAccounts((accounts) => {
          resolve(accounts);
        });
      })) as unknown) as any[];
      const walletAccount = accounts.find((e) => e.address === account);
      /**
       * walletAccount.type:  "ethereum" | "sr25519"
       */
      console.log("walletAccount:::", walletAccount);

      const res: { signature } = await walletAccount.signer.signRaw({
        address: account,
        type: "bytes",
        data,
      });
      return res.signature;
    } catch (error) {
      console.info("error:", getErrorMsg(error), error);
      if (getErrorMsg(error) == "Cancelled") {
        throw UserRejectError;
      }
      throw error;
    }
  }

  async enable(): Promise<boolean> {
    try {
      await this.provider.enable("crust files");
      const connectInfo = ((await new Promise((resolve, _) => {
        this.provider.subscribeAccounts((accounts) => {
          resolve(accounts);
        });
      })) as unknown) as any[];

      if (!connectInfo.length) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      await this.enable();
      const accounts = ((await new Promise((resolve, _) => {
        this.provider.subscribeAccounts((accounts) => {
          resolve(accounts);
        });
      })) as unknown) as any[];
      this.accounts = accounts.map((a) => {
        return a.address;
      });
      return this.accounts;
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
