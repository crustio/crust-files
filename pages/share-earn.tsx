import { BlockNumber } from "@polkadot/types/interfaces/types";
import { BN } from '@polkadot/util';
import classNames from "classnames";
import _ from 'lodash';
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Popup } from "semantic-ui-react";
import styled, { keyframes } from "styled-components";
import { PixelBoard, PixelBtn, PixelBtn1 } from "../components/effect/Pixels";
import { Coin } from "../components/icons";
import PageUserSideLayout from "../components/PageUserSideLayout";
import { ColorSpan } from "../components/texts/spans";
import { useApp } from "../lib/AppContext";
import { useCall } from "../lib/hooks/useCall";
import { useClaimRewards } from "../lib/hooks/useClaimRewards";
import { useCountdown } from "../lib/hooks/useCountdown";
import { useGet } from "../lib/hooks/useGet";
import { useGetDepost } from "../lib/hooks/useGetDeposit";
import { useToggle } from "../lib/hooks/useToggle";
import { applyGrandDraw, getEarnRewards, getGrandApplyState, getGrandDraw, getLuckyNebie, getNetworkState, getShareEarnConfig } from "../lib/http/share_earn";
import { useAutoUpdateToStore } from "../lib/initAppStore";
import { cutEnd, formatCRU, getErrorMsg, getFormatValue, isSameCrustAddress, locationUrl, shortStr } from "../lib/utils";
export interface Props {
  className?: string
}

function getStrValue(obj: any, key: string) {
  return _.get(obj, key, '-')
}

const EarnItemTip = styled.div`
  width: 9.21rem;
  height: 7.71rem;
  background-image: url("/images/earn_bg.png");
  background-size: cover;
  text-align: center;
  padding-top: 1.93rem;
  padding-bottom: 2.21rem;
  line-height: 1.71rem;
  font-size: 1.86rem;
  position: absolute;
  top: -2.93rem;
  right: .86rem;
  color: var(--primary-color);
`

const InviteBonusTitle = styled.div`
  color: #000000;
  font-size: 2.29rem;
  line-height: 3.14rem;
  align-self: center;
  span {
    color: var(--primary-color);
  }
`
const MLink = styled.a`
  white-space: nowrap;
  display: inline-block;
  font-size: 1rem;
  line-height: 1.36rem;
  color: var(--main-color);
  text-decoration: underline;
`

const DetailedRules = styled(MLink)`
  position: absolute;
  right: 2rem;
  bottom: 2rem;
`

const You = styled.div`
  position: absolute;
  width: 5.14rem;
  height: 7.07rem;
  background-repeat: no-repeat;
  background-image: url("/images/img_women.png");
  background-size: cover;
  bottom: 12px;
  left: 28.57rem;
  &::after{
    content: 'You';
    position: absolute;
    top: -1.36rem;
    left: 1.71rem;
  }
`

const YourFriend = styled.div`
  position: absolute;
  width: 5.14rem;
  height: 6.43rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("/images/img_man.png");
  bottom: 12px;
  right: 11rem;
  &::after{
    content: 'Your Friend';
    position: absolute;
    white-space: nowrap;
    top: -1.36rem;
    left: 0;
  }
`

const YouComment = styled.div`
  background-repeat: no-repeat;
  background-image: url("/images/comment/comment_1_l.png"),  url('/images/comment/comment_1_c.png'), url('/images/comment/comment_1_r.png');
  background-size: 4.71rem 100%, calc(100% - 6.14rem + .29rem)  100%, 1.43rem 100%;
  background-position: 0 0, 4.57rem 0, right 0;
  position: absolute;
  bottom: 2.29rem;
  left: 33.71rem;
  width: min-content;
  height: 6.29rem;
  padding-left: .57rem;
  padding-right: .57rem;
  font-size: 1.29rem;
  line-height: 1.79rem;
  text-align: center;
  padding-top: 1rem;
  color: black;
  white-space: nowrap;
  span {
    color: var(--primary-color)
  }
`

const YourFriendComment = styled.div`
  background-repeat: no-repeat;
  background-image: url("/images/comment/comment_2_l.png"),  url('/images/comment/comment_2_c.png'), url('/images/comment/comment_2_r.png');
  background-size: 1.64rem 100%, calc(100% - 6.36rem + .29rem)  100%, 4.71rem 100%;
  background-position: 0 0, 1.5rem 0, right 0;
  position: absolute;
  bottom: 6.21rem;
  right: 15.14rem;
  width: min-content;
  height: 7.07rem;
  font-size: 1.29rem;
  line-height: 1.79rem;
  text-align: center;
  padding-top: .5rem;
  padding-left: .57rem;
  padding-right: .57rem;
  white-space: nowrap;
  color: black;
  span {
    color: var(--primary-color)
  }
`

const CoinCru = styled.div`
  color: var(--primary-color);
  font-size: 2.29rem;
  display: flex;
  align-items: center;
  margin-bottom: .57rem;
  img {
    margin-right: .71rem;
  }
`

const Trophy = styled.img.attrs({ src: '/images/trophy.svg' })`
  width: 9.86rem;
  height: 9.21rem;
`

const TimeBlocks = styled.div`
  font-size: 1.29rem;
  line-height: 1.71rem;
  text-align: center;
  white-space: nowrap;
  margin-top: .29rem;
  span {
    color: #2A66FE;
  }
`

const pixelProgressAttrs = (p: { progress: number, board_size: number }) => ({
  progress: p.progress || 0,
  board_size: 2
})
const PixelProgress = styled(PixelBoard).attrs(pixelProgressAttrs)`
  height: 14px;
  width: 104px;
  margin-right: .57rem;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    background-color: #2A66FE;
    height: 10px;
    width: ${(p) => p.progress}px;
    transition: all ease-in-out 300ms;
  }
`

const GrandDrawProgress = styled.div`
  display: flex;
  align-items: center;
  margin-top: .71rem;
  font-size: 1rem;
  line-height: 1.36rem;
  span {
    color: #2A66FE;
  }
`

const GrandDrawText = styled.div`
  font-size: 1.29rem;
  line-height: 1.79rem;
  margin-top: .29rem;
  color: black;
`

const M_PixelBtn = styled(PixelBtn).attrs({ height: 40 })`
  margin-top: 1.43rem;
  .btn_content {
    white-space: nowrap;
    padding: unset;
    min-width: 12.71rem;
    width: 12.71rem;
    font-size: 1.29rem;
  }
`

const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 4rem;
  flex: 1;
  color: black;
  justify-content: center;

  .title {
    font-size: 2.29rem;
    line-height: 3.14rem;
  }
  .sub {
    margin-top: .57rem;
    font-size: 1.71rem;
    line-height: 2.36rem;
  }
  span {
    color: var(--primary-color);
  }
`
const ClaimRewards = styled.div`
  font-size: 1.29rem;
  line-height: 1.79rem;
  display: flex;
  height: 100%;
  padding-top: 1.43rem;
  margin-right: 4rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const marquee = keyframes`
    to {
      transform: translateX(-48.93rem);
    }
`
const Marquee = styled.div`
  white-space: nowrap;
  animation: ${marquee} 8s linear infinite;
  span {
    margin-left: 3.57rem;
    color: var(--primary-color);
  }
`

const RewardPrograms = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  position: relative;
  height: 6.79rem;
  .like {
    position: absolute;
    left: 0;
    top: .07rem;
    width: auto;
    height: 100%;
    z-index: 2;
  }
  .programs {
    position: absolute;
    overflow: hidden;
    z-index: 1;
    right: 0;
    bottom: 0;
    width: calc(100% - 6.43rem);
    font-size: 2.29rem;
    /* line-height: 4.29rem; */
    height: 4.29rem;
    border: .29rem dashed #000000;
    padding-top: 1.14rem;
    /* padding: .57rem 1.43rem; */
    white-space: nowrap;
  }
`

function Index(props: Props) {
  const { className } = props
  const { api, alert, loading, recaptcha } = useApp()
  const r = useRouter()
  const [isMe, setIsMe] = useToggle(true)
  const { isPremiumUser, isCrust, depositDto, user } = useGetDepost()
  const { account, sign } = user
  const uClaimRewards = useClaimRewards()
  const [config] = useGet(() => getShareEarnConfig())
  const [mRewards, doGetRewards] = useGet(() => getEarnRewards(account), [account, isCrust], 'getEarnRewards')
  const { rewards } = useAutoUpdateToStore({ key: 'rewards', value: mRewards })
  const [networkState] = useGet(() => getNetworkState(), [user.account])
  const [luckyNebie] = useGet(() => getLuckyNebie(), [user.account])
  const [granDraw, , loadingGrandDraw] = useGet(() => getGrandDraw(), [user.account])
  const isGrandDrawWiner = useMemo(() => {
    return !!(user.account && granDraw && granDraw.members && granDraw.members
      .find(item => isSameCrustAddress(item.address, user.account)))
  }, [granDraw, user.account])

  const bestNumFinlized = useCall<BlockNumber>(api?.derive?.chain?.bestNumberFinalized);
  const [bestNumberFinalized, setBNF] = useState(0)
  useEffect(() => {
    const n = bestNumFinlized && bestNumFinlized.toNumber()
    setBNF((last) => {
      if (!last) return n
      return last
    })
  }, [bestNumFinlized])

  useEffect(() => {
    let task
    if (uClaimRewards.finish) {
      let count = 3
      task = setInterval(() => {
        if (count <= 0) {
          clearInterval(task)
          task = null
          return
        }
        count -= 1
        doGetRewards()
      }, 5000)
    }
    return () => task && clearInterval(task)
  }, [uClaimRewards.finish])

  const onGoingClaim = uClaimRewards.finish || (rewards && rewards.onGoing)

  const youGet = useMemo(() => formatCRU(config && config.shareAndEarnPerUserReward), [config])
  const youFriendGet = useMemo(() => {
    if (!config) return '-'
    return formatCRU(new BN(config.guaranteeAmount).sub(new BN(config.guaranteeDiscountWithReferer)))
  }, [config])

  const depositRewardAmount = useMemo(() => formatCRU(config && config.depositRewardAmount), [config])

  const countdown = useMemo(() => {
    if (!luckyNebie || !bestNumberFinalized) return 0
    return _.clamp(luckyNebie.lastBlockNumber + luckyNebie.blockCount - bestNumberFinalized, 0, luckyNebie.blockCount) * 6
  }, [luckyNebie, bestNumberFinalized])
  const fCountdown = useCountdown(countdown);
  const luckyDutation = useMemo(() => (luckyNebie?.blockCount || 300) / 10, [luckyNebie])

  const grandProgress = useMemo(() => {
    if (granDraw && granDraw.grandDraw) {
      return _.clamp(Math.round(granDraw.depositCount * 100 / granDraw.grandDraw.memberSize), 0, 100)
    }
    return 0
  }, [granDraw])

  const matchCount = granDraw?.grandDraw?.matchCount || 2
  const myTicket = useMemo(() => {
    if (depositDto && granDraw && depositDto.extrinsic_hash)
      return depositDto.extrinsic_hash.substring(depositDto.extrinsic_hash.length - granDraw.grandDraw.matchCount)
    return '--'
  }, [granDraw, depositDto])
  const exHash = useMemo(() => depositDto?.extrinsic_hash || '-', [depositDto])
  const cutExHash = useMemo(() => cutEnd(exHash, matchCount), [matchCount, exHash])

  const hash = getStrValue(granDraw, 'grandDraw.blockHash') as string
  const isMatched = useMemo(() => {
    if (hash && myTicket) return hash.endsWith(myTicket)
    return false
  }, [hash, myTicket])
  const [grandApplyState, doGetGrandApplyState, grandApplyLoading] = useGet(() => getGrandApplyState(account), [account, isCrust])
  const grandAppled = grandApplyState && grandApplyState.applyed
  const offTime = useMemo(() => {
    if (!granDraw || !bestNumberFinalized) {
      return 0
    }
    return (granDraw.grandDraw.expireBlock - bestNumberFinalized) * 6
  }, [granDraw, bestNumberFinalized])
  const grandExpireCountdown = useCountdown(offTime)
  const totalPending = getFormatValue(rewards, 'total.pending')
  const disabledClaimRewards = !uClaimRewards.ready || !isPremiumUser || onGoingClaim || !rewards || totalPending === '-' || totalPending === '0'
  // const disabledClaimRewards = !uClaimRewards.ready || onGoingClaim

  // 未开启
  const GrandStat0 = granDraw && granDraw.drawState === 0
  // 已开启（可参与或已参与）
  const GrandStat1 = granDraw && granDraw.drawState === 1
  // 已开奖
  const GrandStat2 = granDraw && (granDraw.drawState === 2 || granDraw.drawState === 3)
  const showGrandDraw = (GrandStat0 || GrandStat1 || GrandStat2) && !loadingGrandDraw && !grandApplyLoading
  const showSignUpGrandDraw = isPremiumUser && GrandStat1

  const _clickSignUpGrandDraw = async () => {
    if (!account || !isCrust || !isPremiumUser || grandAppled) return
    try {
      loading.show()
      const msg = account
      const signature = await sign(msg, account)
      const perSignData = `crust-${msg}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      const token = await recaptcha.getToken()
      if (!token) {
        loading.hide()
        return
      }
      await applyGrandDraw(token, base64Signature)
      doGetGrandApplyState()
      loading.hide()
    } catch (error) {
      loading.hide()
      alert.error(getErrorMsg(error))
    }
  }
  const _clickGetPremium = () => r.push('/user')
  const _clickClaimRewards = () => !disabledClaimRewards && uClaimRewards.start()

  return <PageUserSideLayout path="/share-earn" className={className}>
    <div className="share-and-earn">
      <div className="text">
        <span>Share</span> Crust Files with <br />
        your friends,<br />
        <span>Earn $50,000,000</span>
        <br />
        in User Rewards.
      </div>
      <PixelBoard className="top_card">
        <div className="btns">
          <PixelBtn1 className={classNames("style_left", { dark: !isMe })} onClick={() => setIsMe(true)}>Me</PixelBtn1>
          <PixelBtn1 className={classNames("style_right", { dark: isMe })} onClick={() => setIsMe(false)}>Network</PixelBtn1>
        </div>
        {
          isMe ? <>
            <div className="total">My Total Rewards:</div>
            <div className="total_reward"><span>{getFormatValue(rewards, 'total.total')}</span> CRU</div>
          </> : <div className="networks">
            <div>Total User: <span>{getFormatValue(networkState, 'totalUser')}</span></div>
            <div>Premium User: <span>{getFormatValue(networkState, 'premiumUser')}</span></div>
            <div>Deposit Pool: <span>{getFormatValue(networkState, 'depositPool')} CRU</span></div>
            <div>Rewards Distributed: <span>{getFormatValue(networkState, 'rewardsDistributed')} CRU</span></div>
            <div>Remaining Rewards: <span>{getFormatValue(networkState, 'remainingRewards')} CRU</span></div>
          </div>
        }
      </PixelBoard>
    </div>

    <RewardPrograms>
      <img className="like" src="/images/like.svg" />
      <div className="programs">
        <Marquee>
          <span>3</span> Reward Programs
          <span>3</span> Reward Programs
          <span>3</span> Reward Programs
          <span>3</span> Reward Programs
          <span>3</span> Reward Programs
          <span>3</span> Reward Programs
        </Marquee>
      </div>
    </RewardPrograms>

    <PixelBoard className="earn_item">
      <PixelBtn1 className="top_btn">Invite Bonus</PixelBtn1>
      <EarnItemTip>1,000,000<br />CRU</EarnItemTip>
      <div className="left">
        <InviteBonusTitle>
          Invite friends to Crust<br />
          Files and earn <span>CRU</span>.<br />
          <MLink target={'_blank'} href={locationUrl('/invite_bonus_guide')}>How to invite?</MLink>
        </InviteBonusTitle>
      </div>
      <You />
      <YouComment>Get <span>{youGet} CRU</span> Reward</YouComment>
      <YourFriend />
      <YourFriendComment>Get <span>{youFriendGet} CRU</span> Discount on<br />Premium User Deposit</YourFriendComment>
      <DetailedRules target={'_blank'} href={locationUrl('/docs/CrustFiles_ShareandEarn/#invite_bonus')}>Detailed Rules</DetailedRules>
    </PixelBoard>

    <PixelBoard className="earn_item">
      <PixelBtn1 className="top_btn">Lucky Newbie</PixelBtn1>
      <EarnItemTip>500,000<br />CRU</EarnItemTip>
      <div className="left">
        {/* <CoinCru><Coin /> {getFormatValue(luckyNebie, 'totalAmount')} CRU</CoinCru> */}
        <CoinCru><Coin /> 0 CRU</CoinCru>
        <Trophy />
        {/* <TimeBlocks><span>{fCountdown}</span> (<span>{getFormatValue(luckyNebie, 'blockCount')}</span> blocks)</TimeBlocks> */}
      </div>
      <div className="right">
        {/* <div className="title">Rules:</div> */}
        <div className="title" style={{marginBottom: 8}}>Congratulations!</div>
        {/* 1. The last Premium User to join before the countdown reaches zero<br />
        will be the winner of the current pool.<br />
        2. Each time a newly registered Premium User will refresh<br />
        the countdown to {luckyDutation}min and add {depositRewardAmount} CRU into the pool.<br /> */}
        The first Newbie Prize of 15,000 CRU has been claimed by <a target={'_blank'} href={`${locationUrl('/rewards_history/')}?account=${user.account}`} rel="noreferrer">this lucky user</a>.<br/>
        More exciting User Rewards Programs are coming soon...

        <div className="footer">
          {/* Best chance: <span>{shortStr(getStrValue(luckyNebie, 'memberAddress'), 12)}</span> */}
        </div>
      </div>
      <DetailedRules target={'_blank'} href={locationUrl('/docs/CrustFiles_ShareandEarn/#lucky_newbie')}>Detailed Rules</DetailedRules>
    </PixelBoard>

    {
      showGrandDraw && <PixelBoard className="earn_item">
        <PixelBtn1 className="top_btn">Grand Draw</PixelBtn1>
        <EarnItemTip>500,000<br />CRU</EarnItemTip>
        <div className="left">
          <CoinCru><Coin /> {getFormatValue(granDraw, 'grandDraw.totalAmount')} CRU</CoinCru>
          <Trophy />
          {
            GrandStat0 && <GrandDrawProgress>
              <PixelProgress progress={grandProgress} /> <span>{_.clamp(getStrValue(granDraw, 'depositCount'), 0, getStrValue(granDraw, 'grandDraw.memberSize'))}</span>/{getStrValue(granDraw, 'grandDraw.memberSize')}
            </GrandDrawProgress>}
          {GrandStat1 && <GrandDrawText>Sign Up Time!</GrandDrawText>}
          {GrandStat2 && <GrandDrawText>Draw Time!</GrandDrawText>}
        </div>
        <div className="right">
          <div className="title">
            My Ticket Number: {
              isPremiumUser ?
                <>
                  <span>{myTicket}</span>
                  <Popup
                    position="top center"
                    style={{ minWidth: 150, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                    content={<>
                      This is the last <ColorSpan color="--primary-color3">{matchCount}</ColorSpan> digits of your deposit transaction hash - {cutExHash}
                      <ColorSpan color="--primary-color3">{myTicket}</ColorSpan>
                    </>}
                    trigger={<span style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.5)', fontSize: '1.71rem', marginLeft: 12 }} className="cru-fo-help-circle" />}
                  />
                </>
                :
                <span style={{ color: '#333333', fontSize: 20, verticalAlign: 'middle' }}>
                  - Get <span style={{ color: '#FF8D00', cursor: 'pointer' }} onClick={_clickGetPremium}>Premium User</span> to join the game.
                </span>
            }
          </div>
          {
            GrandStat0 && <div style={{ marginTop: 8 }}>
              The game will unlock when Premium User reaches <span>{getFormatValue(granDraw, 'grandDraw.memberSize')}</span> !<br />
              Please sign up for the draw when unlock. Keep an eye!
            </div>}
          {
            GrandStat1 && <div>
              Sign up for the draw before Block <span>#{getFormatValue(granDraw, 'grandDraw.expireBlock')}</span><br />
              Estimated time: <span>{grandExpireCountdown}</span> from now
              {showSignUpGrandDraw && <M_PixelBtn disabled={grandAppled} content={grandAppled ? "Sign Up Completed" : "Sign Up"} onClick={_clickSignUpGrandDraw} />}
            </div>}
          {
            GrandStat2 && <div>
              Block Hash of #{getFormatValue(granDraw, 'grandDraw.expireBlock')}: <span>{hash}</span><br />
              Winning Condition: <span>The last {getStrValue(granDraw, 'grandDraw.matchCount')} digits match</span><br />
              My Status: <span>{isGrandDrawWiner ? 'You are the Winner!' : !isMatched ? 'Not Matched' : 'Not Signed Up'}</span>
            </div>}
        </div>
        <DetailedRules target={'_blank'} href={locationUrl('/docs/CrustFiles_ShareandEarn/#grand_draw')}>Detailed Rules</DetailedRules>
      </PixelBoard>}

    <PixelBoard className="earn_item">
      <Rewards>
        <div className="title">My Rewards:</div>
        <div className="sub">
          Total Rewards: <span>{getFormatValue(rewards, 'total.total')}</span> CRU (<span>{getFormatValue(rewards, 'total.claimed')}</span> CRU Claimed)<br />
          Invite Bonus: <span>{getFormatValue(rewards, 'reward.total')}</span> CRU (<span>{getFormatValue(rewards, 'reward.claimed')}</span> CRU Claimed)<br />
          Lucky Newbie: <span>{getFormatValue(rewards, 'depositReward.total')}</span> CRU (<span>{getFormatValue(rewards, 'depositReward.claimed')}</span> CRU Claimed)<br />
          Grand Draw: <span>{getFormatValue(rewards, 'grandDraw.total')}</span> CRU (<span>{getFormatValue(rewards, 'grandDraw.claimed')}</span> CRU  Claimed)
        </div>
        {isCrust && <MLink style={{ marginTop: '1rem' }} target={'_blank'} href={`${locationUrl('/rewards_history/')}?account=${user.account}`}>Check more detailed information & historical records about rewards</MLink>}
      </Rewards>
      <ClaimRewards>
        <M_PixelBtn disabled={disabledClaimRewards} content={onGoingClaim ? 'Ongoing Claim...' : 'Claim Rewards'} onClick={_clickClaimRewards} />
        {
          isPremiumUser ? <div style={{ marginTop: 8 }}>
            {onGoingClaim ? `You have ${getFormatValue(rewards, 'total.ongoing')} CRU ongoing claim... Please wait` : `You have ${totalPending} CRU pending claim rewards.`}
          </div> :
            <div style={{ marginTop: 8 }}>
              <ColorSpan className="btn" onClick={() => r.push('/user')}>Get Premium</ColorSpan> User to claim your rewards.
            </div>
        }

      </ClaimRewards>
      <DetailedRules target={'_blank'} href={locationUrl('/docs/CrustFiles_ShareandEarn/#claim_rewards')}>Learn More</DetailedRules>
    </PixelBoard>
  </PageUserSideLayout>
}

export default React.memo<Props>(styled(Index)`
    .share-and-earn {
      margin-bottom: 2.29rem;
      border-radius: 1.14rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        font-size: 3.43rem;
        line-height: 4.64rem;
        font-weight: 600;
        margin-right: 4.29rem;
        span {
          color: var(--primary-color);
        }
      }
      .top_card {
        height: 17.14rem;
        min-width: 40.86rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: black;
        .btns {
          z-index: 2;
          position: relative;
          top: -12px;
          width: 34rem;
          display: flex;
          div{
            width: 50%;
          }
        }
        .total {
          font-weight: 600;
          font-size: 1.29rem;
          line-height: 1.79rem;
        }
        .total_reward {
          span{
            color: #216CFF;
          }
          font-weight: 600;
          font-size: 5.71rem;
          line-height: 5.71rem;
        }
        .networks {
          width: 28.57rem;
          font-size: 1.29rem;
          line-height: 2rem;
          font-weight: 600;
          text-align: left;
          span {
            float: right;
            color: #216CFF;
          }
        }
      }
    }

    .earn_item {
      margin-top: 5.21rem;
      width: 100%;
      height: calc(100px + 11.93rem);
      display: flex;
      position: relative;
      .top_btn {
        cursor: default;
        position: absolute;
        top: 0;
        left: calc(50% - 178px);
      }

      .left {
        width: 27.64rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
      }
      .right {
        color: black;
        font-size: 1.29rem;
        line-height: 1.79rem;
        padding-top: 3.57rem;
        .title {
          font-size: 2.29rem;
          line-height: 3.14rem;
        }
        .footer {
          margin-top: .71rem;
        }
        span {
          color: #216CFF;
        }
      }
    }

    @media screen and (max-width: 1440px){
    .share-and-earn{
      .text{
        font-size: 2.74rem;
      }
    }
  }
`)
