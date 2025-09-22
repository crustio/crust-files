import { connect as wagmiConnect, Connector, getAccount, switchChain, watchAccount, watchChainId, signMessage, getConnections, getConnectorClient, reconnect } from "@wagmi/core";
import { Account, Chain, Client, Hex, hexToNumber, toHex, Transport } from "viem";
import { Config } from "wagmi";
import { BaseWallet, EvmWallet, LoginUser, WalletType } from "./types";
import { providers } from "ethers";
import { genPromise } from "../utils";
export abstract class WagmiWallet extends BaseWallet implements EvmWallet {
  abstract readonly type: WalletType;
  isEvmWallet: boolean = true;
  config: Config = null as any;
  connector: Connector = null as any;
  connectorClient: Client<Transport, Chain, Account> = null as any;
  readypromise = genPromise<boolean>();
  isReady: Promise<boolean> = this.readypromise.promise;
  ready(config: Config, connectorIndex: number = 0) {
    this.config = config;
    this.connector = this.config.connectors[connectorIndex];
    this.connector.isAuthorized().then((isAuthed) => {
      isAuthed &&
        reconnect(this.config)
          .then(() => getConnectorClient(this.config, { connector: this.connector }))
          .then((c) => (this.connectorClient = c))
          .catch(console.error);
    });
    this.readypromise.reslove(true);
  }

  getProvider() {
    if (!this.connectorClient) return undefined;
    const { chain, transport } = this.connectorClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    return new providers.Web3Provider(transport, network);
  }
  async init(old?: LoginUser) {
    if (this.isInit) return;
    if (this.connector && this.config) {
      const isAuthed = await this.connector.isAuthorized();
      if (isAuthed) {
        const connections = await reconnect(this.config, { connectors: [this.connector] });
        this.connectorClient = await getConnectorClient(this.config, { connector: this.connector });
        console.info("WagmiWallet:", this.connector, connections, this.connectorClient);
        this.setLis();
      }
    }
    this.isInit = true;
    this.isInited.reslove(true);
    await super.init(old);
    console.info("WagmiWallet:inited:", this.account, this.accounts);
  }
  async fetchAccounts() {
    try {
      const accounts = await this.connector.getAccounts();
      return [...accounts];
    } catch (error) {
      return [];
    }
  }

  unWatchAccount?: () => void;
  unWatchChainId?: () => void;
  private setLis() {
    // this.unWatchAccount = watchAccount(this.config, {
    //   onChange: (account) => {
    //     this.onAccountChange?.((account?.addresses ?? []) as any);
    //   },
    // });
    // this.connector.onAccountsChanged
    this.unWatchChainId = watchChainId(this.config, {
      onChange: async (chainId) => {
        this.onChainChange?.(chainId);
      },
    });
  }

  disconnect(): void {
    super.disconnect();
    this.unWatchAccount?.();
    this.unWatchChainId?.();
  }

  async connect() {
    if (!this.isConnected) {
      const isAuthed = await this.connector.isAuthorized();
      if (isAuthed) {
        const accounts = await this.fetchAccounts();
        if (!accounts || accounts.length == 0) throw `${this.name} error`;
        this.accounts = accounts;
        this.account = accounts[0];
      } else {
        const { accounts } = await wagmiConnect(this.config, { connector: this.connector });
        if (!accounts || accounts.length == 0) throw `${this.name} error`;
        this.accounts = [...accounts];
        this.account = accounts[0];
      }
      this.setLis();
      this.isConnected = true;
    }
    return { account: this.account, wallet: this.type };
  }
  async sign(data: string, account?: string) {
    const signature = await signMessage(this.config, { message: { raw: toHex(data) }, connector: this.connector });
    return signature;
  }

  async switchAndInstallChain(chaincfg: {
    chainId: Hex;
    chainName: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  }): Promise<boolean> {
    try {
      await switchChain(this.config, { connector: this.connector, chainId: hexToNumber(chaincfg.chainId), addEthereumChainParameter: chaincfg });
      return true;
    } catch {
      return false;
    }
  }
}
