import { BaseWallet, LoginUser } from "./types";
import { ExtensionProvider } from "@multiversx/sdk-extension-provider";
import { Message, MessageComputer } from "@multiversx/sdk-core";

export class Elrond extends BaseWallet {
  name = "Elrond";
  icon = "/images/wallet_elrond.png";

  provider?: ExtensionProvider;
  account: string;

  async init(old?: LoginUser) {
    if (this.isInit) return;
    const provider = ExtensionProvider.getInstance();
    const initProvider = await provider.init();
    if (initProvider) {
      this.provider = provider;
    }
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      const { address } = this.provider.getAccount();
      return [address];
    } catch (error) {
      return [];
    }
  }
  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.provider) throw "Elrond (MultiversX Wallet) not installed";
      const { address } = await this.provider.login();
      this.account = address;
      this.accounts = await this.fetchAccounts();
    }
    return { account: this.account, wallet: "elrond" };
  }
  async sign(): Promise<string> {
    const mc = new MessageComputer();
    const message = new Message({ data: Buffer.from("0x" + Buffer.from(this.account).toString("hex"), "ascii") as any });
    const msg = Buffer.from(mc.computeBytesForSigning(message)).toString("hex");
    return this.provider.signMessage(message).then((data) => {
      return `${msg}:${Buffer.from(data.signature).toString("hex")}`;
    });
  }

  disconnect() {
    super.disconnect();
    this.provider?.logout();
  }
}
