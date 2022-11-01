import { IWalletProvider } from '../web3auth/web3auth';
import { BaseWallet } from './types';

export interface MetamaskReqOptions {
  from?: string,
  params?: string[]
  method: string,
}

export class Web3AuthWallet implements BaseWallet {
  isInit = false;
  signMessage: (msg: string) => Promise<any>;
  provider: IWalletProvider | null;

  async init() {
    // pass it
  }

  sign(data: string) {
    return this.provider.signMessage(data).then(res => {
        return res 
    })
  }
}
