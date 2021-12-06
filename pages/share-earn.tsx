import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";
import Btn from "../components/Btn";
import { MAccordion } from '../components/MAccordion';
import { MCard } from '../components/MCard';
import SideLayout from "../components/SideLayout";
import User from "../components/User";
import { useUserCrypto } from "../lib/crypto/useUserCrypto";
import { useFiles } from "../lib/wallet/hooks";

export interface Props {
  className?: string
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

function Index(props: Props) {
  const { className } = props
  const { t } = useTranslation()
  const uc = useUserCrypto()
  const wFiles = useFiles();

  const _clickClaimRewards = useCallback(() => {

  }, [wFiles, uc]);

  return <SideLayout path={'/share-earn'}>
    <Segment basic className={className}>
      <User />
      <Segment basic className="mcontent">
        <div className="share-and-earn">
          <img src="/images/share_earn2.png" />
          <div className="text">
            Share files to your friends and invite them to use <span>Crust Files</span>.
            Enjoy and Earn <span>$CRU</span> !!!
          </div>
        </div>
        <MCard>
          <MAccordion
            title="How to Share-and-Earn?"
          />
        </MCard>
        <MCard>
          <MAccordion
            title="Learn about more detailed rules"
          />
        </MCard>
        <MCard>
          <MAccordion
            title="Get Crust Wallet and CRU"
          />
        </MCard>
        <MCard>
          <div className="title font-sans-semibold">
            {t('My REwards')}
          </div>
          <div className="text font-sans-regular">
            Total Rewards : <span className="b-text">{"3.2CRU"}</span>
            Valid Invition : <span className="b-text">{0}</span>
          </div>
          <div className={'btns mbtns'}>
            <Btn content={t('Claim Rewards')} onClick={_clickClaimRewards} />
          </div>
        </MCard>
      </Segment>
    </Segment>
  </SideLayout>
}

export default React.memo<Props>(styled(Index)`
  padding: unset !important;
  .mcontent {
    margin: unset !important;
    padding: 0 0 3rem 0 !important;
    overflow: auto;
    .share-and-earn {
      margin: 2.21rem 2.29rem 0 2.39rem;
      border: 2px solid #000000;
      border-radius: 16px;
      display: flex;
      align-items: center;
      padding: 1.428571rem 3.571429rem;
      img {
        width: 16.214286rem;
        height: auto;
        margin-right: 2.142857rem;
      }
      .text {
        font-size: 2.571429rem;
        line-height: 3.5rem;
        font-weight: 600;
        span {
          color: var(--primary-color);
        }
      }
    }
    .mcard{
      .ui.accordion {
        .title {
          padding: unset !important;
        }
      }
      .b-text{
        color: var(--primary-color);
        font-size: 18px;
        font-weight: 600;
        margin-right: 4.285714rem;
      }
      .mbtns {
        button {
          min-width: 16.428571rem;
        }
      }
    }
  }

`)
