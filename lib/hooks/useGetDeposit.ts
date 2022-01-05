import { getDeposit } from "../http/share_earn";
import { Deposit, DepositDTO } from "../http/types";
import { useContextWrapLoginUser, WrapLoginUser } from "../wallet/hooks";
import { useGet } from "./useGet";

export interface UseGetDeposit {
    isPremiumUser: boolean,
    isCrust: boolean,
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
    const [deposit, doGetDeposit] = useGet(() => getDeposit(account), [account, isCrust])
    const hasDeposit = !!(deposit && deposit.deposit && deposit.deposit.id)
    const isMember1 = !!(member && member.member_state === 1)
    return {
        isPremiumUser: isMember1 || hasDeposit,
        deposit,
        depositDto: deposit?.deposit,
        hasDeposit,
        doGetDeposit,
        isCrust,
        user
    }
}