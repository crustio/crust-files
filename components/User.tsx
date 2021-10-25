import React, {useCallback} from "react";
import {Divider, Dropdown, Item, Segment} from "semantic-ui-react";
import {useContextWrapLoginUser, WrapLoginUser} from "../lib/wallet/hooks";
import DropdownText from "semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownText";
import styled from "styled-components";

export interface Props {
  className?: string,
}

function getWalletIcon(wallet: WrapLoginUser['wallet']): string {
  switch (wallet) {
    case "crust":
      return '/images/wallet_crust.png';
    case "polkadot-js":
      return '/images/wallet_polkadot.png';
    case "metamask":
      return '/images/wallet_metamask.png';
    case "near":
      return '/images/wallet_near.png';
    case "solana":
      return '/images/wallet_solana.png';
    case "elrond":
      return '/images/wallet_elrond.png';
    case "flow":
      return '/images/wallet_flow.png';
    default:
      return ''
  }
}

function shortAccount(account: string): string {
  if (account.length <= 8) return account;
  return `${account.substr(0, 4)}...${account.substr(account.length - 4, 4)}`;
}

function User(props: Props) {
  const user = useContextWrapLoginUser();
  const _onClickLogout = useCallback(user.logout, [user])
  return <Segment basic textAlign={"right"} className={props.className} style={{borderBottom: '2px solid #eeeeee'}}>
    <Item.Group>
      <Item style={{justifyContent: 'flex-end'}}>
        <Item.Image src={getWalletIcon(user.wallet)} size={'tiny'}/>
        <Item.Content verticalAlign={"middle"} style={{flex: 'unset', paddingLeft: '0.5rem'}}>
          <Dropdown
            text={shortAccount(user.account)}>
            <Dropdown.Menu>
              <Dropdown.Item text={'Logout'} onClick={_onClickLogout}/>
            </Dropdown.Menu>
          </Dropdown>
        </Item.Content>
      </Item>
    </Item.Group>
  </Segment>
}

export default React.memo(styled(User)`
  border-bottom: 2px solid #eeeeee;
  .ui.dropdown  {
    .text {
      font-family: "ArialRoundedMTBold";
      font-size: 1.3rem;
    }
  }
`)
