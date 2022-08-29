import {BaseWallet} from "./types";
import {
  Address,
  SignableMessage,
  ExtensionProvider
} from '@elrondnetwork/erdjs';

export class Elrond implements BaseWallet {
  isInit = false;

  provider?: ExtensionProvider

  async init() {
    if (this.isInit) return
    const provider = ExtensionProvider.getInstance()
    const initProvider = await provider.init()
    if (initProvider) {
      this.provider = provider;
    }
    this.isInit = true
  }


  sign(): Promise<string> {
    const address = this.provider.account.address;
    const signableMessage = new SignableMessage({
      address: new Address(address),
      message: Buffer.from('0x' + Buffer.from(address).toString('hex'), 'ascii')
    });
    return this.provider.signMessage(signableMessage).then(message => {
      return `elrond-${address}-${signableMessage.serializeForSigning().toString('hex')}:${message.signature.hex()}`;
    })
    .catch((err) => {
      console.error('Elrond wallet signMessage error', err);
      return '';
    });
  }

}
