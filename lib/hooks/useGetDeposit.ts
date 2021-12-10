import { getDeposit } from "../http/share_earn";
import { Deposit } from "../http/types";
import { useContextWrapLoginUser } from "../wallet/hooks";
import { useGet } from "./useGet";

export interface UseGetDeposit {
    isPremiumUser: boolean,
    isCrust: boolean,
    deposit?: Deposit,
    hasDeposit: boolean,
    doGetDeposit: () => void,
}

export function useGetDepost(): UseGetDeposit {
    const { account, wallet, member } = useContextWrapLoginUser()
    const isCrust = wallet === 'crust'
    const [deposit, doGetDeposit] = useGet(() => getDeposit(account), [account, isCrust])
    const hasDeposit = !!(deposit && deposit.deposit && deposit.deposit.id)
    const isMember1 = !!(member && member.member_state === 1)
    return {
        isPremiumUser: isMember1 || hasDeposit,
        deposit,
        hasDeposit,
        doGetDeposit,
        isCrust
    }
}