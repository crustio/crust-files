import { useMemo } from "react";
import { getReward } from "../http/share_earn";
import { trimZero } from "../utils";
import { useContextWrapLoginUser } from "../wallet/hooks";
import { useGet } from "./useGet";

export interface UseGetReward {
    hasReward: boolean,
    totalRewards: string,
    claimedRewards: string,
    validCount: number,
    claimOngoing: boolean,
    doGetReward: () => void,
}

export function useGetReward(): UseGetReward {
    const { account, wallet } = useContextWrapLoginUser()
    const isCrust = wallet === 'crust'
    const [reward, doGetReward] = useGet(() => getReward(account), [account, isCrust])
    const hasReward = !!(reward && reward.pendingReward)
    const totalRewards = useMemo(() => trimZero(`${reward?.pendingReward || '0'}`), [reward])
    const claimedRewards = useMemo(() => trimZero(`${reward?.claimedReward || '0'}`), [reward])
    const validCount = useMemo(() => reward && reward.totalInvition, [reward])
    const claimOngoing = !!(reward && reward.claimOngoing)
    return {
        hasReward,
        totalRewards,
        claimedRewards,
        validCount,
        claimOngoing,
        doGetReward,
    }
}