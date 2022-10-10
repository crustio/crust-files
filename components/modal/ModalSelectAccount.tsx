import React, { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownItemProps, Modal, ModalProps } from "semantic-ui-react";
import styled from "styled-components";
import Btn from "../Btn";
import { getPerfix, WrapLoginUser } from "../../lib/wallet/hooks";
import { shortStr } from "../../lib/utils";
import { useGet } from "../../lib/hooks/useGet";
import { getNickPairList } from "../../lib/http/share_earn";
import _ from 'lodash';
import { NickPair } from "../../lib/http/types";
export interface Props extends ModalProps {
  toggleOpen: (open?: boolean) => void,
  user: WrapLoginUser,
}

function ModalSelectAccount(props: Props) {
  const { user, toggleOpen, ...other } = props
  const [account, setAccount] = useState(user.account)

  const _onChange = useCallback((_, { value }) => {
    setAccount(value)
  }, [])

  const _onClickConfirm = useCallback(() => {
    if (user.account !== account) {
      const prefix = getPerfix(user);
      const msg = user.wallet === 'near' || user.wallet === 'aptos-martian' || user.wallet === 'aptos-petra' ? user.pubKey || '' : user.account;
      user.sign(msg, user.account).then(signature => {
        if (signature.length) {
          const perSignData = user.wallet === 'elrond' ? signature : `${prefix}-${msg}:${signature}`;
          const base64Signature = window.btoa(perSignData);
          const authBasic = `${base64Signature}`;
          const authBearer = `${base64Signature}`;
          user.setLoginUser({
            wallet: user.wallet,
            account,
            pubKey: user.pubKey,
            authBasic,
            authBearer,
            signature
          })
        } else {
          user.setLoginUser({
            wallet: user.wallet,
            account,
            pubKey: user.pubKey,
            // authBasic: null,
            // authBearer: null
          });
        }
      }).catch(() => {
        user.setLoginUser({
          wallet: user.wallet,
          account,
          pubKey: user.pubKey,
          // authBasic: null,
          // authBearer: null
        });
      })
      // user.setLoginUser({
      //   wallet: user.wallet,
      //   account,
      //   pubKey: user.pubKey
      // })
    }
    toggleOpen(false)
  }, [account, user])

  const [pairs] = useGet(() => {
    if (user.accounts.length > 50) {
      const chunks = _.chunk(user.accounts, 50)
      return Promise.all(chunks.map(acc => getNickPairList(acc)))
        .then(data => _.flatten(data) as NickPair[])
    }
    return getNickPairList(user.accounts)
  }, [user.accounts, user.wallet === 'crust'])
  const options: DropdownItemProps[] = useMemo(() => {
    const pairsMap = _.keyBy(pairs || [], 'address')
    return user.accounts.map(item => ({
      text: () => <>{shortStr(item)} <span style={{ float: 'right' }}>{_.get(pairsMap, `${item}.nick_name`, '')}</span></>,
      value: item
    }))
  }, [user, pairs])

  return <Modal closeIcon={<span className="close icon cru-fo-x" />} onClose={() => toggleOpen(false)} {...other}>
    <Modal.Header content={'Select Account'} />
    <Modal.Content>
      <Dropdown
        fluid
        selection
        icon={<span className="icon cru-fo cru-fo-chevron-down" />}
        defaultValue={account}
        options={options}
        onChange={_onChange}
      />
      <div className={"btns"}>
        <Btn content={"Confirm"} onClick={_onClickConfirm} />
        <Btn content={"Cancel"} onClick={() => toggleOpen(false)} />
      </div>
    </Modal.Content>
  </Modal>
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
      border: 0.07rem solid #CCCCCC !important;
      box-shadow: unset !important;

      .icon {
        position: absolute;
        right: .8rem;
        top: .7rem;
      }
      
      .text {
        font-weight: 500 !important;
        color: var(--main-color) !important;
        font-family: OpenSans-Medium sans-serif !important;
      }

      .menu {
        background: #FFFFFF;
        box-shadow: 0 0.57rem 1.43rem 0 rgba(0, 0, 0, 0.1) !important;
        border-radius: 0.57rem !important;
        border: 0.07rem solid #EEEEEE !important;
        padding: unset !important;
        top: calc(100% + 0.6rem);

        .item {
          padding: 1rem 0.8rem !important;
          border-radius: unset !important;
          border-top: 1px solid #EEEEEE;
          font-weight: 500;
          color: var(--main-color) !important;
          font-family: OpenSans-Medium sans-serif;

          &:active {
            background-color: #EEEEEE;
          }
        }

        .item:first-child {
          border-top: unset !important;
        }
      }
    }
  }
`)
