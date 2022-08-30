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
        // window.open("https://www.martianwallet.xyz/", "_blank");
    };
    if (this.isInit) return
    const provider = await getProvider();
    const connectInfo = await provider.connect();
    console.log('connectInfo: ', connectInfo)
    if (connectInfo) {
      this.provider = provider;
      this.connectInfo = connectInfo;
    }
    this.isInit = true
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
