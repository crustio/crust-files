import { connect as wagmiConnect, Connector, getAccount, switchChain, watchAccount, watchChainId, signMessage, getConnections } from "@wagmi/core";
import { Hex, hexToNumber } from "viem";
import { Config } from "wagmi";
import { BaseWallet, EvmWallet, LoginUser, WalletType } from "./types";
export abstract class WagmiWallet extends BaseWallet implements EvmWallet {
  abstract readonly type: WalletType;
  isEvmWallet: boolean = true;
  config: Config = null as any;
  connector: Connector = null as any;
  ready(config: Config, connectorIndex: number = 0) {
    this.config = config;
    this.connector = this.config.connectors[connectorIndex];
  }

  getProvider(){
    
    return undefined
  }
  async init(old?: LoginUser) {
    if (this.isInit) return;
    if (this.connector && this.config) {
      const connections = getConnections(this.config);
      const conn = connections.find((item) => item.connector == this.connector);
      if (conn) this.setLis();
    }
    this.isInit = true;
    await super.init(old);
  }
  async fetchAccounts() {
    try {
      const { address } = getAccount(this.config);
      if (address) return [address];
      return [];
    } catch (error) {
      return [];
    }
  }

  unWatchAccount?: () => void;
  unWatchChainId?: () => void;
  private setLis() {
    this.unWatchAccount = watchAccount(this.config, {
      onChange: (account) => {
        this.onAccountChange?.((account?.addresses ?? []) as any);
      },
    });
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
      const { accounts } = await wagmiConnect(this.config, { connector: this.connector });
      if (!accounts || accounts.length == 0) throw `${this.name} error`;
      this.accounts = [...accounts];
      this.account = accounts[0];
      this.setLis();
      this.isConnected = true;
    }
    return { account: this.account, wallet: this.type };
  }
  async sign(data: string, account?: string) {
    const signature = await signMessage(this.config, { message: data, connector: this.connector });
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
