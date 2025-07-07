import { providers } from "ethers";
import _, { parseInt } from "lodash";
import { Hex } from "viem";
import { BaseWallet, EvmWallet, LoginUser, WalletType } from "./types";
import MiniappSDK, { sdk } from "@farcaster/miniapp-sdk";
export interface MetamaskReqOptions {
  from?: string;
  params?: (string | any)[];
  method: string;
}

export class FarcasterWallet extends BaseWallet implements EvmWallet {
  readonly type: WalletType = "farcaster";
  readonly isEvmWallet: boolean = true;
  name = "Farcaster";
  icon = "/images/wallet.svg";
  isInjectWallet = true;
  provider?: {
    request: <T>(option: MetamaskReqOptions) => Promise<T>;
    on: (type: string, handler: (data: any) => void) => void;
  } = undefined;

  chainId: number = 1;
  async syncChainId() {
    if (!this.provider) return;
    const chainId = await this.provider.request({ method: "eth_chainId", params: [] });
    if (_.isNil(chainId)) return;
    this.chainId = typeof chainId == "string" && chainId.startsWith("0x") ? parseInt(chainId.replace("0x", ""), 16) : parseInt(`${chainId}`);
  }
  getProvider() {
    if (!this.provider) return undefined;
    return new providers.Web3Provider(this.provider as any, this.chainId);
  }

  async init(old?: LoginUser): Promise<void> {
    if (this.isInit) return;
    if (MiniappSDK.wallet.ethProvider) {
      this.provider = MiniappSDK.wallet.ethProvider as any;
    } else {
      this.provider = (await MiniappSDK.wallet.getEthereumProvider()) as any;
    }
    if (this.provider) {
      this.setLis();
    }
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      const accounts = await this.provider!.request({ method: "eth_accounts", params: [] });
      return accounts as string[];
    } catch (error) {
      return [];
    }
  }

  async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (!this.provider) throw `${this.name} not installed`;
      const accounts = await this.provider.request<string[]>({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length == 0) throw `${this.name} error`;
      this.accounts = accounts;
      this.account = accounts[0];
      this.setLis();
      this.isConnected = true;
    }
    return { account: this.account, wallet: this.type };
  }

  private setLis() {
    this.provider!.on("accountsChanged", (data) => {
      console.info(`${this.name}:accountsChanged:`, data);
      if (this.onAccountChange) {
        this.onAccountChange(data as string[]);
      }
      this.isInit = false;
      this.init();
    });

    this.provider!.on("chainChanged", async (chainId) => {
      console.info(`${this.name}:chainChanged:`, chainId);
      await this.syncChainId();
      this.onChainChange && this.onChainChange(this.chainId);
    });
  }

  async sign(data: string, account?: string): Promise<string> {
    console.log("data:::", data);
    // const msg = Buffer.from(data, "utf8").toString("hex");
    const msg = data;

    console.info("msg::", msg);
    if (!this.provider?.request) return Promise.reject("Error");
    return this.provider
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

  async switchAndInstallChain(chaincfg: {
    chainId: Hex;
    chainName: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  }): Promise<boolean> {
    if (!this.provider?.request) return Promise.reject("Error");
    const [user] = await this.fetchAccounts();
    return this.provider!
      .request({
        from: user,
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chaincfg.chainId }],
      })
      .then(() => {
        this.syncChainId().then(() => {
          this.onChainChange && this.onChainChange(this.chainId);
        });
        return true;
      })
      .catch((err) => {
        if (err.code === 4902) {
          return this.provider!
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
  ready() {
    sdk.actions.ready();
  }
}
