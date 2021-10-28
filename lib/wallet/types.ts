// 0.Base
export interface BaseWallet {
  isInit: boolean
  init: () => Promise<void>
  sign: (data: string, account?: string) => Promise<string>
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
}

export interface DirFile extends File {
  webkitRelativePath: string,
}

export interface FileInfo {
  file?: File,
  files?: DirFile[],
  dir?: string,
}
