import React, {useContext} from "react";
import styled from "styled-components";
import SideLayout from "../components/SideLayout";
import {Segment} from "semantic-ui-react";
import User from "../components/User";
import {useUserCrypto} from "../lib/crypto/useUserCrypto";
import Btn from "../components/Btn";
import {useTranslation} from "react-i18next";
import {useToggle} from "../lib/hooks/useToggle";
import {AppContext} from "../lib/AppContext";
import ModalNewKey from "../components/ModalNewKey";
import {useClipboard} from "../lib/hooks/useClipboard";

export interface Props {
  className?: string
}

function Setting(props: Props) {
  const {className} = props
  const {t} = useTranslation()
  const uc = useUserCrypto()
  const {alert} = useContext(AppContext)
  const [open, toggleOpen] = useToggle(false)
  const copy = useClipboard()

  return <SideLayout path={'/setting'}>
    <Segment basic className={className}>
      <User/>
      {
        open && <ModalNewKey
          alert={alert}
          size={'tiny'}
          open={true}
          toggleOpen={toggleOpen}
          onSuccess={uc.set}
        />
      }
      <Segment basic className={"crypto"}>
        <div className={"title font1"}>{t('File Encryption')}</div>
        {uc.secret && <div className={"key"}>{`${t('Your File Encryption Key:')} ${uc.secret}`}</div>}
        {uc.seeds && <div className={"seeds"}>{`${t('Seed Phrase:')} ${uc.seeds}`}</div>}
        <div className={'btns'}>
          {
            uc.secret ? <Btn content={t('Copy')} onClick={() => copy(uc.seeds)}/> :
              <>
                <Btn content={t('Generate new')} onClick={uc.generate}/>
                <Btn content={t('Input a new key')} onClick={() => toggleOpen(true)}/>
              </>
          }
        </div>
      </Segment>
    </Segment>
  </SideLayout>
}

export default React.memo<Props>(styled(Setting)`
  padding: unset !important;


  .crypto {
    margin: unset !important;
    padding: 2rem 2rem !important;

    .title {
      line-height: 3.29rem;
      font-size: 2.86rem;
      color: var(--main-color);
    }

    .key, .seeds {
      font-size: 1rem;
      color: var(--secend-color);
      margin-top: 0.6rem;
      line-height: 1.57rem;
    }

    .btns {
      margin-top: 1rem;

      button:first-child {
        margin-right: 1rem;
      }
    }
  }

`)
