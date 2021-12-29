import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CommonResponse, Deposit, GrandApplyState, GrandDraw, LuckyNebie, Member, NetworkState, NFT, Reward, Rewards, ShareEarnConfig } from './types';
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
    return reqWithAuth<Member>(signature, '/auth/signUp', { nickName })
}

export function getMemberByAccount(address: string) {
    return axios.post<CommonResponse<Member>>(createUrl('/common/signIn'), { address })
        .then(getData)
}

// 活动配置信息
export function getShareEarnConfig() {
    return axios.get<CommonResponse<ShareEarnConfig>>(createUrl('/common/configs'))
        .then(getData)
}

// Deposit address
export function getDepositAddress(): Promise<string> {
    return axios.get<CommonResponse<string>>(createUrl('/common/payee'))
        .then(getData)
}

export function getDeposit(address: string) {
    return axios.post<CommonResponse<Deposit>>(createUrl('/common/deposit'), { address })
        .then(getData)
}

export function getReward(address: string) {
    return axios.post<CommonResponse<Reward>>(createUrl('/common/reward'), { address })
        .then(getData)
}

// 用户收益
export function getEarnRewards(address: string) {
    return axios.post<CommonResponse<Rewards>>(createUrl('/common/rewards'), { address })
        .then(getData)
}

export function getNetworkState() {
    return axios.get<CommonResponse<NetworkState>>(createUrl("/common/networkState"))
        .then(getData)
}

export function getLuckyNebie() {
    return axios.get<CommonResponse<LuckyNebie>>(createUrl("/common/newbie"))
        .then(getData)
}

export function getGrandDraw() {
    return axios.get<CommonResponse<GrandDraw>>(createUrl("/common/grandDraw"))
        .then(getData)
}

export function getGrandApplyState(address: string) {
    return axios.post<CommonResponse<GrandApplyState>>(createUrl('/common/grandApplyState'), { address })
        .then(getData)
}

export function applyGrandDraw(signature: string) {
    return reqWithAuth(signature, '/auth/member/grand/apply')
}

export function getNft(address: string) {
    return axios.post<CommonResponse<NFT[]>>(createUrl('/common/nft'), { address })
        .then(getData)
}

export function saveNft(signature: string, cid: string) {
    return reqWithAuth(signature, '/auth/member/nft', { cid })
}