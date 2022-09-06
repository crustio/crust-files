import { BaseWallet } from "./types";


export class Aptos implements BaseWallet {
  isInit = false;

  provider?: any;

  connectInfo: any;

  async init() {
    const getProvider = () => {
        if ("martian" in window) {
          return (window.martian);
        }
        return null;
    };
    const provider = await getProvider();
    console.log('provider: ', provider)
    if (provider) {
        provider.connect().then(connected => {
            console.log('connectInfo: ', connected)
            if (connected) {
                this.provider = provider;
                this.connectInfo = connected;
            }
            this.isInit = true
        }).catch(_err => {
            this.provider = null;
            this.connectInfo = null;
        });     
    }
  }


  sign(data: string): Promise<string> {
    return this.provider.signMessage(data).then(message => { 
      return `${message.signature}`;
    })
    .catch((err) => {
      console.error('Aptos wallet signMessage error', err);
      return '';
    });
  }

}
