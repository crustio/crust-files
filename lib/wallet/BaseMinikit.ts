import { WalletType } from "./types";
import { WagmiWallet } from "./WagmiWallet";
export interface MetamaskReqOptions {
  from?: string;
  params?: (string | any)[];
  method: string;
}

export class BaseMinikit extends WagmiWallet {
  readonly type: WalletType = "baseminikit";
  name = "Coinbase Wallet";
  icon = "/images/wallet_coinbase.svg";
}
