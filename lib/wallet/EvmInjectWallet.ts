import _, { parseInt } from "lodash";
import { BaseWallet, LoginUser, WalletType } from "./types";
import { providers } from "ethers";
import { Hex } from "viem";

export interface MetamaskReqOptions {
  from?: string;
  params?: (string | any)[];
  method: string;
}

export abstract class EvmInjectWallet extends BaseWallet {
  abstract readonly type: WalletType;

  name = "Evm Inject Wallet";
  icon = "/images/wallet.svg";
  isInjectWallet = true;
  ethereum?: {
    isMetaMask: boolean;
    request: <T>(option: MetamaskReqOptions) => Promise<T>;
    selectedAddress?: string;
    chainId: string;
    selfChainId: string;
    isConnected: () => boolean;
    on: (type: string, handler: (data: any) => void) => void;
  } = undefined;

  chainId: number;
  async syncChainId() {
    if (!this.ethereum) return;
    let chainId = this.ethereum.chainId || this.ethereum.selfChainId;
    if (_.isNil(chainId)) {
      chainId = await this.ethereum.request<string>({ method: "eth_chainId" });
    }
    if (_.isNil(chainId)) return;
    this.chainId = typeof chainId == "string" && chainId.startsWith("0x") ? parseInt(chainId.replace("0x", ""), 16) : parseInt(`${chainId}`);
  }
  getProvider() {
    return new providers.Web3Provider(this.ethereum, this.chainId);
  }

  async initBy(old?: LoginUser, injectKey = "ethereum", checkKey?: string): Promise<void> {
    if (this.isInit) return Promise.resolve();
    await new Promise<void>((resolve) => {
      let handled = false;
      const eWin = window as any;
      const handleEthereum = () => {
        if (handled) return;
        handled = true;
        window.removeEventListener("ethereum#initialized", handleEthereum);
        const ethereum =
          injectKey !== "ethereum" && eWin[injectKey] ? eWin[injectKey] : eWin["ethereum"] && (!checkKey || eWin["ethereum"][checkKey]) ? eWin["ethereum"] : undefined;
        console.info(`${injectKey}:`, eWin.ethereum);
        this.ethereum = ethereum;
        if (this.ethereum) {
          this.syncChainId();
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
  async init(old?: LoginUser): Promise<void> {
    this.initBy(old);
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
      if (!this.ethereum) throw `${this.name} not installed`;
      const accounts = await this.ethereum.request<string[]>({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length == 0) throw `${this.name} error`;
      this.accounts = accounts;
      if (this.ethereum.selectedAddress && accounts.includes(this.ethereum.selectedAddress)) {
        this.account = this.ethereum.selectedAddress;
      } else {
        this.account = accounts[0];
      }
      this.setLis();
      this.isConnected = true;
    }
    return { account: this.account, wallet: this.type };
  }

  private setLis() {
    this.ethereum.on("accountsChanged", (data) => {
      console.info(`${this.name}:accountsChanged:`, data);
      if (this.onAccountChange) {
        this.onAccountChange(data as string[]);
      }
      this.isInit = false;
      this.init();
    });

    this.ethereum.on("chainChanged", (chainId) => {
      console.info(`${this.name}:chainChanged:`, chainId);
      this.syncChainId();
      this.onChainChange && this.onChainChange(this.chainId);
    });
  }

  async sign(data: string, account?: string): Promise<string> {
    console.log("data:::", data);
    // const msg = Buffer.from(data, "utf8").toString("hex");
    const msg = data;

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

  async switchAndInstallChain(chaincfg: {
    chainId: Hex;
    chainName: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  }): Promise<boolean> {
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
