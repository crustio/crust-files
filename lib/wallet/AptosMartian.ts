import { BaseWallet } from "./types";


export class AptosMartian implements BaseWallet {
  isInit = false;

  provider?: any;

  connectInfo: any;

  async init() {
      // pass it
  }

  sign(data: string): Promise<string> {
    return this.provider.signMessage({ message: data }).then(message => { 
      return `${message.signature}`;
    })
    .catch((err) => {
      console.error('Aptos wallet signMessage error', err);
      return '';
    });
  }

}
