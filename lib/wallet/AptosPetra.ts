import { BaseWallet } from "./types";


export class AptosPetra implements BaseWallet {
  isInit = false;

  provider?: any;

  connectInfo: any;

  async init() {
      // pass it
  }

  sign(data: string): Promise<string> {
    return this.provider.signMessage({ message: data, nonce: "crust" }).then(message => { 
      return `${message.signature}`;
    })
    .catch((err) => {
      console.error('Aptos Petra wallet signMessage error', err);
      return '';
    });
  }

}