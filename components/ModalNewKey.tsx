import React, {useCallback, useState} from "react";
import {Input, Modal, ModalProps} from "semantic-ui-react";
import {parseUserCrypto, UserCrypto} from "../lib/crypto/useUserCrypto";
import styled from "styled-components";
import Btn from "./Btn";
import {WrapAlert} from "../lib/initAlert";

export interface Props extends ModalProps {
  onSuccess: (nUc: UserCrypto) => void,
  alert: WrapAlert,
  toggleOpen: (open?: boolean) => void,
}

function ModalNewKey(props: Props) {
  const {alert, onSuccess, toggleOpen, ...other} = props

  const [inputKey, setInputKey] = useState("")

  const _onInputKeyChange = useCallback((_, {value}) => {
    setInputKey(value)
  }, [])
  const _onClickInput = useCallback(() => {
    const nUc = parseUserCrypto(inputKey)
    if (nUc) {
      onSuccess(nUc)
      toggleOpen(false)
    } else {
      alert.error("Please check input value")
    }
  }, [inputKey, alert])

  const _onCloseInputKey = useCallback(() => {
    setInputKey("")
    toggleOpen(false)
  }, [])

  return <Modal closeIcon={true} onClose={_onCloseInputKey} {...other}>
    <Modal.Header content={'Input a new key'}/>
    <Modal.Content>
      <Input
        fluid
        onChange={_onInputKeyChange}
      />
      <div className={"btns"}>
        <Btn content={"Input"} onClick={_onClickInput}/>
        <Btn content={"Cancel"} onClick={() => toggleOpen(false)}/>
      </div>
    </Modal.Content>
  </Modal>
}

export default React.memo<Props>(styled(ModalNewKey)`
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
