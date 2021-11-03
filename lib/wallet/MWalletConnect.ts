import {BaseWallet} from "./types";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {convertUtf8ToHex} from "@walletconnect/utils";

export class MWalletConnect implements BaseWallet {
  isInit = false;

  connect?: WalletConnect;
  accounts: string[] = [];

  async init() {
    this.connect = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    })
    if (this.connect.connected) {
      this.accounts = this.connect.accounts
    }
    this.isInit = true
  }


  async sign(data: string, account: string | undefined): Promise<string> {
    const res = await this.connect?.signPersonalMessage([convertUtf8ToHex(data), account])
    return res as string
  }

}
