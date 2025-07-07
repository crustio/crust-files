import { AlgorandChainIDs } from "@perawallet/connect/dist/util/peraWalletTypes";
import { algorandConfig } from "./config";
import { BaseWallet, LoginUser } from "./types";
import { PeraWalletConnect } from "@perawallet/connect";
import { getErrorMsg } from "../utils";
import { UserClosed } from "./tools";

export class Algorand extends BaseWallet {
  name = "Algorand";
  icon = "/images/wallet_algorand.png";

  wallet: PeraWalletConnect = null as any;

  async init(old?: LoginUser) {
    if (this.isInit) return;
    try {
      this.wallet = new PeraWalletConnect({
        chainId: algorandConfig.chainId as AlgorandChainIDs,
      });
      this.isInit = true;
    } catch (error) {
      console.log(error);
    }
    await super.init(old);
  }
  async fetchAccounts(): Promise<string[]> {
    try {
      return this.wallet.reconnectSession();
    } catch (error) {
      console.error(error);
    }
    return [];
  }
  async connect(): Promise<LoginUser> {
    try {
      if (this.isConnected && this.wallet.isConnected) {
        return { account: this.account, wallet: "algorand" };
      }
      if (!this.wallet.isConnected) {
        this.accounts = await this.wallet.connect();
        this.isConnected = true;
      }
      this.wallet.connector?.on("disconnect", () => {
        this.wallet.disconnect();
        this.account = "";
        this.isInit = false;
        this.isConnected = false;
      });
      this.account = this.accounts[0];
    } catch (error) {
      if (getErrorMsg(error).includes("Connect modal is closed by user")) {
        throw new Error(UserClosed);
      }
      throw error;
    }
    return { account: this.account, wallet: "algorand" };
  }

  async sign(data: string, account?: string): Promise<string> {
    return this.wallet.signData([{ data: Buffer.from(data) as any, message: "For login" }], account!).then((signedData) => {
      return window.btoa(String.fromCharCode.apply(null, (signedData as any)[0]));
    });
  }

  disconnect() {
    this.wallet.disconnect();
    super.disconnect();
  }
}
