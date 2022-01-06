import { getDeposit } from "../http/share_earn";
import { Deposit, DepositDTO } from "../http/types";
import { useAutoUpdateToStore } from "../initAppStore";
import { useContextWrapLoginUser, WrapLoginUser } from "../wallet/hooks";
import { useGet } from "./useGet";

export interface UseGetDeposit {
    isPremiumUser: boolean,
    isCrust: boolean,
    loading: boolean,
    deposit?: Deposit,
    depositDto?: DepositDTO,
    hasDeposit: boolean,
    doGetDeposit: () => void,
    user: WrapLoginUser
}

export function useGetDepost(): UseGetDeposit {
    const user = useContextWrapLoginUser()
    const { account, wallet, member } = user
    const isCrust = wallet === 'crust'
    const [mDeposit, doGetDeposit, loading] = useGet(() => getDeposit(account), [account, isCrust], 'getDeposit')
    const { deposit } = useAutoUpdateToStore({ key: 'deposit', value: mDeposit })
    const hasDeposit = !!(deposit && deposit.deposit && deposit.deposit.id)
    const isMember1 = !!(member && member.member_state === 1)
    return {
        isPremiumUser: isMember1 || hasDeposit,
        deposit,
        loading,
        depositDto: deposit?.deposit,
        hasDeposit,
        doGetDeposit,
        isCrust,
        user
    }
}