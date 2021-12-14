import { format } from 'date-fns';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from "react";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";
import Btn from "../components/Btn";
import { MCard } from "../components/MCard";
import SideLayout from "../components/SideLayout";
import User from "../components/User";
import { CrustWalletDownUrl } from '../lib/config';
import { useClaim, useDeposit } from "../lib/hooks/useDeposit";
import { useGet } from "../lib/hooks/useGet";
import { useGetDepost } from '../lib/hooks/useGetDeposit';
import { getAccountByNickName, getDepositAddress, getShareEarnConfig } from "../lib/http/share_earn";
import { formatCRU, trimZero } from '../lib/utils';
import { useContextWrapLoginUser } from "../lib/wallet/hooks";
export interface Props {
  className?: string
}

function Index(props: Props) {
  const { className } = props
  const user = useContextWrapLoginUser()
  const { isCrust, isPremiumUser, deposit, doGetDeposit, hasDeposit } = useGetDepost()
  const [nickError, setNickError] = useState<string>()
  const [shareFrom, setShareFrom] = useState<string>()
  const _onChangeNickname = useMemo(() => {
    return _.debounce((e) => {
      const nickName = e.target.value;
      setNickError('')
      setShareFrom('')
      if (nickName) {
        getAccountByNickName(nickName)
          .then((account) => {
            if (account !== user.account)
              setShareFrom(account)
            else
              setNickError(`It can't be your own`)
          })
          .catch(() => setNickError('Not found'))
      }
    }, 300)
  }, [user.account])

  //
  const [value, setValue] = useState<string>()
  const [config] = useGet(() => getShareEarnConfig())
  const showDeposit = isCrust && !hasDeposit
  const showClaim = isCrust && hasDeposit
  const [dest] = useGet(() => getDepositAddress())
  const fValue = useMemo(() => formatCRU(value), [value])
  const fCalimValue = useMemo(() => {
    if (!hasDeposit) return '-'
    const s = new Date().getTime() / 1000
    // 提前赎回
    if (deposit.deposit.expire_timestamp > s) {
      return trimZero(deposit.deposit.claim_amount)
    }
    return trimZero(deposit.deposit.deposit_amount)
  }, [hasDeposit])
  const guaranteeAmount = useMemo(() => formatCRU(config?.guaranteeAmount || ''), [config])
  const guaranteeDiscountWithReferer = useMemo(() => formatCRU(config?.guaranteeDiscountWithReferer || ''), [config])
  const months = useMemo(() => {
    if (!config || !showClaim) return 6
    const s = new Number(config.guaranteePeriod).valueOf()
    return Math.round(s / 60 / 60 / 24 / 30)
  }, [showClaim, config])
  const periodTime = useMemo(() => {
    if (!hasDeposit) return '--:--:--'
    return format(deposit.deposit.expire_timestamp * 1000, "yyyy-MM-dd")
  }, [hasDeposit])
  useEffect(() => {
    if (!config) return
    if (shareFrom) {
      setValue(config.guaranteeDiscountWithReferer)
    } else {
      setValue(config.guaranteeAmount)
    }
  }, [config, shareFrom])

  const uDeposit = useDeposit(dest, value, shareFrom)
  const uClaim = useClaim()
  useEffect(() => {
    let task
    if (uDeposit.finish || uClaim.finish) {
      let count = 3
      task = setInterval(() => {
        if (count <= 0) {
          clearInterval(task)
          return;
        }
        count -= 1;
        doGetDeposit()
      }, 5000)
    }
    return () => task && clearInterval(task)
  }, [uDeposit.finish, uClaim.finish])
  const onGoingDeposit = uDeposit.finish || (deposit && deposit.depositOngoing)
  const disabledDeposit = !uDeposit.ready || !value || onGoingDeposit
  const onGoingClaim = uClaim.finish || (deposit && deposit.claimOngoing)
  const disabledClaim = !uClaim.ready || onGoingClaim
  const _onClickDownCrustWallet = () => window.open(CrustWalletDownUrl, '_blank')
  const _onClickDeposit = () => { uDeposit.start() }
  const _onClickClaim = () => { uClaim.start() }

  return <SideLayout path={'/user'}>
    <Segment basic className={className}>
      <User />
      <Segment basic className="mcontent">
        <div className="user-Info">
          <div className="title">{isPremiumUser ? 'You are Premium User' : 'You are Trial User'}</div>
          <div className="sub-text">Web3 Identity Logged-in：<span>{user.account}</span></div>
        </div>
        <div className="user-premium-panel">
          <div className="title">{'Why Premium?'}</div>
          <div className="permium-trial">
            <div className="mtable premium">
              <div className="t-title">Premium User</div>
              <div className="t-item">End-2-end File Encryption<img className="icon" src="/images/icon_hook.png" /></div>
              <div className="t-item">Maximum Upload Size=<span>1GB</span></div>
              <div className="t-item">
                <span>Renew</span> On-chain Storage Order<span className="space" />
                Place <span>“Permanent Storage Order”</span>
              </div>
              <div className="t-item">More Space</div>
              <div className="t-item"><span>Claim Rewards</span> from “Share-and-Earn”</div>
            </div>
            <div className="mtable trial">
              <div className="t-title">Trial User</div>
              <div className="t-item">End-2-end File Encryption<img className="icon" src="/images/icon_fork.png" /></div>
              <div className="t-item">Maximum Upload Size=<span>40MB</span></div>
              <div className="t-item">Storage Order Expires in <span>6 Months</span></div>
              <div className="t-item"><span>Limited</span> Space</div>
              <div className="t-item"><span>Cannot</span> Claim Rewards from “Share-and-Earn”</div>
            </div>
          </div>
        </div>
        {
          !isCrust && <MCard>
            <div className="title font-sans-semibold">How to get a Premium</div>
            <div className="text font-sans-regular">Log in with Crust Wallet and Deposit CRU to get a Premium. </div>
            <div className={'btns mbtns'}>
              <Btn content="Download Crust Wallet" onClick={_onClickDownCrustWallet} />
            </div>
          </MCard>}
        {
          showDeposit && <MCard>
            <div className="title font-sans-semibold">Get a Premium</div>
            <div className="text font-sans-regular">A Premium user plan asks for {guaranteeAmount} CRU deposit. If you have an invitation code, which is the Metaverse Citizen ID of your inviter, the deposit is {guaranteeDiscountWithReferer} CRU.</div>

            <div className={'btns mbtns'}>
              <input
                className="input-Nickname"
                placeholder="Enter Invitoe’s Nickname（Leave blank if you have no invitor.）"
                onChange={_onChangeNickname} />
              <span className="input-NickError">{nickError}</span>
              <br />
              <Btn content={onGoingDeposit ? 'Please wait for transaction finalization…' : `Deposit ${fValue} CRU`} disabled={disabledDeposit} onClick={_onClickDeposit} />
              <a href="/docs/CrustFiles_Users" target="_blank">How to deposit?</a>
            </div>
          </MCard>}
        {
          showClaim && <MCard>
            <div className="title font-sans-semibold">Redeem Your Deposit</div>
            <div className="text font-sans-regular">
              You can redeem back your full deposit after {months} months from your deposit date or half of the deposit in no more than {months} months from your deposit date.<br />
              Full Redeem on <span className="font-sans-semibold" style={{ color: '#333333' }}>{periodTime}</span> ({months} months after your deposit)
            </div>
            <div className={'btns mbtns'}>
              <Btn content={onGoingClaim ? 'Ongoing Redeem...' : `Redeem ${fCalimValue} CRU`} disabled={disabledClaim} onClick={_onClickClaim} />
              <a href="/docs/CrustFiles_Users" target="_blank">Learn more about Redeem Rules.</a>
            </div>
            {onGoingClaim && <div className="tip">Redeem will be done in less than 24 hours. Check your balance later.</div>}
          </MCard>}
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
  }
  .mcard{
    a {
      font-size: 10px;
      text-decoration: underline;
      color: #999999;
      margin-left: 9px;
    }
    .mbtns {
      button {
        min-width: 27rem;
      }
    }
    .tip {
      margin-top: 1rem;
      line-height: 20px;
      color: #999999;
    }
  }

  .user-Info {
    margin: 2.21rem 2.29rem 0 2.39rem !important;
    .title {
      margin-bottom: 8px;
      font-size: 24px;
      font-family: OpenSans-SemiBold;
      line-height: 33px;
    }
    .sub-text {
      font-size: 14px;
      line-height: 22px;
      color: var(--secend-color);
      span {
        color: var(--main-color);
        font-family: OpenSans-SemiBold;
      }
    }
  }

  .user-premium-panel {
    margin: 2.21rem 2.29rem 0 2.39rem !important;
    .title {
      margin-bottom: 16px;
      font-size: 24px;
      font-family: OpenSans-SemiBold;
      line-height: 33px;
    }
    .permium-trial {
      display: flex;
      .mtable {
        flex: 1;
        border-radius: 16px;
        overflow: hidden;
        .t-title,.t-item {
            padding: 0 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .t-title {
          line-height: 54px;
          height: 54px;
          text-align: center;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }
        .t-item {
          font-weight: 500;
          font-size: 16px;
          line-height: 50px;
          height: 50px;
          color: var(--main-color);
          span {
            color: var(--primary-color);
          }
        }
        .icon {
          height: 50px;
          width: auto;
          vertical-align: top;
          margin-left: 16px;
          display: inline-block;
          object-fit: none;
        }
        .space {
          margin-left: 24px;
        }
      }
      .premium {
        background: #FFEEDA;
        margin-right: 32px;
        .t-item:nth-child(2n + 1){
          background-color: rgba(255,255,255,0.45);
        }
        .t-title {
          background-color: var(--primary-color);
        }
      }
      .trial {
        background: #eeeeee;
        /* margin-right: 32px; */
        .t-item:nth-child(2n + 1){
          background-color: rgba(255,255,255,0.45);
        }
        .t-title {
          background-color: black;
        }
      }
    }
  }

  .input-Nickname {
    display: inline-block;
    min-width: 27rem;
    margin-bottom: 12px;
    height: 38px;
    line-height: 38px;
    border: 1px solid #999999;
    font-family: OpenSans-Regular;
    outline: unset;
    border-radius: 8px;
    padding-left: 16px;
    font-size: 10px;
    &::placeholder{
      color: #999999;
    }
  }
  .input-NickError {
    font-size: 10px;
    color: #F37565;
    margin-left: 12px;
  }
`)
