import { BaseWallet } from "./types";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { convertUtf8ToHex } from "@walletconnect/utils";

export class MWalletConnect implements BaseWallet {
  isInit = false;

  connect?: WalletConnect;
  accounts: string[] = [];

  onAccountChanged?: (data: string[]) => void
  onDisconnect?: () => void

  async init() {
    this.connect = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    })
    if (this.connect.connected) {
      this.accounts = this.connect.accounts
    }
    this.connect.on('session_update', (_, payload) => {
      if (this.onAccountChanged) {
        const { accounts } = payload.params[0]
        this.onAccountChanged(accounts)
      }
    })
    this.connect.on('disconnect', () => {
      if (this.onDisconnect) {
        this.onDisconnect()
      }
    })
    this.isInit = true
  }


  async sign(data: string, account: string | undefined): Promise<string> {
    const res = await this.connect?.signPersonalMessage([convertUtf8ToHex(data), account])
    return res as string
  }

}
