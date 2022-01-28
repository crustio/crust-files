import { ShareOptions } from "../types";

export interface CommonResponse<T> {
    code: number,
    message: string,
    data?: T
}

export type CommonRes = CommonResponse<any>


export interface Member {
    id: number,
    nick_name: string,
    chain_type: string,
    address: string,
    member_state: number, // 0: 默认。 1: PreminuUser
}

export interface DepositDTO {
    id: number,
    block_number: number,
    amount: string,
    is_share: boolean,
    deposit_amount: string,
    claim_amount: string,
    share_from: string,
    deposit_state: number,// 1 deposited, 2 pendingRedeem
    expire_timestamp: number,
    extrinsic_hash: string,
}

export interface Deposit {
    deposit: DepositDTO
    claimOngoing: boolean,
    depositOngoing: boolean
}

export interface Reward {
    claimOngoing: boolean,
    totalInvition: number,
    pendingReward: string,
    claimedReward: string
}

export interface ShareEarnConfig {
    guaranteeAmount: string // 当前价 
    guaranteeDiscountWithReferer: string // 当前邀请码价
    guaranteePeriod: string // 过期秒数
    preclaimPercentage: string // 提前赎回比例
    shareAndEarnPerUserReward: string // 每邀请获利

    // 过期区块数量
    guaranteeBlockCount: "180",
    // 是否展示打折前价格
    showBase: boolean,
    // 原价
    baseGuaranteeAmount: string,
    // 邀请码原价
    baseGuaranteeDiscountWithReferer: string
    // LuckyNewbie每质押产生的奖金
    depositRewardAmount: string
}

export interface RewardItem {
    total: number,
    pending: number,
    claimed: number,
}
export interface Rewards {

    onGoing: boolean,
    // Share
    reward: RewardItem,
    // GrandDraw
    grandDraw: RewardItem,
    // Lunky Newbie
    depositReward: RewardItem,
    // Total
    total: RewardItem
}

export interface NetworkState {
    // PremiumUser Count
    premiumUser: number,
    // Deposit Pool,
    depositPool: number,
    // 已发收益，
    rewardsDistributed: number,
    // 剩余未发收益。
    remainingRewards: number
}

export interface LuckyNebie {
    // 当前总收益
    totalAmount: number,
    // 最后一个质押用户的区块号
    lastBlockNumber: number,
    // 最后一个质押用户的地址
    memberAddress: string,
    // 多少块后无用户质押，可领取奖励
    blockCount: number,
}

export interface GrandDraw {
    // 0: 未到达开奖条件，  1: 到达开奖条件，未开奖， 2：已开奖
    drawState: number,
    // 参与人数
    depositCount: number,
    grandDraw: {
        // 总奖金
        totalAmount: number,
        // 开奖block
        expireBlock: number,
        // 开奖需要的参与人数
        memberSize: number,
        // 匹配hash的后几位
        matchCount: number
        // 
        blockHash: string,
    }
    // 中奖成员
    members?: { address: string }[]
}

export interface GrandApplyState {
    applyed: boolean
}

export interface NFT {
    cid: string
}


export interface RewardsHistory {
    invite: {
        amount: number
        totalAmount: number
        inviteCount: number
        currentInvitation: string
    }
    newbie: {
        totalAmount: number
        claimList: { address: string, blockNumber: number, totalAmount: number }[]
        amount: number
    }
    grandDraw: {
        totalAmount: number
        drawList: { id: number, totalAmount: number, blockNumber: number, blockHash: string, matchCount: number, winnerCount: number }[]
        ownerList?: { id: number, amount: number, totalAmount: number, winnerCount }[]
    }
    claimRewards?: {
        totalAmount: number
        claimList?: { claimId: number, totalAmount: number, blockHash: string, txHash: string }[]
    }
}

export interface BindAddress {
    address: string,
    chain_type: number
}

export interface NickPair {
    address: string
    nick_name: string
}

export interface Winner {
    extrinsicHash: string,
    memberAddress: string
}

export interface ShortInfo {
    cid: string,
    options: ShareOptions
}