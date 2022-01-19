import React, {useCallback, useState} from "react";
import {Input, Modal, ModalProps} from "semantic-ui-react";
import {parseUserCrypto, UserCrypto} from "../../lib/crypto/useUserCrypto";
import styled from "styled-components";
import Btn from "../Btn";
import {WrapAlert} from "../../lib/initAlert";

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

  return <Modal closeIcon={<span className="close icon cru-fo-x"/>} onClose={_onCloseInputKey} {...other}>
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
  width: 34.3rem !important;

  .header {
    height: 3.93rem;
    font-size: 1.3rem !important;
    padding: 0 1.14rem !important;
    font-weight: 600 !important;
    line-height: 3.93rem !important;
  }


  .close.icon {
    top: 0.5rem;
    right: 0.6rem;
    color: #666666;
  }

  .content {
    padding: 1rem !important;

    input {
      border: 0.07rem solid #CCCCCC !important;
      border-radius: 0.57rem !important;
    }

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
  }
`)
