import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownItemProps, Modal, ModalProps } from "semantic-ui-react";
import styled from "styled-components";
import { useGet } from "../../lib/hooks/useGet";
import { getNickPairList } from "../../lib/http/share_earn";
import { NickPair } from "../../lib/http/types";
import { LoginUser } from "../../lib/types";
import { shortStr } from "../../lib/utils";
import { WrapLoginUser } from "../../lib/wallet/hooks";
import { updateAuth } from "../../lib/wallet/tools";
import Btn from "../Btn";
export interface Props extends ModalProps {
  toggleOpen: (open?: boolean) => void;
  user: WrapLoginUser;
}

function ModalSelectAccount(props: Props) {
  const { user, toggleOpen, ...other } = props;
  const [account, setAccount] = useState(user.account);

  const _onChange = useCallback((_, { value }) => {
    setAccount(value);
  }, []);

  const _onClickConfirm = useCallback(() => {
    if (user.account !== account) {
      const u = new LoginUser();
      u.account = account;
      u.pubKey = user.pubKey;
      u.profileImage = user.profileImage;
      u.wallet = user.wallet;
      u.signature = user.signature;
      updateAuth(u).then(() => user.setLoginUser(u));
    }
    toggleOpen(false);
  }, [account, user]);

  const [pairs] = useGet(() => {
    if (user.accounts.length > 50) {
      const chunks = _.chunk(user.accounts, 50);
      return Promise.all(chunks.map((acc) => getNickPairList(acc))).then((data) => _.flatten(data) as NickPair[]);
    }
    return getNickPairList(user.accounts);
  }, [user.accounts, user.wallet === "crust"]);
  const options: DropdownItemProps[] = useMemo(() => {
    const pairsMap = _.keyBy(pairs || [], "address");
    return (user.useWallet?.accounts || []).map((item) => ({
      text: () => (
        <>
          {shortStr(item)} <span style={{ float: "right" }}>{_.get(pairsMap, `${item}.nick_name`, "") as string}</span>
        </>
      ),
      value: item,
    })) as any;
  }, [user, pairs]);

  return (
    <Modal closeIcon={<span className="close icon cru-fo-x" />} onClose={() => toggleOpen(false)} {...other}>
      <Modal.Header content={"Select Account"} />
      <Modal.Content>
        <Dropdown fluid selection icon={<span className="icon cru-fo cru-fo-chevron-down" />} defaultValue={account} options={options} onChange={_onChange} />
        <div className={"btns"}>
          <Btn content={"Confirm"} onClick={_onClickConfirm} />
          <Btn content={"Cancel"} onClick={() => toggleOpen(false)} />
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default React.memo<Props>(styled(ModalSelectAccount)`
  overflow: unset !important;
  width: 34.3rem !important;

  .header {
    height: 3.93rem;
    font-size: 1.3rem !important;
    padding: 0 1.14rem !important;
    font-weight: 600 !important;
    line-height: 3.93rem !important;
    border-top-right-radius: 0.6rem !important;
    border-top-left-radius: 0.6rem !important;
  }

  .close.icon {
    top: 0.5rem;
    right: 0.6rem;
    color: #666666;
  }

  .content {
    padding: 1rem !important;
    border-bottom-right-radius: 0.6rem !important;
    border-bottom-left-radius: 0.6rem !important;

    .btns {
      padding-top: 2.3rem;

      button {
        width: calc(50% - 0.5rem) !important;
        margin: unset;
      }

      button:first-child {
        margin-right: 1rem;
      }
    }

    .ui.dropdown {
      border-radius: 0.57rem !important;
      border: 0.07rem solid #cccccc !important;
      box-shadow: unset !important;

      .icon {
        position: absolute;
        right: 0.8rem;
        top: 0.7rem;
      }

      .text {
        font-weight: 500 !important;
        color: var(--main-color) !important;
        font-family: OpenSans-Medium sans-serif !important;
      }

      .menu {
        background: #ffffff;
        box-shadow: 0 0.57rem 1.43rem 0 rgba(0, 0, 0, 0.1) !important;
        border-radius: 0.57rem !important;
        border: 0.07rem solid #eeeeee !important;
        padding: unset !important;
        top: calc(100% + 0.6rem);

        .item {
          padding: 1rem 0.8rem !important;
          border-radius: unset !important;
          border-top: 1px solid #eeeeee;
          font-weight: 500;
          color: var(--main-color) !important;
          font-family: OpenSans-Medium sans-serif;

          &:active {
            background-color: #eeeeee;
          }
        }

        .item:first-child {
          border-top: unset !important;
        }
      }
    }
  }
` as any);
