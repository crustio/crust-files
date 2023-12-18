import { AlgorandChainIDs } from '@perawallet/connect/dist/util/peraWalletTypes';
import { algorandConfig } from './config';
import { BaseWallet } from './types';
import { PeraWalletConnect } from '@perawallet/connect';

export class Algorand implements BaseWallet {
  wallet: PeraWalletConnect;
  account: string;
  isInit = false;

  async init() {
    if (this.isInit) return
    try {
      this.wallet = new PeraWalletConnect({
        chainId: algorandConfig.chainId as AlgorandChainIDs
      });
      let accounts = await this.wallet.reconnectSession();
      if (!this.wallet.isConnected || !accounts.length) {
        accounts = await this.wallet.connect();
      }
      this.wallet.connector?.on("disconnect", () => {
        this.wallet.disconnect();
        this.account = null;
        this.isInit = false;
      });
      this.account = accounts[0];
      this.isInit = true
    } catch (error) {
      console.log(error);
    }
  }

  async sign(data: string, account?: string): Promise<string> {
    return this.wallet.signData([{data:Buffer.from(data),message:'For login'}], account).then(signedData => {
      return window.btoa(String.fromCharCode.apply(null, signedData[0]));
    })
    .catch((err) => {
      console.error('Algorand wallet signMessage error', err);
      return '';
    });
  }
}