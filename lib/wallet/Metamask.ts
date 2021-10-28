import {BaseWallet} from './types';

export interface MetamaskReqOptions {
  from?: string,
  params?: string[]
  method: string,
}

export class Metamask implements BaseWallet {
  isInit = false;
  isInstalled = false;
  ethereum?: {
    isMetaMask: boolean,
    request: <T>(option: MetamaskReqOptions) => Promise<T>,
    selectedAddress?: string,
    isConnected: () => boolean,
    on: (type: string, handler: (data: any) => void) => void,
  } = undefined;
  isAllowed = false;
  accounts: string[] = [];

  init(): Promise<void> {
    if (this.isInit) return Promise.resolve()
    return new Promise<void>((resolve) => {
      let handled = false;
      const eWin = window as { ethereum?: Metamask['ethereum'] }
      const handleEthereum = () => {
        if (handled) return;
        handled = true;
        window.removeEventListener('ethereum#initialized', handleEthereum);
        const mWin = window as { ethereum?: Metamask['ethereum'] }
        const ethereum = mWin.ethereum

        if (ethereum && ethereum.isMetaMask) {
          ethereum.request<string[]>({method: 'eth_accounts'})
            .then((accounts) => {
              console.info('init-accounts:', accounts);
              this.isInstalled = true;
              this.isInit = true;
              this.ethereum = ethereum;
              this.isAllowed = true;
              this.accounts = accounts;
              resolve()
            })
            .catch(() => {
              this.isInstalled = true;
              this.isInit = true;
              resolve()
            });
        } else {
          this.isInit = true;
          resolve()
        }
      };

      if (eWin.ethereum) {
        handleEthereum();
      } else {
        window.addEventListener('ethereum#initialized', handleEthereum, {once: true});
        setTimeout(handleEthereum, 2000);
      }
    })
  }

  sign(data: string, account?: string): Promise<string> {
    const msg = Buffer.from(data, 'utf8').toString('hex');
    // const msg = data;

    console.info('msg::', msg);
    if (!this.ethereum?.request)
      return Promise.reject("Error")
    return this.ethereum?.request<string>({
      from: account,
      params: [msg, account],
      method: 'personal_sign'
    }).then((signature) => {
      console.info('signData:', signature);
      return signature;
    });
  }
}

