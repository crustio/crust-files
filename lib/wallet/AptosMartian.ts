import _ from "lodash";
import { BaseWallet, LoginUser } from "./types";

export class AptosMartian extends BaseWallet {
  name = "Aptos Martian";
  icon = "/images/martian.png";
  provider?: any;
  connectInfo: any;
  async init(old?: LoginUser) {
    // pass it
    if (this.isInit) return;
    if ("martian" in window) {
      this.provider = window.martian;
    }
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      const currentAccount = await this.provider.account();
      return [currentAccount.address];
    } catch (e) {
      console.error(e);
    }
    return [];
  }
  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.provider) throw "Aptos (Martian Wallet) not installed";
      const connected = await this.provider.connect();
      if (!connected) {
        throw "You rejected the connection request";
      }
      this.account = connected.address;
      this.pubKey = connected.publicKey;
    }
    return { account: this.account, pubKey: this.pubKey, wallet: "aptos-martian" };
  }

  async sign(data: string): Promise<string> {
    return this.provider.signMessage({ message: data, nonce: _.random(1, 10000000) }).then((message) => {
      console.info("message:", message);
      return `${message.signature}`;
    });
  }

  disconnect() {
    super.disconnect();
    this.provider?.disconnect?.();
  }
}
