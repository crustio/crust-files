import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ShareEarnBaseUrl } from '../config';
import { ShareOptions } from '../types';
import { BindAddress, CommonResponse, Deposit, GrandApplyState, GrandDraw, LuckyNebie, Member, NetworkState, NFT, NickPair, Reward, Rewards, RewardsHistory, ShareEarnConfig, ShortInfo, Winner } from './types';
// import _ from 'lodash';

const base_url = ShareEarnBaseUrl
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

export function setMyNickName(nickName: string, verifyToken: string, signature: string) {
    return reqWithAuth<Member>(signature, '/auth/signUp', { nickName, verifyToken })
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

export function applyGrandDraw(verifyToken: string, signature: string) {
    return reqWithAuth(signature, '/auth/member/grand/apply', { verifyToken })
}

export function getNft(address: string) {
    return axios.post<CommonResponse<NFT[]>>(createUrl('/common/nft'), { address })
        .then(getData)
}

export function saveNft(signature: string, cid: string) {
    return reqWithAuth(signature, '/auth/member/nft', { cid })
}

export function getRewardsHistory(address = '') {
    return axios.post<CommonResponse<RewardsHistory>>(createUrl('/common/rewardsHistory'), { address })
        .then(getData)
}

export function getBindEXAddress(address: string) {
    return axios.post<CommonResponse<BindAddress[]>>(createUrl('/common/external/address'), { address })
        .then(getData)
}

export function getNickPairList(addressList: string[]) {
    return axios.post<CommonResponse<NickPair[]>>(createUrl('/common/members'), { address: addressList })
        .then(getData)
}

export function getGrandDrawWinners(id: number) {
    return axios.get<CommonResponse<Winner[]>>(createUrl(`/common/grandDraw/${id}/winners`))
        .then(getData)
}

export function createShortUrl(cid: string, options: ShareOptions) {
    return axios.post<CommonResponse<string>>(createUrl(`/common/calculateShortLinkHash`), { cid, options })
        .then(getData)
}

export function getShortInfo(code: string) {
    return axios.get<CommonResponse<ShortInfo>>(createUrl(`/common/shortLinkInfo/${code}`))
        .then(getData)
}