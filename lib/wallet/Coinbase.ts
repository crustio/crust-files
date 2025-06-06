import { EvmInjectWallet } from "./EvmInjectWallet";
import { LoginUser, WalletType } from "./types";

export class Coinbase extends EvmInjectWallet {
  name = "Coinbase Wallet";
  icon = "/images/wallet_coinbase.svg";
  type: WalletType = "coinbase";

  async init(old?: LoginUser): Promise<void> {
    // coinbaseWalletExtension isCoinbaseWallet
    this.initBy(old, "coinbaseWalletExtension", "isCoinbaseWallet");
  }
}
