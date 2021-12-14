import { LoginUser } from './wallet/hooks';

export * from './wallet/types'

export interface ShareOptions {
    from?: string,
    gateway?: string,
    name: string,
    encrypted: boolean,
    isDir: boolean,
    fromAccount?: string,
    fromWallet?: LoginUser['wallet']
}