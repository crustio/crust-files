
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
    deposit_state: number,
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