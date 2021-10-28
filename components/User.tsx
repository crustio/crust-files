import React, {useCallback} from "react";
import {Dropdown, Item, Segment} from "semantic-ui-react";
import {useContextWrapLoginUser, WrapLoginUser} from "../lib/wallet/hooks";
import styled from "styled-components";
import {shortStr} from "../lib/utils";
import {useToggle} from "../lib/hooks/useToggle";
import ModalSelectAccount from "./ModalSelectAccount";

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

function User(props: Props) {
  const user = useContextWrapLoginUser();
  const _onClickLogout = useCallback(user.logout, [user])
  const [open, toggleOpen] = useToggle()

  return <Segment basic textAlign={"right"} className={props.className} style={{borderBottom: '2px solid #eeeeee'}}>
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
        <Item.Image src={getWalletIcon(user.wallet)} size={'tiny'}/>
        <Item.Content verticalAlign={"middle"} style={{flex: 'unset', paddingLeft: '0.5rem'}}>
          <Dropdown
            pointing={"top right"}
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
  border-bottom: 2px solid #eeeeee;
  margin: unset !important;

  .ui.dropdown {
    .text {
      font-family: "ArialRoundedMTBold";
      font-size: 1.3rem;
    }
  }
`)
