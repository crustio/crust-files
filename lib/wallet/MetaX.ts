import { EvmInjectWallet } from "./EvmInjectWallet";
import { LoginUser, WalletType } from "./types";

export interface MetaXReqOptions {
  from?: string;
  params?: string[];
  method: string;
}

export class MetaX extends EvmInjectWallet {
  type: WalletType = "metax";
  name = "MetaX";
  icon = "/images/wallet_metax.png";

  isInit = false;
  async init(old?: LoginUser): Promise<void> {
    this.initBy(old, "metax");
  }
}
