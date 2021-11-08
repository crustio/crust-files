import React, {useContext} from "react";
import styled from "styled-components";
import SideLayout from "../../components/SideLayout";
import {Segment} from "semantic-ui-react";
import User from "../../components/User";
import {useUserCrypto} from "../../lib/crypto/useUserCrypto";
import Btn from "../../components/Btn";
import {useTranslation} from "react-i18next";
import {useToggle} from "../../lib/hooks/useToggle";
import {AppContext} from "../../lib/AppContext";
import ModalNewKey from "../../components/ModalNewKey";
import {useClipboard} from "../../lib/hooks/useClipboard";

export interface Props {
  className?: string
}

function Index(props: Props) {
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
        <div className="title font-sans-semibold">
          <span className="cru-fo cru-fo-key"/>
          {t('File Encryption')}
        </div>
        {uc.secret && <div className="key font-sans-regular">{`${t('Your File Encryption Key:')} ${uc.secret}`}</div>}
        {uc.seeds && <div className="seeds font-sans-regular">{`${t('Seed Phrase:')} ${uc.seeds}`}</div>}
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

export default React.memo<Props>(styled(Index)`
  padding: unset !important;


  .crypto {
    margin: 2.21rem 2.29rem !important;
    padding: 1.71rem !important;
    box-shadow: 0 0.71rem 1.71rem 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 1.14rem !important;
    border: 0.07rem solid #EEEEEE !important;

    .title {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--main-color);
      padding-bottom: 1.14rem;
      .cru-fo {
        margin-right: 0.8rem;
      }
    }

    .key, .seeds {
      font-size: 1rem;
      color: var(--secend-color);
      line-height: 1.57rem;
    }

    .btns {
      margin-top: 1.7rem;

      button:first-child {
        margin-right: 1rem;
      }
    }
  }

`)
