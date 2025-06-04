import { providers } from "ethers";

// 0.Base
export abstract class BaseWallet {
  // base info
  abstract readonly name: string;
  abstract readonly icon: string;
  group?: "Web3" | "Polkadot" | "Metamask";
  accounts: string[] = [];
  account: string;
  pubKey?: string;
  isInit: boolean;
  isConnected: boolean;
  async init(old?: LoginUser): Promise<void> {
    this.accounts = await this.fetchAccounts();
    if (old && this.accounts.includes(old.account)) {
      this.account = old.account;
      this.isConnected = true;
    }
  }
  abstract fetchAccounts(): Promise<string[]>;
  abstract connect(): Promise<LoginUser>;
  abstract sign(data: string, account?: string): Promise<string>;
  disconnect() {
    this.isConnected = false;
    this.onAccountChange = undefined;
    this.onChainChange = undefined;
    this.isInit = false;
  }
  getProvider(): providers.Web3Provider | undefined {
    return undefined;
  }

  onAccountChange?: (data: string[]) => void;
  onChainChange?: (chainId: number) => void;

  constructor() {}
}

// other
export interface UploadRes {
  Hash: string;
  Size: string;
  Name: string;
  items?: UploadRes[];
}

export interface SaveFile extends UploadRes {
  UpEndpoint: string;
  PinEndpoint?: string;
  PinTime: number;
  Account?: string;
  Encrypted?: boolean;
  PinTx?: string;
  PinChainId?: number;
}

export interface DirFile extends File {
  webkitRelativePath: string;
  _webkitRelativePath: string;
}

export interface BlobFile extends Blob {
  name: string;
}

export interface FileInfo {
  file?: File | BlobFile;
  files?: DirFile[];
  dir?: string;
}

export interface ExportObj {
  files: SaveFile[];
  secret?: string;
}

export type KEY_TYPE = "files:login" | "pins:login";
export const wallets = [
  "crust",
  "polkadot-js",
  "metamask",
  'coinbase',
  "metax",
  "flow",
  "solana",
  "algorand",
  "elrond",
  "wallet-connect",
  "aptos-martian",
  "aptos-petra",
  "subWallet",
  "talisman",
  "oasis",
  "mimir",
  "ton-connect",
] as const;

export type WalletType = typeof wallets[number];
export class LoginUser {
  account = "";
  pubKey?: string;
  wallet: WalletType;
  key?: KEY_TYPE = "files:login";
  authBasic?: string;
  authBearer?: string;
  signature?: string;
  profileImage?: string;
}
