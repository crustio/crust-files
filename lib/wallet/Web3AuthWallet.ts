import { BaseWallet } from './types';

export interface MetamaskReqOptions {
  from?: string,
  params?: string[]
  method: string,
}

export class Web3AuthWallet implements BaseWallet {
  isInit = false;
  signMessage: (msg: string) => Promise<any>;

  constructor(sign?: (msg: string) => Promise<any>) {
    this.signMessage = sign
  }

  async init() {
    // pass it
  }

  sign(data: string) {
    console.log(`data::::`, data)
    return this.signMessage(data).then(res => {
        console.log('res:::', res) 
        return res 
    })
  }
}
