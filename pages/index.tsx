import classNames from "classnames";
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import TypeIt from "typeit-react";
import BgAnim from '../components/effect/BgAnim';
import Logo from "../components/Logo";
import { AppContext } from "../lib/AppContext";
import useParallax from "../lib/hooks/useParallax";
import { nearConfig } from "../lib/wallet/config";
import { LoginUser, useContextWrapLoginUser } from "../lib/wallet/hooks";
interface ItemWallet {
  name: string,
  image: string,
  group: 'Crust' | 'Polkadot' | 'MetaMask' | 'Web 3' | 'WalletConnect'
}

interface Wallet extends ItemWallet {
  onClick: (w: Wallet) => void
}

const IMGS = {
  'Crust': '/images/group_wallet_crust.png',
  'Polkadot': '/images/group_wallet_polkadot.png',
  'MetaMask': '/images/group_wallet_metamask.png',
  'Web 3': '/images/group_wallet_other.png',
  'WalletConnect': '/images/group_wallet_connect.png',
}

interface WalletGroup {
  items: Wallet[],
  group: ItemWallet['group'],
  img: string,
  onClick?: Wallet['onClick'],
}


function WalletItems(p: { gw: WalletGroup }) {
  const { gw } = p
  const count = gw.items.length
  const { data } = useParallax(100, count)
  return <div
    className="wallet_items"
    style={{ left: `${6.39 - (5.857 * count) / 2}rem` }}>
    {
      gw.items.map((w, index) =>
        <div
          key={`wallet_item_${index}`}
          onClick={() => w.onClick(w)}
          className={classNames("wallet_item", { animFinal: data[count - 1 - index].value })}>
          <img className="item_image" src={w.image} />
          <span className="item_name">{w.name}</span>
        </div>)
    }
  </div>
}

function Home({ className }: { className?: string }) {
  const { t } = useTranslation()
  const user = useContextWrapLoginUser()
  const { alert } = useContext(AppContext)
  // const [error, setError] = useState('');
  const setError = (data: string) => {
    if (data) {
      alert.error(data)
    }
  }

  const _onClickCrust = useCallback(async () => {
    try {
      setError('')
      await user.crust.init()
      if (!user.crust.provider) {
        setError(`Crust Wallet not installed`)
        return
      }
      const accounts = await user.crust.login()
      if (accounts.length > 0) {
        user.setLoginUser({
          account: accounts[0],
          wallet: 'crust',
        })
      }
    } catch (e) {
      console.error(e)
    }
  }, [user, t])

  const _onClickCrustDown = useCallback(() => {
    window.open('https://chrome.google.com/webstore/detail/crust-wallet/jccapkebeeiajkkdemacblkjhhhboiek', '_blank')
  }, [])

  const _onClickCrustGetCru = useCallback(() => {
    // TODO
    console.error('Todo: _onClickCrustGetCru')
  }, [])

  const _onClickPolkadotJs = useCallback(async () => {
    try {
      setError('')
      await user.polkadotJs.init()
      if (!user.polkadotJs.provider) {
        setError(`Polkadot (.js Extension) not installed`)
        return
      }
      const accounts = await user.polkadotJs.login()
      if (accounts.length > 0) {
        user.setLoginUser({
          account: accounts[0],
          wallet: 'polkadot-js'
        })
      }
    } catch (e) {
      console.error(e)
    }
  }, [user, t])

  const _onClickMetamask = useCallback(async (w: Wallet) => {
    setError('')
    await user.metamask.init()
    const ethReq = user.metamask.ethereum?.request;
    if (user.metamask.isInstalled && ethReq) {
      ethReq<string[]>({
        method: 'eth_requestAccounts'
      })
        .then((res) => {
          console.info('accounts:', res);
          const selectedAddress = user.metamask.ethereum?.selectedAddress;
          const wallet: LoginUser['wallet'] =
            w.name === 'Polygon' ? 'metamask-Polygon' :
              w.name === 'Moonriver' ? 'metamask-Moonriver' :
                'metamask'
          if (selectedAddress && res.includes(selectedAddress)) {
            user.setLoginUser({
              account: selectedAddress,
              wallet
            });
          } else if (res.length) {
            user.setLoginUser({
              account: res[0],
              wallet
            });
          }
        })
        .catch((error) => {
          console.error('accountsError:', error);
        });
    } else {
      setError(`MetaMask not installed`)
    }
  }, [user, t]);

  const _onClickNear = useCallback(async () => {
    setError('')
    await user.near.init()
    await user.near.wallet.requestSignIn(nearConfig.contractName, 'Crust Files');
  }, [user, t]);

  useEffect(() => {
    user.near.init()
      .then(() => {
        if (user.near.keyPair && user.near.wallet.isSignedIn()) {
          user.setLoginUser({
            account: user.near.wallet.getAccountId() as string,
            wallet: 'near',
            pubKey: user.near.keyPair.getPublicKey().toString().substr(8)
          })
        }
      })
      .catch(console.error)
  }, [user])

  const _onClickFlow = useCallback(async () => {
    setError('')
    await user.flow.init()
    const fcl = user.flow.fcl;
    if (!fcl) return;
    // eslint-disable-next-line
    let flowUser = await fcl.currentUser().snapshot();
    // eslint-disable-next-line
    if (!flowUser.loggedIn) {
      await fcl.authenticate();
    }

    // eslint-disable-next-line
    flowUser = await fcl.currentUser().snapshot();
    user.setLoginUser({
      // eslint-disable-next-line
      account: flowUser.addr,
      wallet: 'flow'
    });
  }, [user]);

  const _onClickSolana = useCallback(async () => {
    setError('')
    await user.solana.init()
    if (!user.solana.isInstalled) {
      setError(`Solana (Phantom Wallet) not installed`)
    }

    // eslint-disable-next-line
    if (user.solana.solana.isConnected) {
      user.setLoginUser({
        // eslint-disable-next-line
        account: user.solana.solana.publicKey.toBase58(),
        wallet: 'solana'
      });

      return;
    }

    // eslint-disable-next-line
    user.solana.solana.connect();
    // eslint-disable-next-line
    user.solana.solana.on('connect', () => {
      user.setLoginUser({
        // eslint-disable-next-line
        account: user.solana.solana.publicKey.toBase58(),
        wallet: 'solana'
      });
    });
  }, [user, t]);

  const _onClickElrond = useCallback(async () => {
    setError('')
    await user.elrond.init()
    if (!user.elrond.provider) {
      setError(`Elrond (Maiar Wallet) not installed`)
      return
    }
    await user.elrond.provider.login({
      callbackUrl: encodeURIComponent(
        `${window.location.origin}/#/files`
      )
    });
    const { address } = user.elrond.provider.account;

    user.setLoginUser({
      // eslint-disable-next-line
      account: address,
      wallet: 'elrond'
    });
  }, [user, t])

  const _onClickWalletConnect = useCallback(async () => {
    await user.walletConnect.init()
    try {
      await user.walletConnect.connect.killSession()
    } catch (e) {
      console.error(e)
    }
    await user.walletConnect.connect?.createSession()
    user.walletConnect.connect?.on("connect", (_, payload) => {
      const { accounts } = payload.params[0];
      user.setLoginUser({
        account: accounts[0],
        wallet: 'wallet-connect'
      })
    })
  }, [user])

  const wallets = useMemo<Wallet[]>(() => {
    return [
      {
        group: 'Crust',
        name: 'Crust Wallet',
        image: '/images/wallet_crust.png',
        onClick: _onClickCrust,
      },
      {
        group: 'Crust',
        name: 'Download',
        image: '/images/crust_down.png',
        onClick: _onClickCrustDown,
      },
      {
        group: 'Crust',
        name: 'Get CRU',
        image: '/images/crust_get_cru.png',
        onClick: _onClickCrustGetCru,
      },
      {
        group: 'Polkadot',
        name: 'Polkadot',
        image: '/images/wallet_polkadot.png',
        onClick: _onClickPolkadotJs,
      },
      {
        group: 'MetaMask',
        name: 'Ethereum',
        image: '/images/wallet_ethereum.png',
        onClick: _onClickMetamask,
      },
      {
        group: 'MetaMask',
        name: 'Polygon',
        image: '/images/wallet_polygon.png',
        onClick: _onClickMetamask,
      },
      {
        group: 'MetaMask',
        name: 'Moonriver',
        image: '/images/wallet_moonriver.png',
        onClick: _onClickMetamask,
      },
      {
        group: 'Web 3',
        name: 'Near',
        image: '/images/wallet_near.png',
        onClick: _onClickNear,
      },
      {
        group: 'Web 3',
        name: 'Elrond',
        image: '/images/wallet_elrond.png',
        onClick: _onClickElrond,
      },
      {
        group: 'Web 3',
        name: 'Solana',
        image: '/images/wallet_solana.png',
        onClick: _onClickSolana,
      },
      {
        group: 'Web 3',
        name: 'Flow',
        image: '/images/wallet_flow.png',
        onClick: _onClickFlow,
      },
      {
        group: 'WalletConnect',
        name: 'WalletConnect',
        image: '/images/wallet_connect.png',
        onClick: _onClickWalletConnect,
      }
    ]
  }, [_onClickCrust, _onClickCrustDown, _onClickCrustGetCru, _onClickPolkadotJs, _onClickMetamask, _onClickNear, _onClickFlow, _onClickSolana, _onClickElrond, _onClickWalletConnect])

  const groupWallets = useMemo<WalletGroup[]>(() => {
    const groupObj = _.groupBy(wallets, 'group')
    const keys = _.keys(groupObj)
    return _.map(keys, (key) => {
      const items = groupObj[key]
      const group = key
      const g: WalletGroup = {
        items,
        group,
        img: IMGS[key]
      }
      if (g.items.length === 1) {
        g.onClick = g.items[0].onClick
      }
      return g
    })
  }, [wallets])

  const [slogTextIndex, setSlogTextIndex] = useState(0)
  useEffect(() => {
    let index = 0
    const task = setInterval(() => {
      if (index === 3) setSlogTextIndex(1)
      if (index === 9) setSlogTextIndex(2)
      if (index === 14) {
        setSlogTextIndex(0)
        index = 0
      }
      index += 1
    }, 2000)
    return () => clearInterval(task)
  }, [])

  const [hoverWalletGroup, setHoverWalletGroup] = useState<WalletGroup | null>(null)

  // const walletsDiv = useRef<HTMLDivElement>()
  // const doScroll = (direction: 'l' | 'r') => {
  //   if (walletsDiv.current && walletsDiv.current.children && walletsDiv.current.children.length) {
  //     const children = walletsDiv.current.children
  //     if (direction === 'l') {
  //       children.item(0).scrollIntoView({ behavior: 'smooth' })
  //     }
  //     if (direction === 'r') {
  //       children.item(children.length - 1).scrollIntoView({ behavior: 'smooth' })
  //     }
  //   }
  // }

  const { data } = useParallax(100, 5)

  return (
    <div className={className}>
      <BgAnim />
      <Logo className={"logo"} />
      <div className="flexN" />
      <div className="slog font-sans-semibold">
        <Image src={"/images/crust_box2x.png"}
          className={classNames("slogIcon")} />
        <div className={classNames("slogText")}>
          {
            slogTextIndex === 0 &&
            <div className={"slogText1"}>
              <TypeIt options={{ speed: 60 } as any}>
                Enjoy storing your <br />
                files in a <span className={'highlight'}>Web3</span> style. <br />
                Now <span className={'highlight'}>free</span>.
              </TypeIt>
            </div>
          }
          {
            slogTextIndex === 1 &&
            <div className={"slogText2"}>
              <TypeIt options={{ speed: 60 } as any}>
                - Multi-wallet access with your Web3.0 identity<br />
                - Absolute data privacy by end-to-end file encryption<br />
                - IPFS storage with globally-distributed replicas
              </TypeIt>
            </div>
          }
          {
            slogTextIndex === 2 &&
            <div className={"slogText2"}>
              <TypeIt options={{ speed: 60 } as any}>
                - Easy share links to friends<br />
                - Retrieve your files anywhere, anytime<br />
                - Paid service with smart contract on public<br /> blockchains
              </TypeIt>
            </div>
          }
        </div>
      </div>
      <div className="flex1" />

      <div className={"wallets"}>
        {
          groupWallets.map((gw, index) =>
            <div
              key={`wallet_group_${index}`}
              onClick={() => {
                if (gw.onClick) {
                  gw.onClick(gw.items[0])
                }
              }}
              onMouseEnter={() => setHoverWalletGroup(() => gw)}
              onMouseLeave={() => setHoverWalletGroup(() => null)}
              className={classNames("wallet_group", { animFinal: data[index].value })}>
              <img className="image" src={gw.img} />
              <span className="text">{gw.group}</span>
              {
                gw.items.length > 1 && hoverWalletGroup && hoverWalletGroup.group === gw.group &&
                <WalletItems gw={gw} />
              }
            </div>
          )
        }
        {/* <Icon className="btn_scroll left" name="caret left" onClick={() => doScroll('l')}/> */}
        {/* <Icon className="btn_scroll right" name="caret right" onClick={() => doScroll('r')}/> */}
      </div>
      <span
        className={classNames("signTip font-sans-medium")}
        dangerouslySetInnerHTML={
          {
            __html: "Sign-in with Web/Browser/Mobile Wallets"
            // `Sign-in with <span>${hoverWallet.name}</span>`
          }
        } />
      <div className={'flexN'} />
    </div>
  )
}


export default React.memo(styled(Home)`

  color: white;
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  .logo {
    margin-left: 3.5rem;
    margin-top: 3rem;
    align-self: flex-start;
  }

  .flexN {
    flex: 1;
  }

  .flex1 {
    height: 7.8rem;
  }

  .slog {
    display: flex;
    overflow: hidden;
    padding-top: 1rem;
    font-weight: 600;
    flex-shrink: 0;
    height: 19.8rem;

    .slogIcon {
      position: relative;
      margin-right: 4.3rem;
      width: 19.6rem;
      height: 18.2rem;
    }

    .slogText {
      position: relative;
      width: 44.5rem;
    }

    .slogText1 {
      font-size: 60px;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 86px;

      .highlight {
        color: var(--primary-color);
      }
    }

    .slogText2 {
      padding-top: 40px;
      line-height: 56px;
      font-size: 24px;
      white-space: pre-wrap;
      word-break: break-all;
    }

  }

  .wallets {
    height: min-content;
    display: inline-block;
    overflow: visible;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6rem;
    flex-shrink: 0;
    padding: 0 3rem;

    .wallet_group {
      display: inline-block;
      overflow: visible;
      height: 12.14rem;
      width: 12.7857rem;
      text-align: center;
      padding-top: 1.857rem;
      position: relative;
      cursor: pointer;
      /* transition: all cubic-bezier(.41, .19, .21, 1.25) 1.2s; */
      /* transform: translateX(-800px); */

      &:hover {
        .image,.text {
          filter: drop-shadow(0px 4px 16px rgba(255, 255, 255, 0.5));
          position: relative;
          top: -1rem;
        }
        .wallet_items {
          display: flex;
        }
      }
      .image {
        width: 7rem;
        height: 7rem;
        margin-left: 2.89rem;
        display: block;
      }
      .text {
        font-size: 1.2857rem;
        line-height: 2.357rem;
      }

      .wallet_items {
        position: absolute;
        display: none;
        overflow: hidden;
        height: 6.86rem;
        padding-top: 1rem;
        top: -6.85rem;
      }
    }
    .wallet_item {
      display: inline-block;
      width: 5.857rem;
      text-align: center;
      cursor: pointer;
      transform: translateY(90px);
      transition: all cubic-bezier(.41, .19, .21, 1.25) 300ms;
      .item_image {
        margin-left: 1.14rem;
        width: 3.57rem;
        height: 3.57rem;
      }
      .item_text {
        font-size: 0.857rem;
        line-height: 1.43rem;
      }
    }

    .spaceLeft {
      margin-left: 1.4rem;
    }

    .animFinal {
      transform: none;
    }
  }

  .signTip {
    line-height: 3rem;
    font-size: 1.5rem;

    span {
      color: var(--primary-color);
    }
  }

  .errorInfo {
    color: #FF5B5B;
  }

`)
