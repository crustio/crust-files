import { providers } from "ethers";

// 0.Base
export interface BaseWallet {
  isInit: boolean
  init: () => Promise<void>
  sign: (data: string, account?: string) => Promise<string>
  getProvider?: () => providers.Web3Provider|undefined
}

// other
export interface UploadRes {
  Hash: string,
  Size: string,
  Name: string,
  items?: UploadRes[],
}

export interface SaveFile extends UploadRes {
  UpEndpoint: string,
  PinEndpoint?: string,
  PinTime: number,
  Account?: string,
  Encrypted?: boolean,
  PinTx?: string,
  PinChainId?: number
}

export interface DirFile extends File {
  webkitRelativePath: string,
  _webkitRelativePath: string,
}

export interface BlobFile extends Blob {
  name: string
}

export interface FileInfo {
  file?: File | BlobFile,
  files?: DirFile[],
  dir?: string,
}

export interface ExportObj {
  files: SaveFile[],
  secret?: string
}