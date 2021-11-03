import {BaseWallet} from './types';
import {sleep} from "./tools";

export class SolanaM implements BaseWallet {
  isInit = false;

  isInstalled = false;
  solana?: {
    isPhantom: boolean
    isConnected: boolean
    publicKey: any
    disconnect: () => void
    connect: () => void
    on: (event: string, call: () => void) => void
    signMessage: (msg: Uint8Array, encode: 'utf8') => Promise<any>
  }

  async init() {
    if (this.isInit) return
    this.solana = (window as { solana?: SolanaM['solana'] }).solana
    this.isInstalled = this.solana && this.solana.isPhantom;
    if (!this.solana) {
      await sleep(2000);
      this.solana = (window as { solana?: SolanaM['solana'] }).solana
      this.isInstalled = this.solana && this.solana.isPhantom;
    }
    this.isInit = true
  }


  sign(data: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(data);
    return this.solana?.signMessage(encodedMessage, 'utf8')
      // eslint-disable-next-line
      .then((sig: any) => Buffer.from(sig.signature).toString('hex'));
  }

}
