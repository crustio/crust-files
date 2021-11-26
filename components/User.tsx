import React, {useCallback} from "react";
import {Dropdown, Item, Segment} from "semantic-ui-react";
import {useContextWrapLoginUser, WrapLoginUser} from "../lib/wallet/hooks";
import styled from "styled-components";
import {shortStr} from "../lib/utils";
import {useToggle} from "../lib/hooks/useToggle";
import ModalSelectAccount from "./ModalSelectAccount";
import _ from 'lodash';

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
    case "near":
      return '/images/wallet_near.png';
    case "solana":
      return '/images/wallet_solana.png';
    case "elrond":
      return '/images/wallet_elrond.png';
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

function User(props: Props) {
  const user = useContextWrapLoginUser();
  const _onClickLogout = useCallback(user.logout, [user])
  const [open, toggleOpen] = useToggle()

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
      <Item style={{justifyContent: 'flex-end'}}>
        <Item.Image src={getWalletIcon(user)} size={'tiny'}/>
        <Item.Content verticalAlign={"middle"} style={{flex: 'unset', paddingLeft: '0.7rem'}}>
          <Dropdown
            pointing={"top right"}
            icon={<span className="cru-fo cru-fo-chevron-down"/>}
            basic
            text={shortStr(user.account)}>
            <Dropdown.Menu>
              {user.accounts && <Dropdown.Item text={'Switch Account'} onClick={() => toggleOpen()}/>}
              <Dropdown.Item text={'Logout'} onClick={_onClickLogout}/>
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
  padding: 1.3rem !important;
  width: 100%;

  .tiny.image {
    width: 4.3rem;
    height: 4.3rem;
    filter: drop-shadow(0px 4px 5px rgba(0, 0, 0, 0.15));
  }

  .items > .item.tiny {
    width: 4.3rem;
  }

  .ui.dropdown {
    .cru-fo {
      font-size: 1.3rem;
      margin-left: 1.1rem;
    }

    .text {
      font-family: OpenSans-Medium;
      font-size: 1.3rem;
    }

    .menu::after {
      display: none;
    }

    .menu {
      background: #FFFFFF;
      box-shadow: 0 0.57rem 1.43rem 0 rgba(0, 0, 0, 0.1);
      border-radius: 0.86rem;
      border: 0.07rem solid #EEEEEE;
      padding: 0.57rem;

      .item {
        padding: 0.78rem 0.57rem !important;
        border-radius: 0.57rem;

        &:active {
          background-color: #EEEEEE;
        }
      }
    }
  }
`)
