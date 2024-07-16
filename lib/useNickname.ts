import _ from "lodash";
import { useEffect } from "react";
import { getMemberByAccount, getNickNameByAccount } from "./http/share_earn";
import { useContextWrapLoginUser } from "./wallet/hooks";

export function useLoadNickname() {
  const wUser = useContextWrapLoginUser();
  const { account, wallet } = wUser;
  useEffect(() => {
    if (account && wallet === "crust") {
      wUser.setIsLoadingNickname(true);
      getMemberByAccount(account)
        .then(wUser.setMember)
        .catch(console.error)
        .then(() => getNickNameByAccount(account))
        .then((name) => wUser.setNickName(name))
        .catch(console.error)
        .then(() => wUser.setIsLoadingNickname(false));
    }
    wUser.setMember(undefined);
    wUser.setNickName("");
  }, [account, wallet]);
}
