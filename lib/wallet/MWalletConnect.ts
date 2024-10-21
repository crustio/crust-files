import IEthereumProvider, { EthereumProvider } from "@walletconnect/ethereum-provider";
import _ from "lodash";
import { BaseWallet, LoginUser } from "./types";

export class MWalletConnect extends BaseWallet {
  name = "Wallet Connect";
  icon = "/images/group_wallet_connect.png";
  ethereumProvider: IEthereumProvider;
  accounts: string[] = [];
  account: string;
  // onAccountChange?: (data: string[]) => void;
  // onChainChange?: (chainId: number) => void;
  getProvider() {
    if (!this.ethereumProvider) return undefined;
    // return this.appKit.getProvider()
  }
  async init(old?: LoginUser) {
    if (this.isInit) return;
    // 1. Get projectId
    const projectId = "e4f03e65ae41abb4f1a72bfa554e2d53";

    // 2. Create a metadata object - optional
    const metadata = {
      name: "CrustFiles",
      description: "Your first personal Web3.0 storage",
      url: "https://crustfiles.io", // origin must match your domain & subdomain
      icons: ["https://crustfiles.io/images/wallet_crust.png"],
    };

    // 3. Create the AppKit instance
    this.ethereumProvider = await EthereumProvider.init({
      projectId,
      showQrModal: true,
      qrModalOptions: { themeMode: "light", explorerRecommendedWalletIds: "NONE", explorerExcludedWalletIds: "ALL" },
      optionalChains: [1],
      disableProviderPing: true,
      // methods: ["eth_sendTransaction", "personal_sign"],
      // events: ["chainChanged", "accountsChanged"],
      metadata,
    });
    this.isInit = true;
    await super.init(old);
  }

  async fetchAccounts(): Promise<string[]> {
    try {
      if (!this.ethereumProvider) return [];
      const accounts = await this.ethereumProvider.request<string[]>({ method: "eth_accounts", params: [] });
      // this.accounts = accounts;
      return accounts;
    } catch (error) {
      return [];
    }
  }

  public async connect(): Promise<LoginUser> {
    if (!this.isConnected) {
      if (this.ethereumProvider.session) {
        await this.ethereumProvider.disconnect();
      }
      await Promise.race([
        this.ethereumProvider.connect(),
        new Promise<void>((reslove, reject) => {
          const unSub = this.ethereumProvider.modal?.subscribeModal((data) => {
            console.info("subModal:", data);
            if (!data.open) {
              console.info("modal closed");
              unSub();
              if (!this.ethereumProvider.connected) {
                reject("");
              } else {
                reslove();
              }
            }
          });
          console.info("unSub:", unSub);
        }),
      ]);
      console.info("connectEnd:", this.ethereumProvider.accounts);
      // await this.ethereumProvider.connect()
      if (_.isEmpty(this.ethereumProvider.accounts)) throw "";
      this.account = this.ethereumProvider.accounts[0];
      this.accounts = this.ethereumProvider.accounts;
      this.isConnected = true;
    }
    return { account: this.account, wallet: "wallet-connect" };
  }

  async sign(data: string, account: string | undefined): Promise<string> {
    const res = await this.ethereumProvider.request({ method: "personal_sign", params: [data, account] });
    console.info("res:", res);
    // const res = await this.connector?.signPersonalMessage([convertUtf8ToHex(data), account]);
    return res as string;
  }

  disconnect() {
    super.disconnect();
    this.ethereumProvider.disconnect();
  }
}
