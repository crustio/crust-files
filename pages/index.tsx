import {Image} from "semantic-ui-react";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import BgAnim from '../components/effect/BgAnim';
import useParallax from "../lib/hooks/useParallax";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useContextWrapLoginUser} from "../lib/wallet/hooks";
import {nearConfig} from "../lib/wallet/config";
import styled from "styled-components";
import TypeIt from "typeit-react";
import Logo from "../components/Logo";
import {AppContext} from "../lib/AppContext";

interface ItemWallet {
  name: 'Crust Wallet' | 'Polkadot (.js Extension)' | 'MetaMask' | 'Near Wallet' | 'Flow (Blocto Wallet)' |
    'Solana (Phantom Wallet)' | 'Elrond (Maiar Wallet)' | 'WalletConnect'
  image: string
}

interface Wallet extends ItemWallet {
  onClick: () => void
}

const WALLETS: ItemWallet[] = [
  {
    name: 'Crust Wallet',
    image: '/images/wallet_crust.png',
  },
  {
    name: 'Polkadot (.js Extension)',
    image: '/images/wallet_polkadot.png',
  },
  {
    name: 'MetaMask',
    image: '/images/wallet_metamask.png',
  },
  {
    name: 'Near Wallet',
    image: '/images/wallet_near.png',
  },
  {
    name: 'Flow (Blocto Wallet)',
    image: '/images/wallet_flow.png',
  },
  {
    name: 'Solana (Phantom Wallet)',
    image: '/images/wallet_solana.png',
  },
  {
    name: 'Elrond (Maiar Wallet)',
    image: '/images/wallet_elrond.png',
  },

]

const WALLETS2: ItemWallet[] = [
  {
    name: 'WalletConnect',
    image: '/images/wallet_connect.png',
  }
]

function Home({className}: { className?: string }) {
  const {t} = useTranslation()
  const {data} = useParallax(100, WALLETS.length + WALLETS2.length)
  const user = useContextWrapLoginUser()
  const {alert} = useContext(AppContext)
  // const [error, setError] = useState('');
  const setError = useCallback((data: string) => {
    if (data) {
      alert.error(data)
    }
  }, [])
  const _onClickCrust = useCallback(async () => {
    try {
      setError('')
      await user.crust.init()
      if (!user.crust.provider) {
        setError(`${WALLETS[0].name} not installed`)
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

  const _onClickPolkadotJs = useCallback(async () => {
    try {
      setError('')
      await user.polkadotJs.init()
      if (!user.polkadotJs.provider) {
        setError(`${WALLETS[1].name} not installed`)
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

  const _onClickMetamask = useCallback(async () => {
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

          if (selectedAddress && res.includes(selectedAddress)) {
            user.setLoginUser({
              account: selectedAddress,
              wallet: 'metamask'
            });
          } else if (res.length) {
            user.setLoginUser({
              account: res[0],
              wallet: 'metamask'
            });
          }
        })
        .catch((error) => {
          console.error('accountsError:', error);
        });
    } else {
      setError(`${WALLETS[2].name} not installed`)
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
      setError(`${WALLETS[5].name} not installed`)
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
      setError(`${WALLETS[6].name} not installed`)
      return
    }
    await user.elrond.provider.login({
      callbackUrl: encodeURIComponent(
        `${window.location.origin}/#/files`
      )
    });
    const {address} = user.elrond.provider.account;

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
      const {accounts} = payload.params[0];
      user.setLoginUser({
        account: accounts[0],
        wallet: 'wallet-connect'
      })
    })
  }, [user])

  const wallets: Wallet[] = useMemo(() => {
    return WALLETS.map((item) => {
      switch (item.name) {
        case "Crust Wallet":
          return {...item, onClick: _onClickCrust}
        case "Polkadot (.js Extension)":
          return {...item, onClick: _onClickPolkadotJs}
        case "MetaMask":
          return {...item, onClick: _onClickMetamask}
        case "Near Wallet":
          return {...item, onClick: _onClickNear}
        case "Flow (Blocto Wallet)":
          return {...item, onClick: _onClickFlow}
        case "Solana (Phantom Wallet)":
          return {...item, onClick: _onClickSolana}
        case "Elrond (Maiar Wallet)":
          return {...item, onClick: _onClickElrond}
      }
      return {...item, onClick: _onClickCrust}
    })
  }, [_onClickCrust, _onClickPolkadotJs, _onClickMetamask, _onClickNear, _onClickFlow, _onClickSolana, _onClickElrond])

  const wallets2: Wallet[] = useMemo(() => {
    return WALLETS2.map((item) => {
      return {...item, onClick: _onClickWalletConnect}
    })
  }, [_onClickWalletConnect])

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

  // const [signSlogIndex, setSignSlogIndex] = useState(0)
  // const signSlog = [
  //   "Sign-in with a Web wallet",
  //   "Sign-in with a Mobile Wallet",
  //   "Sign-in with a Browser Extension"
  // ]
  // useEffect(() => {
  //   let index = 0
  //   const task = setInterval(() => {
  //     index += 1
  //     if (index === signSlog.length)
  //       index = 0
  //     setSignSlogIndex(index)
  //   }, 2000)
  //   return () => clearInterval(task)
  // })

  const [hoverWallet, setHoverWallet] = useState<ItemWallet | null>(null)
  return (
    <div className={className}>
      <BgAnim/>
      <Logo className={"logo"}/>
      <div className="flexN"/>
      <div className="slog font-sans-semibold">
        <Image src={"/images/crust_box2x.png"}
               className={classNames("slogIcon")}/>
        <div className={classNames("slogText")}>
          {
            slogTextIndex === 0 &&
            <div className={"slogText1"}>
              <TypeIt options={{speed: 60} as any}>
                Enjoy storing your <br/>
                files in a <span className={'highlight'}>Web3</span> style. <br/>
                Now <span className={'highlight'}>free</span>.
              </TypeIt>
            </div>
          }
          {
            slogTextIndex === 1 &&
            <div className={"slogText2"}>
              <TypeIt options={{speed: 60} as any}>
                - Multi-wallet access with your Web3.0 identity<br/>
                - Absolute data privacy by end-to-end file encryption<br/>
                - IPFS storage with globally-distributed replicas
              </TypeIt>
            </div>
          }
          {
            slogTextIndex === 2 &&
            <div className={"slogText2"}>
              <TypeIt options={{speed: 60} as any}>
                - Easy share links to friends<br/>
                - Retrieve your files anywhere, anytime<br/>
                - Paid service with smart contract on public<br/> blockchains
              </TypeIt>
            </div>
          }
        </div>
      </div>
      <div className="flex1"/>
      <div className={'wallets_panel'}>
        <div className={"wallets"}>
          {
            wallets.map((w, index) =>
              <Image
                key={`wallet_${index}`}
                id={w.name}
                className={classNames({spaceLeft: index}, 'animStart', {animFinal: data[index].value})}
                circular
                inline
                size={'tiny'}
                src={w.image}
                onClick={w.onClick}
                onMouseEnter={() => {
                  setError('')
                  setHoverWallet(() => wallets[index])
                }}
                onMouseLeave={() => {
                  setError('')
                  setHoverWallet(() => null)
                }}
              />
            )
          }
        </div>
        <div className={"wallets"}>
          {
            wallets2.map((w, index) =>
              <Image
                key={`wallet_${index}`}
                id={w.name}
                className={classNames({spaceLeft: index}, 'animStart', {animFinal: data[index + wallets.length].value})}
                circular
                inline
                size={'tiny'}
                src={w.image}
                onClick={w.onClick}
                onMouseEnter={() => {
                  setError('')
                  setHoverWallet(() => wallets2[index])
                }}
                onMouseLeave={() => {
                  setError('')
                  setHoverWallet(() => null)
                }}
              />
            )
          }
        </div>
      </div>
      <span
        className={classNames("signTip font-sans-medium")}
        dangerouslySetInnerHTML={
          {
            __html: hoverWallet === null ? "Sign-in with Web/Browser/Mobile Wallets" :
                `Sign-in with <span>${hoverWallet.name}</span>`
          }
        }/>
      <div className={'flexN'}/>
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

  .wallets_panel {
    height: auto;
    flex-shrink: 0;
    white-space: nowrap;

    .wallets:first-child {
      margin-right: 1rem;
    }
  }

  .wallets {
    height: min-content;
    display: inline-block;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6rem;
    padding: 1.4rem 4rem 0.8rem 4rem;
    flex-shrink: 0;

    .animStart {
      width: 8.4rem !important;
      height: 8.4rem !important;
      cursor: pointer;
      transition: all cubic-bezier(.41, .19, .21, 1.25) 1.2s;
      position: relative;
      transform: translateX(-800px) rotateZ(-900deg);

      &:hover {
        filter: drop-shadow(0 2px 6px rgba(255, 255, 255, 0.5));
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
