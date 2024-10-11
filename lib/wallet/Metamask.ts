import { parseInt } from "lodash";
import { BaseWallet, LoginUser } from "./types";
import { providers } from "ethers";

export interface MetamaskReqOptions {
  from?: string;
  params?: (string | any)[];
  method: string;
}

export class Metamask extends BaseWallet {
  name = "Metamask";
  icon = "/images/group_wallet_metamask.png";

  ethereum?: {
    isMetaMask: boolean;
    request: <T>(option: MetamaskReqOptions) => Promise<T>;
    selectedAddress?: string;
    chainId: string;
    isConnected: () => boolean;
    on: (type: string, handler: (data: any) => void) => void;
  } = undefined;

  chainId: number;

  getProvider() {
    return new providers.Web3Provider(this.ethereum, this.chainId);
  }
  async init(old?: LoginUser): Promise<void> {
    if (this.isInit) return Promise.resolve();
    await new Promise<void>((resolve) => {
      let handled = false;
      const eWin = window as { ethereum?: Metamask["ethereum"] };
      const handleEthereum = () => {
        if (handled) return;
        handled = true;
        window.removeEventListener("ethereum#initialized", handleEthereum);
        const mWin = window as { ethereum?: Metamask["ethereum"] };
        const ethereum = mWin.ethereum;
        console.info("ethereum::", mWin.ethereum);
        this.ethereum = ethereum;
        if (this.ethereum) {
          this.chainId = parseInt(ethereum.chainId.replace("0x", ""), 16);
          this.setLis();
        }
        resolve();
      };
      if (eWin.ethereum) {
        handleEthereum();
      } else {
        window.addEventListener("ethereum#initialized", handleEthereum, { once: true });
        setTimeout(handleEthereum, 2000);
      }
    });
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      const accounts = this.ethereum.request<string[]>({ method: "eth_accounts" });
      return accounts;
    } catch (error) {
      return [];
    }
  }

  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.ethereum) throw "MetaMask not installed";
      const accounts = await this.ethereum.request<string[]>({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length == 0) throw "MetaMask error";
      this.accounts = accounts;
      if (this.ethereum.selectedAddress && accounts.includes(this.ethereum.selectedAddress)) {
        this.account = this.ethereum.selectedAddress;
      } else {
        this.account = accounts[0];
      }
      this.setLis();
      this.isConnected = true;
    }
    return { account: this.account, wallet: "metamask" };
  }

  private setLis() {
    this.ethereum.on("accountsChanged", (data) => {
      console.info("metamask:accountsChanged:", data);
      if (this.onAccountChange) {
        this.onAccountChange(data as string[]);
      }
      this.isInit = false;
      this.init();
    });

    this.ethereum.on("chainChanged", (chainId) => {
      console.info("metamask:chainChanged:", chainId);
      this.chainId = parseInt(chainId.replace("0x", ""), 16);
      this.onChainChange && this.onChainChange(chainId);
    });
  }

  async sign(data: string, account?: string): Promise<string> {
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

  async switchChain(chainId: number): Promise<boolean> {
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

  async switchAndInstallChain(chaincfg: any): Promise<boolean> {
    if (!this.ethereum?.request) return Promise.reject("Error");
    return this.ethereum
      .request({
        from: this.ethereum.selectedAddress,
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chaincfg.chainId }],
      })
      .then(() => true)
      .catch((err) => {
        if (err.code === 4902) {
          this.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [chaincfg],
            })
            .then(() => true)
            .catch((addError) => {
              console.error(addError);
              return false;
            });
        } else {
          return false;
        }
      });
  }
}
