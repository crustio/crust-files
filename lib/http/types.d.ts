
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
    expire_timestamp: number
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
    guaranteeAmount: string // 原价 
    guaranteeDiscountWithReferer: string // 邀请码价
    guaranteePeriod: string // 过期秒数
    preclaimPercentage: string // 提前赎回比例
    shareAndEarnPerUserReward: string // 每邀请获利
}