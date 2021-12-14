import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CommonResponse, Deposit, Member, Reward, ShareEarnConfig } from './types';
// import _ from 'lodash';

const base_url = 'https://files-api.decoo.io'
export const createUrl = (path: string): string => {
    return `${base_url}${path}`
}

function getData<T>(res: AxiosResponse<CommonResponse<T>>): T {
    if (res.data.code === 200) return res.data.data
    throw { _type: "CommonResponseError", ...res.data }
}

function reqWithAuth<T>(signature: string, path: string, body?: any) {
    return axios.post<CommonResponse<T>>(createUrl(path), body, {
        headers: { authorization: `Basic ${signature}` }
    }).then(getData)
}

// ----------------------- api ----------------------------------
export function getNickNameByAccount(address: string) {
    return axios.post<CommonResponse<string>>(createUrl('/common/checkAddress'), { address })
        .then(getData)
}

export function getAccountByNickName(nickName: string) {
    return axios.post<CommonResponse<string>>(createUrl('/common/member'), { nickName })
        .then(getData)
}

export function checkNickName(nickName: string, config?: AxiosRequestConfig): Promise<boolean> {
    return axios.post<CommonResponse<string>>(createUrl('/common/member'), { nickName }, config)
        .then(res => {
            if (res.data.message === 'Invalid nick name') return true
            return false
        })
        .catch(() => false)
}

export function setMyNickName(nickName: string, signature: string) {
    return reqWithAuth<Member>(signature, '/auth/signUp', {
        nickName
    })
}

export function getMemberByAccount(address: string) {
    return axios.post<CommonResponse<Member>>(createUrl('/common/signIn'), { address })
        .then(getData)
}

// 付费用户金额
export function getGuaranteeAmount(): Promise<string> {
    return axios.get<CommonResponse<any>>(createUrl('/common/guaranteeAmount'))
        .then(getData).then(data => data.value as string)
}
// 分享用户折扣
export function getGuaranteeDiscountWithReferer(): Promise<string> {
    return axios.get<CommonResponse<any>>(createUrl('/common/guaranteeDiscountWithReferer'))
        .then(getData).then(data => data.value as string)
}
// 付费用户可使用区块数量
export function getGuaranteePeriod(): Promise<number> {
    return axios.get<CommonResponse<any>>(createUrl('/common/guaranteePeriod'))
        .then(getData).then(data => new Number(data.value as string).valueOf())
}
// 分享一个付费用户可获得收益
export function getShareAndEarnPerUserReward(): Promise<string> {
    return axios.get<CommonResponse<any>>(createUrl('/common/shareAndEarnPerUserReward'))
        .then(getData).then(data => data.value as string)
}
// 提前赎回比例
export function getPreclaimPercentage(): Promise<number> {
    return axios.get<CommonResponse<any>>(createUrl('/common/preclaimPercentage'))
        .then(getData).then(data => new Number(data.value as string).valueOf())
}

export function getShareEarnConfig() {
    return axios.get<CommonResponse<ShareEarnConfig>>(createUrl('/common/configs'))
        .then(getData)
}

// Deposit address
export function getDepositAddress(): Promise<string> {
    return axios.get<CommonResponse<string>>(createUrl('/common/payee'))
        .then(getData)
}
/**
{
    "blockNumber":123,
    "extrinsicIndex":12,
    "premarkType":0
}
export enum PremarkType {
  deposit = 0,
  depositClaim = 1,
  rewardClaim = 2,
}
 */
export function doPremark(
    blockNumber: number,
    extrinsicIndex: number,
    premarkType: 0 | 1 | 2,
    auth: string
) {
    return axios.post<CommonResponse<any>>(createUrl('/auth/member/premark'), {
        blockNumber, extrinsicIndex, premarkType
    }, {
        headers: {
            Authorization: `Basic ${auth}`
        }
    })
}


export function getDeposit(address: string) {
    return axios.post<CommonResponse<Deposit>>(createUrl('/common/deposit'), { address })
        .then(getData)
}

export function getReward(address: string) {
    return axios.post<CommonResponse<Reward>>(createUrl('/common/reward'), { address })
        .then(getData)
}
