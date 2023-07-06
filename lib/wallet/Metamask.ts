import { parseInt } from "lodash";
import { BaseWallet } from "./types";
import { providers } from "ethers";

export interface MetamaskReqOptions {
  from?: string;
  params?: (string | any)[];
  method: string;
}

export class Metamask implements BaseWallet {
  isInit = false;
  isInstalled = false;
  ethereum?: {
    isMetaMask: boolean;
    request: <T>(option: MetamaskReqOptions) => Promise<T>;
    selectedAddress?: string;
    chainId: string;
    isConnected: () => boolean;
    on: (type: string, handler: (data: any) => void) => void;
  } = undefined;
  isAllowed = false;
  accounts: string[] = [];
  chainId: number;
  onAccountChange?: (data: string[]) => void;
  onChainChange?: (chainId: number) => void;

  constructor(onAccountChange?: (data: string[]) => void) {
    this.onAccountChange = onAccountChange;
  }
  getProvider() {
    return new providers.Web3Provider(this.ethereum, this.chainId);
  }
  init(): Promise<void> {
    if (this.isInit) return Promise.resolve();
    return new Promise<void>((resolve) => {
      let handled = false;
      const eWin = window as { ethereum?: Metamask["ethereum"] };
      const handleEthereum = () => {
        if (handled) return;
        handled = true;
        window.removeEventListener("ethereum#initialized", handleEthereum);
        const mWin = window as { ethereum?: Metamask["ethereum"] };
        const ethereum = mWin.ethereum;
        this.chainId = parseInt(ethereum.chainId.replace("0x", ""), 16);
        console.info("ethereum::", mWin.ethereum);
        if (ethereum && ethereum.isMetaMask) {
          ethereum
            .request<string[]>({ method: "eth_accounts" })
            .then((accounts) => {
              console.info("init-accounts:", accounts);
              this.isInstalled = true;
              this.isInit = true;
              this.ethereum = ethereum;
              this.isAllowed = true;
              this.accounts = accounts;
              this.setLis();
              resolve();
            })
            .catch(() => {
              this.isInstalled = true;
              this.isInit = true;
              resolve();
            });
        } else {
          this.isInit = true;
          resolve();
        }
      };

      if (eWin.ethereum) {
        handleEthereum();
      } else {
        window.addEventListener("ethereum#initialized", handleEthereum, { once: true });
        setTimeout(handleEthereum, 2000);
      }
    });
  }

  private setLis() {
    this.ethereum.on("accountsChanged", (data) => {
      console.info("metamask:accountsChanged:", data);
      if (this.onAccountChange) {
        this.onAccountChange(data as string[]);
      }
      this.isInit = false
      this.init()
    });

    this.ethereum.on("chainChanged", (chainId) => {
      console.info("metamask:chainChanged:", chainId);
      this.chainId = parseInt(chainId.replace("0x", ""), 16);
      this.onChainChange && this.onChainChange(chainId);
    });
  }

  sign(data: string, account?: string): Promise<string> {
    console.log("data:::", data);
    const msg = Buffer.from(data, "utf8").toString("hex");
    // const msg = data;

    console.info("msg::", msg);
    if (!this.ethereum?.request) return Promise.reject("Error");
    return this.ethereum
      ?.request<string>({
        from: account,
        params: [msg, account],
        method: "personal_sign",
      })
      .then((signature) => {
        console.info("signData:", signature);
        return signature;
      });
  }

  switchChain(chainId: number): Promise<boolean> {
    if (!this.ethereum?.request) return Promise.reject("Error");
    const cId = `0x${chainId.toString(16)}`;
    return this.ethereum
      .request({
        from: this.ethereum.selectedAddress,
        method: "wallet_switchEthereumChain",
        params: [{ chainId: cId }],
      })
      .then(() => true);
  }
}
