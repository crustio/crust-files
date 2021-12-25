import { BlockNumber } from "@polkadot/types/interfaces/types";
import { BN } from '@polkadot/util';
import classNames from "classnames";
import _ from 'lodash';
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { PixelBoard, PixelBtn, PixelBtn1 } from "../components/effect/Pixels";
import { Coin } from "../components/icons";
import PageUserSideLayout from "../components/PageUserSideLayout";
import { useApp } from "../lib/AppContext";
import { useCall } from "../lib/hooks/useCall";
import { useClaimRewards } from "../lib/hooks/useClaimRewards";
import { useCountdown } from "../lib/hooks/useCountdown";
import { useGet } from "../lib/hooks/useGet";
import { useGetDepost } from "../lib/hooks/useGetDeposit";
import { useToggle } from "../lib/hooks/useToggle";
import { applyGrandDraw, getEarnRewards, getGrandApplyState, getGrandDraw, getLuckyNebie, getNetworkState, getShareEarnConfig } from "../lib/http/share_earn";
import mDayjs from "../lib/mDayjs";
import { formatCRU, getFormatValue } from "../lib/utils";
import { useContextWrapLoginUser } from "../lib/wallet/hooks";
export interface Props {
  className?: string
}

function getStrValue(obj: any, key: string) {
  return _.get(obj, key, '-')
}

const EarnItemTip = styled.div`
  width: 129px;
  height: 108px;
  background-image: url("/images/earn_bg.png");
  background-size: cover;
  text-align: center;
  padding-top: 27px;
  padding-bottom: 31px;
  line-height: 24px;
  font-size: 26px;
  position: absolute;
  top: -41px;
  right: 12px;
  color: var(--primary-color);
`

const InviteBonusTitle = styled.div`
  color: #000000;
  font-size: 32px;
  line-height: 44px;
  align-self: center;
  span {
    color: var(--primary-color);
  }
`

const DetailedRules = styled.a`
  position: absolute;
  right: 28px;
  bottom: 28px;
  white-space: nowrap;
  display: inline-block;
  font-size: 14px;
  line-height: 19px;
  color: var(--main-color);
  text-decoration: underline;
`

const You = styled.div`
  position: absolute;
  width: 72px;
  height: 99px;
  background-repeat: no-repeat;
  background-image: url("/images/img_women.png");
  background-size: cover;
  bottom: 12px;
  left: 400px;
  &::after{
    content: 'You';
    position: absolute;
    top: -19px;
    left: 24px;
  }
`

const YourFriend = styled.div`
  position: absolute;
  width: 72px;
  height: 90px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("/images/img_man.png");
  bottom: 12px;
  right: 154px;
  &::after{
    content: 'Your Friend';
    position: absolute;
    white-space: nowrap;
    top: -19px;
    left: 0;
  }
`

const YouComment = styled.div`
  background-repeat: no-repeat;
  background-image: url("/images/comment/comment_1_l.png"),  url('/images/comment/comment_1_c.png'), url('/images/comment/comment_1_r.png');
  background-size: 66px 100%, calc(100% - 86px + 4px)  100%, 20px 100%;
  background-position: 0 0, 64px 0, right 0;
  position: absolute;
  bottom: 32px;
  left: 472px;
  width: min-content;
  height: 88px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  padding-top: 14px;
  color: black;
  white-space: nowrap;
  span {
    color: var(--primary-color)
  }
`

const YourFriendComment = styled.div`
  background-repeat: no-repeat;
  background-image: url("/images/comment/comment_2_l.png"),  url('/images/comment/comment_2_c.png'), url('/images/comment/comment_2_r.png');
  background-size: 23px 100%, calc(100% - 89px + 4px)  100%, 66px 100%;
  background-position: 0 0, 21px 0, right 0;
  position: absolute;
  bottom: 87px;
  right: 212px;
  width: min-content;
  height: 99px;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  padding-top: 7px;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
  color: black;
  span {
    color: var(--primary-color)
  }
`

const CoinCru = styled.div`
  color: var(--primary-color);
  font-size: 32px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  img {
    margin-right: 10px;
  }
`

const Trophy = styled.img.attrs({ src: '/images/trophy.svg' })`
  width: 138px;
  height: 129px;
`

const TimeBlocks = styled.div`
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  white-space: nowrap;
  margin-top: 4px;
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
  margin-right: 8px;
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
  margin-top: 10px;
  font-size: 14px;
  line-height: 19px;
  span {
    color: #2A66FE;
  }
`

const GrandDrawText = styled.div`
  font-size: 18px;
  line-height: 25px;
  margin-top: 4px;
  color: black;
`

const M_PixelBtn = styled(PixelBtn).attrs({ height: 40 })`
  margin-top: 20px;
  .btn_content {
    white-space: nowrap;
    padding: unset;
    min-width: 150px;
    width: 150px;
    font-size: 18px;
  }
`

const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 56px;
  flex: 1;
  color: black;
  justify-content: center;

  .title {
    font-size: 32px;
    line-height: 44px;
  }
  .sub {
    margin-top: 8px;
    font-size: 24px;
    line-height: 33px;
  }
  span {
    color: var(--primary-color);
  }
`
const ClaimRewards = styled.div`
  font-size: 18px;
  line-height: 25px;
  display: flex;
  height: 100%;
  padding-top: 20px;
  margin-right: 56px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const marquee = keyframes`
    to {
      transform: translateX(-685px);
    }
`
const Marquee = styled.div`
  white-space: nowrap;
  animation: ${marquee} 8s linear infinite;
  span {
    margin-left: 50px;
    color: var(--primary-color);
  }
`

const RewardPrograms = styled.div`
  margin-top: 35px;
  width: 100%;
  position: relative;
  height: 95px;
  .like {
    position: absolute;
    left: 0;
    top: 1px;
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
    width: calc(100% - 90px);
    font-size: 32px;
    /* line-height: 60px; */
    height: 60px;
    border: 4px dashed #000000;
    padding-top: 16px;
    /* padding: 8px 20px; */
    white-space: nowrap;
  }
`

function Index(props: Props) {
  const { className } = props
  const { api, alert, loading } = useApp()
  const { account, sign } = useContextWrapLoginUser()
  const r = useRouter()
  const [isMe, setIsMe] = useToggle(true)
  const { isPremiumUser, isCrust, depositDto } = useGetDepost()
  const uClaimRewards = useClaimRewards()
  const [config] = useGet(() => getShareEarnConfig())
  const [rewards, doGetRewards] = useGet(() => getEarnRewards(account), [account, isCrust])
  const [networkState] = useGet(() => getNetworkState())
  const [luckyNebie] = useGet(() => getLuckyNebie())
  const [granDraw] = useGet(() => getGrandDraw())

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
    return (luckyNebie.lastBlockNumber + luckyNebie.blockCount - bestNumberFinalized) * 6
  }, [luckyNebie, bestNumberFinalized])
  const fCountdown = useCountdown(countdown);

  const grandProgress = useMemo(() => {
    if (granDraw && granDraw.grandDraw) {
      return _.clamp(Math.round(granDraw.depositCount * 100 / granDraw.grandDraw.memberSize), 0, 100)
    }
    return 0
  }, [granDraw])

  const myTicket = useMemo(() => {
    if (depositDto && granDraw && depositDto.extrinsic_hash)
      return depositDto.extrinsic_hash.substring(depositDto.extrinsic_hash.length - granDraw.grandDraw.matchCount)
    return '--'
  }, [granDraw, depositDto])
  // 未开启
  const GrandStat0 = granDraw && granDraw.drawState === 0
  // 已开启（可参与或已参与）
  const GrandStat1 = granDraw && granDraw.drawState === 1
  // 已开奖
  const GrandStat2 = granDraw && granDraw.drawState === 2
  const showGrandDraw = GrandStat0 || GrandStat1 || GrandStat2

  const [grandApplyState, doGetGrandApplyState] = useGet(() => getGrandApplyState(account), [account, isCrust, GrandStat1])
  const showSignUpGrandDraw = isPremiumUser && GrandStat1 && grandApplyState && !grandApplyState.applyed

  const grandExpireTime = useMemo(() => {
    if (!granDraw || !bestNumberFinalized) {
      return '0000-00-00 00:00 AM'
    }
    const offS = (granDraw.grandDraw.expireBlock - bestNumberFinalized) * 6
    return mDayjs().add(offS, 'second').format("YYYY-MM-DD hh:mm A")
  }, [granDraw, bestNumberFinalized])

  const totalPending = getFormatValue(rewards, 'total.pending')
  const disabledClaimRewards = !uClaimRewards.ready || onGoingClaim || !rewards || totalPending === '-'

  const _clickSignUpGrandDraw = async () => {
    if (!account || !isCrust || !isPremiumUser) return
    try {
      loading.show()
      const msg = account
      const signature = await sign(msg, account)
      const perSignData = `crust-${msg}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      await applyGrandDraw(base64Signature)
      doGetGrandApplyState()
      loading.hide()
    } catch (error) {
      loading.hide()
      const msg = typeof error === 'string' ? error : error.message || ''
      if (msg) alert.error(msg)
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
        <InviteBonusTitle>Invite friends to Crust<br />Files and earn <span>CRU</span>.</InviteBonusTitle>
      </div>
      <You />
      <YouComment>Get <span>{youGet} CRU</span> Reward</YouComment>
      <YourFriend />
      <YourFriendComment>Get <span>{youFriendGet} CRU</span> Discount on<br />Premium User Deposit</YourFriendComment>
      <DetailedRules target={'_blank'} href="https://">Detailed Rules</DetailedRules>
    </PixelBoard>

    <PixelBoard className="earn_item">
      <PixelBtn1 className="top_btn">Lucky Newbie</PixelBtn1>
      <EarnItemTip>500,000<br />CRU</EarnItemTip>
      <div className="left">
        <CoinCru><Coin /> {getFormatValue(luckyNebie, 'totalAmount')} CRU</CoinCru>
        <Trophy />
        <TimeBlocks><span>{fCountdown}</span> ( <span>{getFormatValue(luckyNebie, 'blockCount')}</span> blocks)</TimeBlocks>
      </div>
      <div className="right">
        <div className="title">Rules:</div>
        1. The last Premium User to join before the countdown reaches zero<br />
        will be the winner of the current pool.<br />
        2. Each time a newly registered Premium User will refresh<br />
        the countdown to 30min and add {depositRewardAmount} CRU into the pool.<br />
        <div className="footer">
          Best chance: <span>{getStrValue(luckyNebie, 'memberAddress')}</span>
        </div>
      </div>
      <DetailedRules target={'_blank'} href="https://">Detailed Rules</DetailedRules>
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
              <PixelProgress progress={grandProgress} /> <span>{getStrValue(granDraw, 'depositCount')}</span>/{getStrValue(granDraw, 'grandDraw.memberSize')}
            </GrandDrawProgress>}
          {GrandStat1 && <GrandDrawText>Sign Up Time!</GrandDrawText>}
          {GrandStat2 && <GrandDrawText>Draw Time!</GrandDrawText>}
        </div>
        <div className="right">
          <div className="title">
            My Ticket: {
              isPremiumUser ?
                <span>{myTicket}</span> :
                <span style={{ color: '#333333', fontSize: 20 }}>
                  - Get a <span style={{ color: '#FF8D00', cursor: 'pointer' }} onClick={_clickGetPremium}>Premium User</span> to join the game.
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
              Sign up before the draw time <span>{grandExpireTime} (est.)</span> at<br />
              <span>Block #{getFormatValue(granDraw, 'grandDraw.expireBlock')}</span>
              {showSignUpGrandDraw && <M_PixelBtn content={"Sign Up"} onClick={_clickSignUpGrandDraw} />}
            </div>}
          {
            GrandStat2 && <div>
              Block Hash of #{getFormatValue(granDraw, 'grandDraw.expireBlock')}: <span>{getStrValue(granDraw, 'grandDraw.blockHash')}</span><br />
              Winning Condition: <span>The last {getStrValue(granDraw, 'grandDraw.matchCount')} digits match</span><br />
              My Status: <span>Not Matched</span>
            </div>}
        </div>
        <DetailedRules target={'_blank'} href="https://">Detailed Rules</DetailedRules>
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
      </Rewards>
      <ClaimRewards>
        <M_PixelBtn disabled={disabledClaimRewards} content={onGoingClaim ? 'Ongoing Claim...' : 'Claim Rewards'} onClick={_clickClaimRewards} />
        <div style={{ marginTop: 8 }}>
          You have {totalPending} CRU pending claim rewards.
        </div>
      </ClaimRewards>
    </PixelBoard>
  </PageUserSideLayout>
}

export default React.memo<Props>(styled(Index)`
    .share-and-earn {
      margin-bottom: 32px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        font-size: 48px;
        line-height: 65px;
        font-weight: 600;
        margin-right: 60px;
        span {
          color: var(--primary-color);
        }
      }
      .top_card {
        height: 240px;
        min-width: 572px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: black;
        .btns {
          z-index: 2;
          position: relative;
          top: -12px;
          width: 400px;
          display: flex;
        }
        .total {
          font-weight: 600;
          font-size: 18px;
          line-height: 25px;
        }
        .total_reward {
          span{
            color: #216CFF;
          }
          font-weight: 600;
          font-size: 80px;
          line-height: 80px;
        }
        .networks {
          width: 400px;
          font-size: 18px;
          line-height: 28px;
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
      margin-top: 73px;
      width: 100%;
      height: 269px;
      display: flex;
      position: relative;
      .top_btn {
        cursor: default;
        width: 357px;
        position: absolute;
        top: 0;
        left: calc(50% - 179px);
      }

      .left {
        width: 387px;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
      }
      .right {
        color: black;
        font-size: 18px;
        line-height: 25px;
        padding-top: 50px;
        .title {
          font-size: 32px;
          line-height: 44px;
        }
        .footer {
          margin-top: 10px;
        }
        span {
          color: #216CFF;
        }
      }
    }

`)
