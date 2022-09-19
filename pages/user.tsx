import classNames from 'classnames';
import { format } from 'date-fns';
import { toBlob } from 'html-to-image';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { BindAirdrop } from '../components/BindAirdrop';
import Btn from "../components/Btn";
import { Badge } from '../components/effect/Badge';
import { BadgeIcon1, BadgeIcon2 } from '../components/icons';
import { ColFlex } from '../components/layout';
import { MCard } from "../components/MCard";
import PageUserSideLayout from '../components/PageUserSideLayout';
import { useApp } from '../lib/AppContext';
import { CrustWalletDownUrl } from '../lib/config';
import { useClaim, useDeposit } from "../lib/hooks/useDeposit";
import { useGet } from "../lib/hooks/useGet";
import { useGetDepost } from '../lib/hooks/useGetDeposit';
import { useSafeState } from '../lib/hooks/useSafeState';
import { getAccountByNickName, getDepositAddress, getNft, getShareEarnConfig, saveNft } from "../lib/http/share_earn";
import { BlobFile } from '../lib/types';
import { useAuthGateway, useAuthPinner } from '../lib/useAuth';
import { useUpload } from '../lib/useUpload';
import { formatCRU, trimZero } from '../lib/utils';

export interface Props {
  className?: string
}

function Index(props: Props) {
  const { className } = props
  const { alert, loading } = useApp()
  const { isCrust, isPremiumUser, deposit, doGetDeposit, hasDeposit, user, loading: isLoadingDeposit } = useGetDepost()
  const [nickStat, setNickStat] = useSafeState<{ error?: string, shareFrom?: string, checking: boolean }>({ checking: false })
  const [inputNickname, setInputNickname] = useState<string>()
  const _onChangeNickname = (e) => setInputNickname(e.target.value)
  const doChangeNickname = useMemo(() => {
    return _.debounce((nickName: string) => {
      setNickStat({ checking: true })
      if (nickName) {
        getAccountByNickName(nickName)
          .then((account) => {
            if (account !== user.account) {
              setNickStat({ checking: false, shareFrom: account })
            } else {
              setNickStat({ checking: false, error: `It can't be your own` })
            }
          })
          .catch(() => setNickStat({ checking: false, error: 'Not found' }))
      } else {
        setNickStat({ checking: false })
      }
    }, 500)
  }, [user.account])
  useEffect(() => {
    setNickStat({ checking: true })
    doChangeNickname(inputNickname)
  }, [inputNickname])


  //
  const [value, setValue] = useState<string>()
  const [config] = useGet(() => getShareEarnConfig())
  const showBasePrice = config && config.showBase
  const showDeposit = isCrust && !hasDeposit && !isLoadingDeposit
  const showClaim = isCrust && hasDeposit
  const [dest] = useGet(() => getDepositAddress())
  const fValue = useMemo(() => formatCRU(value), [value])
  const cTime = useMemo(() => new Date().getTime() / 1000, [])
  const fCalimValue = useMemo(() => {
    if (!hasDeposit) return '-'
    // 提前赎回
    // if (deposit.deposit.expire_timestamp > cTime) {
    //   return trimZero(deposit.deposit.claim_amount)
    // }
    return trimZero(deposit.deposit.deposit_amount)
  }, [hasDeposit, cTime])
  const guaranteeAmount = useMemo(() => formatCRU(config?.guaranteeAmount || ''), [config])
  const guaranteeDiscountWithReferer = useMemo(() => formatCRU(config?.guaranteeDiscountWithReferer || ''), [config])
  const baseGuaranteeAmount = useMemo(() => formatCRU(config?.baseGuaranteeAmount || ''), [config])
  const baseGuaranteeDiscountWithReferer = useMemo(() => formatCRU(config?.baseGuaranteeDiscountWithReferer || ''), [config])
  const days = useMemo(() => {
    if (!config) return '-'
    const s = new Number(config.guaranteePeriod).valueOf()
    return Math.round(s / 60 / 60 / 24)
  }, [config])
  const periodTime = useMemo(() => {
    if (!hasDeposit) return '--:--:--'
    return format(deposit.deposit.expire_timestamp * 1000, "yyyy-MM-dd")
  }, [hasDeposit, deposit])
  useEffect(() => {
    if (!config) return
    if (nickStat.shareFrom) {
      setValue(config.guaranteeDiscountWithReferer)
    } else {
      setValue(config.guaranteeAmount)
    }
  }, [config, nickStat.shareFrom])

  const uDeposit = useDeposit(dest, value, nickStat.shareFrom)
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
  const disabledDeposit = !uDeposit.ready || !value || onGoingDeposit || nickStat.checking
  const onGoingClaim = uClaim.finish || (deposit && deposit.claimOngoing)
  const disabledClaim = !uClaim.ready || onGoingClaim || (hasDeposit && deposit.deposit.expire_timestamp >= cTime)
  const _onClickDownCrustWallet = () => window.open(CrustWalletDownUrl, '_blank')
  const _onClickDeposit = () => { !disabledDeposit && uDeposit.start() }
  const _onClickClaim = () => { !disabledClaim && uClaim.start() }

  const { endpoint } = useAuthGateway()
  const { pinner } = useAuthPinner()
  const { upload, error } = useUpload(user, {
    endpoint,
    pinner
  })
  useEffect(() => {
    if (error) alert.error(error)
  }, [error])
  const badgeRef = useRef<SVGSVGElement>();
  const diabledGetBadge = !isPremiumUser && !badgeRef.current;
  const [nft, doGetNft, loadNft] = useGet(() => getNft(user.account), [isCrust, isPremiumUser, user.account])
  const badgeCID = _.get(nft, '0.cid')
  const hasBadge = !!badgeCID;
  const badgeEnpoint = endpoint.value
  const badgeFileName = `badge_nft_${user.nickName}`
  const _onClickGetBadge = () => {
    if (diabledGetBadge) return;
    loading.show()
    toBlob(badgeRef.current as any)
      .then(blob => {
        const badgeFile = (blob as BlobFile)
        badgeFile.name = `badge_${user.nickName}.svg`
        return badgeFile
      })
      .then(file => upload({ file }))
      .then(([sf, params]) => {
        const perSignData = `crust-${params.msg}:${params.signature}`;
        const base64Signature = window.btoa(perSignData);
        console.info('nft:', sf)
        return saveNft(base64Signature, sf.Hash).then(() => doGetNft())
      })
      .catch(console.error)
      .then(loading.hide)
  }


  return <PageUserSideLayout path={'/user'} className={className}>
    <div className="user-Info">
      <div className="title">{isPremiumUser ? 'You are Premium User' : 'You are Trial User'}</div>
      <div className="sub-text">Web3 Identity Logged-in: <span>{user.account}</span></div>
    </div>
    <div className="user-premium-panel">
      <div className="title">{'Why Premium?'}</div>
      <div className="permium-trial">
        <div className="mtable premium">
          <div className="t-title">Premium User</div>
          {/* <div className="t-item">End-2-end File Encryption<img className="icon" src="/images/icon_hook.png" /></div> */}
          <div className="t-item"><span>Maximum Upload Size of</span><span className='primary'>1GB</span></div>
          <div className="t-item two">
            <span style={{ marginRight: 6 }}><span className='primary'>Renew</span> On-chain Storage Order &</span>
            <span>Place <span className='primary'>{`"Permanent Storage Order"`}</span></span>
          </div>
          <div className="t-item">More Space</div>
          <div className="t-item">
            <span className='primary'>Claim Rewards</span> <span>{`from "Share-and-Earn"`}</span>
          </div>
          <div className="t-item">
            <span>Priority access to</span><span className='primary'>future airdrops</span>
            <span>and other exclusive benefits</span>
          </div>
        </div>
        <div className="mtable trial">
          <div className="t-title">Trial User</div>
          {/* <div className="t-item">End-2-end File Encryption<img className="icon" src="/images/icon_fork.png" /></div> */}
          <div className="t-item"><span>Maximum Upload Size of </span><span className='primary'>40MB</span></div>
          <div className="t-item"><span>Storage Order Expires in</span><span className='primary'>6 Months</span></div>
          <div className="t-item"><span className='primary'>Limited</span> <span>Space</span></div>
          <div className="t-item"><span className='primary'>Cannot</span><span style={{ marginRight: 6 }}>Claim Rewards</span> <span>{`from "Share-and-Earn"`}</span></div>
          <div className="t-item"><span className='primary'>Limited</span> <span style={{ marginRight: 6 }}>access to future airdrops</span> <span>or other exclusive benefits</span></div>
        </div>
      </div>
    </div>
    {
      !isCrust && <MCard>
        <div className="title font-sans-semibold">How to get Premium</div>
        <div className="text font-sans-regular">Log in with Crust Wallet and Deposit CRU to get Premium. </div>
        <div className={'btns mbtns'}>
          <Btn content="Download Crust Wallet" onClick={_onClickDownCrustWallet} />
        </div>
      </MCard>}
    {
      showDeposit && <MCard>
        <div className="title font-sans-semibold">Get Premium</div>
        <div className="text font-sans-regular">
          {
            showBasePrice ? <>
              Deposit <span className={classNames('origin', 'isBase')}>{baseGuaranteeAmount} CRU</span><span className='reffer'>(now {guaranteeAmount} CRU for Discount!)</span> to become a Premium User. <br />
              Deposit <span className={classNames('origin', 'isBase')}>{baseGuaranteeDiscountWithReferer} CRU</span><span className='reffer'>(now {guaranteeDiscountWithReferer} CRU for Discount!)</span> if you have an invitation code (the Nickname of your inviter).<br />
            </> : <>
              Deposit <span className={classNames('origin')}>{guaranteeAmount} CRU</span> to become a Premium User. <br />
              Deposit <span className={classNames('origin')}>{guaranteeDiscountWithReferer} CRU</span> if you have an invitation code (the Nickname of your inviter).<br />
            </>
          }
          The deposit can be redeemed {days} days after your deposit date.
        </div>
        <div className={'btns mbtns'}>
          <input
            className="input-Nickname"
            spellCheck="false"
            placeholder="Enter inviter’s Nickname（Leave blank if you have no inviter.）"
            onChange={_onChangeNickname} />
          {nickStat.error && <span className="input-NickError">{nickStat.error}</span>}
          <br />
          <Btn content={onGoingDeposit ? 'Please wait for transaction finalization…' : `Deposit ${fValue} CRU`} disabled={disabledDeposit} onClick={_onClickDeposit} />
          <a href="/docs/CrustFiles_Users" target="_blank">How to deposit?</a>
        </div>
      </MCard>}
    {
      showClaim && <MCard>
        <div className="title font-sans-semibold">Redeem Your Deposit</div>
        <div className="text font-sans-regular">
          You can redeem your deposit after {days} days (est. on <span className="font-sans-semibold" style={{ color: '#333333' }}>{periodTime}</span>) after your initial deposit.
        </div>
        <div className={'btns mbtns'}>
          <Btn content={onGoingClaim ? 'Ongoing Redeem...' : `Redeem ${fCalimValue} CRU`} disabled={disabledClaim} onClick={_onClickClaim} />
          <a href="/docs/CrustFiles_Users" target="_blank">Learn more about Redeem Rules.</a>
        </div>
        {onGoingClaim && <div className="tip">Redeem funds will be processed every Wednesday.</div>}
      </MCard>}
    {
      isPremiumUser && !loadNft && <MCard>
        {/* <Badge name={user.nickName}/> */}
        <div className="title font-sans-semibold">My Badge Collection</div>
        <div className="text font-sans-regular">
          Collect your Achievement Badge here.
        </div>
        {
          hasBadge ? <div style={{ marginTop: 20, display: 'flex', height: 100 }}>
            <BadgeIcon2 />
            <ColFlex style={{ marginLeft: 18, flex: 1, justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, lineHeight: '22px', color: '#000000' }}>My Badge #1</span>
              <div className='text font-sans-regular'>
                Badge Type: Premium User Badge<br />
                Badge CID: {badgeCID}
              </div>
              <div>
                <a className='mlink-btn' target='_blank' href={`${badgeEnpoint}/ipfs/${badgeCID}?filename=${badgeFileName}`} rel="noreferrer">View full image</a>
                <a className='mlink-btn' target='_blank' href={`https://ipfs-scan.io/?cid=${badgeCID}`} rel="noreferrer">Check in IPFS Scan</a>
              </div>
            </ColFlex>
          </div> : <>
            <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
              <Badge name={user.nickName} ref={badgeRef} />
            </div>
            <div style={{ paddingLeft: 70, marginTop: 20 }}>
              <BadgeIcon1 />
            </div>
            <div className={'btns mbtns'}>
              <Btn content={'Get Premium Badge'} disabled={diabledGetBadge} onClick={_onClickGetBadge} />
              {!isPremiumUser && <a>Become a Premium User to get this badge.</a>}
            </div>
          </>
        }

      </MCard>
    }
    <BindAirdrop />
  </PageUserSideLayout>
}

export default React.memo<Props>(styled(Index)`
  .mlink-btn{
    white-space: nowrap !important;
    margin-left: 0 !important;
    margin-right: 40px;
    color: var(--primary-color) !important;
    text-decoration: underline !important;
    font-size: 14px !important;
    line-height: 19px !important;
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
        min-width: 406px;
        height: 38px;
      }
    }
    .tip {
      margin-top: 1rem;
      line-height: 20px;
      color: #999999;
    }
    .text > .origin {
      font-family: 'OpenSans-SemiBold';
      color: var(--primary-color);
      &.isBase {
        color: var(--main-color);
        text-decoration: line-through;
      }
    }
    .text > .reffer {
      margin-left: 6px;
      color: var(--primary-color);
    }
  }

  .user-Info {
    /* margin: 2.21rem 2.29rem 0 2.39rem !important; */
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
    margin-top: 2.21rem;
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
          line-height: 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          align-content: center;
          height: 60px;
          color: var(--main-color);
          span.primary {
            color: var(--primary-color);
            margin-right: 6px;
            margin-left: 6px;
            &:first-child{
              margin-left: 0;
            }
            &:last-child{
              margin-right: 0;
            }
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
    min-width: 406px;
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
