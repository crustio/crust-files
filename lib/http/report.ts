import { LoginUser } from "../wallet/hooks"
import axios from 'axios'
import { createUrl } from "./share_earn"
/**
 * 
 * 1: user login
 * 2: upload file,
 * 3: share file,
 * 
 */
export type ReportType = 1 | 2 | 3

export type WalletType = LoginUser['wallet']


export interface R_File {
    cid: string,
    // 0: file, 1: dir
    fileType: 0 | 1,
    // 0: public, 1: private
    strategy: 0 | 1,
}
export interface R_Sahre extends R_File {
    // 0: createShare, 1: receiveShare
    shareType: 0 | 1,
}

// export interface
export interface DATAS {
    1: any,
    2: R_File,
    3: R_Sahre
}

export interface ReportData {
    type: ReportType,
    walletType: WalletType,
    address: string
    data?: DATAS[ReportType]
}

export function report(data: ReportData) {
    return axios.post(createUrl('/common/report'), data).catch(console.error)
}