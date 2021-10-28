import React, {useCallback, useMemo, useState} from "react";
import {Dropdown, Modal, ModalProps} from "semantic-ui-react";
import styled from "styled-components";
import Btn from "./Btn";
import {WrapLoginUser} from "../lib/wallet/hooks";
import {shortStr} from "../lib/utils";

export interface Props extends ModalProps {
  toggleOpen: (open?: boolean) => void,
  user: WrapLoginUser,
}

function ModalSelectAccount(props: Props) {
  const {user, toggleOpen, ...other} = props
  const [account, setAccount] = useState(user.account)

  const _onChange = useCallback((_, {value}) => {
    setAccount(value)
  }, [])

  const _onClickConfirm = useCallback(() => {
    if (user.account !== account) {
      user.setLoginUser({
        wallet: user.wallet,
        account,
        pubKey: user.pubKey
      })
    }
    toggleOpen(false)
  }, [account, user])

  const options = useMemo(() => {
    return user.accounts.map(item => ({
      text: shortStr(item),
      value: item
    }))
  }, [user])

  return <Modal closeIcon={true} onClose={() => toggleOpen(false)} {...other}>
    <Modal.Header content={'Select account'}/>
    <Modal.Content>
      <Dropdown
        fluid
        selection
        defaultValue={account}
        options={options}
        onChange={_onChange}
      />
      <div className={"btns"}>
        <Btn content={"Confirm"} onClick={_onClickConfirm}/>
        <Btn content={"Cancel"} onClick={() => toggleOpen(false)}/>
      </div>
    </Modal.Content>
  </Modal>
}

export default React.memo<Props>(styled(ModalSelectAccount)`
  .header {
    height: 3.36rem;
    font-size: 1rem !important;
    padding: 0 1rem !important;
    font-weight: unset !important;
    line-height: 3.36rem !important;
  }


  .close.icon {
    top: 0.5rem;
    right: 0.6rem;
    color: #666666;
  }

  .content {
    padding: 1rem !important;

    .btns {
      padding-top: 1rem;

      button {
        width: calc(50% - 0.5rem) !important;
        margin: unset;
      }

      button:first-child {
        margin-right: 1rem;
      }
    }
  }
`)
