import { BaseWallet, LoginUser } from "./types";
import { Address, SignableMessage, ExtensionProvider } from "@elrondnetwork/erdjs";

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
    await super.init(old)
  }

  async fetchAccounts(): Promise<string[]> {
    if(this.provider?.account?.address){
      return [this.provider?.account?.address]
    }
    return []
  }
  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.provider) throw "Elrond (Maiar Wallet) not installed";
      await this.provider.login({
        callbackUrl: encodeURIComponent(`${window.location.origin}/#/files`),
      });
      const { address } = this.provider.account;
      this.account = address;
    }
    return { account: this.account, wallet: "elrond" };
  }
  async sign(): Promise<string> {
    const address = this.provider.account.address;
    const signableMessage = new SignableMessage({
      address: new Address(address),
      message: Buffer.from("0x" + Buffer.from(address).toString("hex"), "ascii"),
    });
    return this.provider
      .signMessage(signableMessage)
      .then((message) => {
        return `elrond-${address}-${signableMessage.serializeForSigning().toString("hex")}:${message.signature.hex()}`;
      })
      .catch((err) => {
        console.error("Elrond wallet signMessage error", err);
        return "";
      });
  }

  disconnect() {
    super.disconnect();
    this.provider?.logout()
  }
}
