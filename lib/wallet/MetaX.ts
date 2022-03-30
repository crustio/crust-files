import { BaseWallet } from './types';

export interface MetaXReqOptions {
  from?: string,
  params?: string[]
  method: string,
}

export class MetaX implements BaseWallet {
  isInit = false;
  isInstalled = false;
  okexchain?: {
    isOKExWallet: boolean,
    request: <T>(option: MetaXReqOptions) => Promise<T>,
    selectedAddress?: string,
    isConnected: () => boolean,
    on: (type: string, handler: (data: any) => void) => void,
  } = undefined;
  isAllowed = false;
  accounts: string[] = [];

  onAccountChange?: (data: string[]) => void;

  constructor(onAccountChange?: (data: string[]) => void) {
    this.onAccountChange = onAccountChange
  }

  init(): Promise<void> {
    if (this.isInit) return Promise.resolve()
    return new Promise<void>((resolve) => {
      let handled = false;
      const eWin = window as { okexchain?: MetaX['okexchain'] }
      const handleMetaX = () => {
        if (handled) return;
        handled = true;
        window.removeEventListener('okexchain#initialized', handleMetaX);
        const mWin = window as { okexchain?: MetaX['okexchain'] }
        const okexchain = mWin.okexchain
        console.info('okexchain::', mWin.okexchain)
        if (okexchain && okexchain.isOKExWallet) {
          okexchain.request<string[]>({ method: 'eth_accounts' })
            .then((accounts) => {
              console.info('init-accounts:', accounts);
              this.isInstalled = true;
              this.isInit = true;
              this.okexchain = okexchain;
              this.isAllowed = true;
              this.accounts = accounts;
              this.setLis()
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

      if (eWin.okexchain) {
        handleMetaX();
      } else {
        window.addEventListener('okexchain#initialized', handleMetaX, { once: true });
        setTimeout(handleMetaX, 2000);
      }
    })
  }


  private setLis() {
    this.okexchain.on('accountsChanged', (data) => {
      console.info('okexchain:accountsChanged:', data)
      if (this.onAccountChange) {
        this.onAccountChange(data as string[])
      }
    })
  }

  sign(data: string, account?: string): Promise<string> {
    const msg = Buffer.from(data, 'utf8').toString('hex');
    // const msg = data;

    console.info('msg::', msg);
    if (!this.okexchain?.request)
      return Promise.reject("Error")
    return this.okexchain?.request<string>({
      from: account,
      params: [msg, account],
      method: 'personal_sign'
    }).then((signature) => {
      console.info('signData:', signature);
      return signature;
    });
  }
}

