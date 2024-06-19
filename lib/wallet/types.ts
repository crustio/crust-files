import { providers } from "ethers";

// 0.Base
export interface BaseWallet {
  isInit: boolean;
  init: () => Promise<void>;
  sign: (data: string, account?: string) => Promise<string>;
  getProvider?: () => providers.Web3Provider | undefined;
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
  "metax",
  "near",
  "flow",
  "solana",
  "algorand",
  "elrond",
  "wallet-connect",
  "aptos-martian",
  "aptos-petra",
  "web3auth",
  "subWallet",
  "talisman",
  "oasis",
  "mimir",
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
