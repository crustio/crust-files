import { EvmInjectWallet } from "./EvmInjectWallet";
import { LoginUser, WalletType } from "./types";

export interface MetamaskReqOptions {
  from?: string;
  params?: (string | any)[];
  method: string;
}

export class Metamask extends EvmInjectWallet {
  type: WalletType = "metamask";
  name = "Metamask";
  icon = "/images/group_wallet_metamask.png";

  async init(old?: LoginUser): Promise<void> {
    this.initBy(old, "ethereum", "isMetaMask");
  }
}
