import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback } from "react";
import { Dropdown, Item, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { useClipboard } from '../lib/hooks/useClipboard';
import { useGet } from '../lib/hooks/useGet';
import { useGetDepost } from '../lib/hooks/useGetDeposit';
import { useToggle } from "../lib/hooks/useToggle";
import { getEarnRewards } from '../lib/http/share_earn';
import { useAutoUpdateToStore } from '../lib/initAppStore';
import { getFormatValue, shortStr } from "../lib/utils";
import { WalletName, WrapLoginUser } from "../lib/wallet/hooks";
import { Links2 } from './Links';
import ModalSelectAccount from "./modal/ModalSelectAccount";

export interface Props {
  className?: string,
}

function getWalletIcon(user: WrapLoginUser): string {
  switch (user.wallet) {
    case "crust":
      return '/images/wallet_crust.png';
    case "polkadot-js":
      return '/images/group_wallet_polkadot.png';
    case "metamask":
      return '/images/wallet_ethereum.png';
    case "metamask-Polygon":
      return '/images/wallet_polygon.png';
    case "metamask-Moonriver":
      return '/images/wallet_moonriver.png';
    case "metamask-BSC":
      return '/images/wallet_bsc.png';
    case "metamask-HECO":
      return '/images/wallet_heco.png';
    case "metamask-Cubechain":
      return '/images/wallet_cube.png';
    case "near":
      return '/images/wallet_near.png';
    case "solana":
      return '/images/wallet_solana.png';
    case "elrond":
      return '/images/wallet_elrond.png';
    case "metax":
      return '/images/wallet_metax.png';
    case "flow":
      return '/images/wallet_flow.png';
    case "wallet-connect": {
      const icons = _.get(user.walletConnect.connect, 'peerMeta.icons')
      if (_.size(icons)) {
        return icons[0]
      }
      return '/images/wallet_connect.png';
    }
    default:
      return ''
  }
}

const TwoText = styled.div`
  .title-text{
    font-size: 16px;
    line-height: 24px;
    font-family: OpenSans-Medium;
    font-weight: 500;
    color: var(--main-color);
    strong {
      font-family: OpenSans-SemiBold;
      color: black;
    }
  }
  .primary {
    color: var(--primary-color);
  }
  .go-to {
    cursor: pointer;
    &:nth-child(n + 2){
      margin-left: 6px;
    }
    text-decoration: underline;
    color: var(--primary-color);
    font-size: 10px;
    font-weight: normal;
  }
  .sub-text {
    font-size: 12px;
    line-height: 24px;
    font-family: OpenSans-Regular;
    color: var(--secend-color);
    strong {
      color: black;
      font-family: OpenSans-SemiBold;
    }
    .cru-fo{
      cursor: pointer;
      position: relative;
      top: 4px;
      margin-left: 8px;
    }
  }
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eeeeee;
  margin: 12px 0;
`

const MBtns = styled.div`
  display: flex;
  margin-top: 24px;
  .btn {
    flex: 1;
    height: 40px;
    line-height: 40px;
    border: 1px solid black;
    border-radius: 8px;
    color: var(--main-color);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
  }
  .btn:nth-child(2){
    margin-left: 8px;
  }
`

function User(props: Props) {
  const [open, toggleOpen] = useToggle()
  const _onClickDocs = () => {
    window.open(`${window.location.origin}/docs/CrustFiles_Welcome`, '_blank')
  }
  const copy = useClipboard()
  const { isPremiumUser, isCrust, user } = useGetDepost()
  const _onClickLogout = useCallback(user.logout, [user])
  const showSwitchAccount = user.wallet === 'crust' || user.wallet === 'polkadot-js'
  const [mRewards] = useGet(() => getEarnRewards(user.account), [user.account, isCrust], 'getEarnRewards')
  const {rewards} = useAutoUpdateToStore({ key: 'rewards', value: mRewards})
  const totalRewards = getFormatValue(rewards, 'total.total')
  const r = useRouter()

  const renderGoToGetPermium = () => {
    return <span className='go-to' onClick={() => r.push('/user')}>Get Premium</span>
  }
  const renderTitleText = () => {
    if (isPremiumUser)
      return <div className='title-text primary'>
        <strong>{user.nickName}</strong> Premium User
      </div>
    if (isCrust)
      return <div className='title-text'>
        <strong>{user.nickName}</strong> Trial User {renderGoToGetPermium()}
      </div>
    return <div className='title-text'>Trial User</div>
  }

  const renderSubText = () => {
    if (isCrust)
      return <div className='sub-text'>Total Share-and-Earn Rewards: <strong>{totalRewards}</strong> CRU</div>
    return <div className='sub-text'>{renderGoToGetPermium()}</div>
  }

  return <Segment basic textAlign={"right"} className={props.className}>
    {
      open && <ModalSelectAccount
        size={'tiny'}
        open={true}
        user={user}
        toggleOpen={toggleOpen}
      />
    }
    <Item.Group>
      <Item style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <Links2 space={20} size={24} />
        <div className="docs" onClick={_onClickDocs}>
          <span className="cru-fo cru-fo-file-text" /> 
          {/* Docs */}
        </div>
        <Item.Image src={getWalletIcon(user)} size={'tiny'} />
        <Item.Content verticalAlign={"middle"} style={{ flex: 'unset', paddingLeft: '0.7rem' }}>
          <Dropdown
            pointing={"top right"}
            icon={<span className="cru-fo cru-fo-chevron-down" />}
            basic
            text={user.nickName || shortStr(user.account)}>
            <Dropdown.Menu>
              <TwoText>
                <div className='title-text'>Sign-in Wallet : {WalletName[user.wallet]}</div>
                <div className='sub-text'>
                  {shortStr(user.account, 14)}<span onClick={() => copy(user.account)} className='cru-fo cru-fo-copy' />
                </div>
              </TwoText>
              <Line />
              <TwoText>
                {renderTitleText()}
                {renderSubText()}
              </TwoText>
              <MBtns>
                {showSwitchAccount && <div className='btn' onClick={() => toggleOpen(true)}>Switch Account</div>}
                <div className='btn' onClick={_onClickLogout}>Log Out</div>
              </MBtns>
            </Dropdown.Menu>
          </Dropdown>
        </Item.Content>
      </Item>
    </Item.Group>
  </Segment>
}

export default React.memo(styled(User)`
  border-bottom: 1px solid var(--line-color) !important;
  margin: unset !important;
  padding: 1.1rem !important;
  width: 100%;
  flex-shrink: 0;
  .docs {
    /* margin-top: 20px; */
    margin-left: 20px;
    display: inline-block;
    color: var(--secend-color);
    height: 24px;
    margin-right: 30px;
    cursor: pointer;
    font-size: 24px;
    .cru-fo {
      position: relative;
      top: 1px;
      margin-right: 10px;
    }
    padding-right: 30px;
    border-right: 1px solid #EEEEEE;
  }

  .tiny.image {
    width: 50px !important;
    height: 50px !important;
    margin-right: 1rem !important;
    /* filter: drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.15)); */
  }

  .items > .item.tiny {
    width: 4.3rem;
  }

  .ui.dropdown {
    .cru-fo {
      font-size: 18px;
      margin-left: 1.1rem;
    }

    .text {
      font-family: OpenSans-Medium;
      font-size: 18px;
    }

    .menu::after {
      display: none;
    }

    .menu {
      background: #FFFFFF;
      box-shadow: 0 0.57rem 1.43rem 0 rgba(0, 0, 0, 0.1);
      border-radius: 0.86rem;
      width: 328px;
      border: 0.07rem solid #EEEEEE;
      padding: 16px;
      margin-top: 1.6rem !important;

    }
  }
`)
