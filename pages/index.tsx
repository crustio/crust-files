import {Image, Popup} from "semantic-ui-react";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import BgAnim from '../components/effect/BgAnim';
import useParallax from "../lib/hooks/useParallax";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useContextWrapLoginUser} from "../lib/wallet/hooks";
import {nearConfig} from "../lib/wallet/config";
import styled from "styled-components";
import {AppContext} from "../lib/AppContext";

const {Cypher} = require("@zheeno/mnemonic-cypher");

interface Wallet {
  name: string
  image: string
  onClick: () => void
}

function Home({className}: { className?: string }) {
  const {t} = useTranslation()
  const {data} = useParallax(100, 7)
  const user = useContextWrapLoginUser()
  const {alert} = useContext(AppContext)
  const _onClickCrust = useCallback(async () => {
    try {
      await user.crust.init()
      if (!user.crust.provider) {
        return alert.alert({msg: 'Need install crust wallet', type: 'error'})
      }
      const accounts = await user.crust.login()
      if (accounts.length > 0) {
        user.setLoginUser({
          account: accounts[0],
          wallet: 'crust',
        })
      }
    } catch (e) {
      alert.alert({msg: 'Error', type: 'error'})
    }
  }, [user, t, alert])

  const _onClickPolkadotJs = useCallback(async () => {
    try {
      await user.polkadotJs.init()
      if (!user.polkadotJs.provider) {
        return alert.alert({msg: 'Need install polkadot-js wallet', type: 'error'})
      }
      const accounts = await user.polkadotJs.login()
      if (accounts.length > 0) {
        user.setLoginUser({
          account: accounts[0],
          wallet: 'polkadot-js',
        })
      }
    } catch (e) {
      alert.alert({msg: 'Error', type: 'error'})
    }
  }, [user, t, alert])

  const _onClickMetamask = useCallback(async () => {
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
      return alert.alert({msg: 'Need install Metamask', type: 'error'})
    }
  }, [user, t, alert]);

  const _onClickNear = useCallback(async () => {
    await user.near.init()
    if (!user.near.wallet) {
      return alert.alert({msg: 'Not Create NearConnection', type: 'error'});
    }

    await user.near.wallet.requestSignIn(nearConfig.contractName, 'Crust Files');
  }, [user, t, alert]);

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
    await user.solana.init()
    if (!user.solana.isInstalled) {
      return alert.alert({msg: 'Need install Phantom', type: 'error'});
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
  }, [user, t, alert]);

  const _onClickElrond = useCallback(async () => {
    await user.elrond.init()
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

  useEffect(() => {
    const cy = new Cypher()
    cy.setWordLength(5)
    const {mnemonics, secret} = cy.genMnemonics()
    // const secret = cy.genSecret()
    console.info('m:', mnemonics)
    console.info('s:', secret)

  }, [])

  const wallets: Wallet[] = useMemo(() => {
    return [
      {
        name: 'crust wallet',
        image: '/images/wallet_crust.png',
        onClick: _onClickCrust,
      },
      {
        name: 'polkadot-js',
        image: '/images/wallet_polkadot.png',
        onClick: _onClickPolkadotJs,
      },
      {
        name: 'metamask',
        image: '/images/wallet_metamask.png',
        onClick: _onClickMetamask,
      },
      {
        name: 'near',
        image: '/images/wallet_near.png',
        onClick: _onClickNear,
      },
      {
        name: 'flow',
        image: '/images/wallet_flow.png',
        onClick: _onClickFlow,
      },
      {
        name: 'solana',
        image: '/images/wallet_solana.png',
        onClick: _onClickSolana,
      },
      {
        name: 'maiar',
        image: '/images/wallet_elrond.png',
        onClick: _onClickElrond,
      },
    ]
  }, [])

  const [showSlog, setShowSlog] = useState(false)
  const [slogTextIndex, setSlogTextIndex] = useState(0)
  useEffect(() => {
    let index = 0
    const task = setInterval(() => {
      if (index === 1) {
        setSlogTextIndex(0)
        setShowSlog(true)
      }
      if (index === 20) {
        setShowSlog(false)
      }
      if (index === 25) {
        setSlogTextIndex(1)
        setShowSlog(true)
      }
      if (index === 45) {
        setShowSlog(false)
      }
      if (index === 50) index = 0
      index++

    }, 100)
    return () => clearInterval(task)
  }, [])
  return (
    <div className={className}>
      <BgAnim/>
      <Image className={'logo'} src={"/images/logo_2.png"}/>
      <div className="slog">
        <Image src={"/images/crust_box2x.png"}
               className={classNames("slogIcon", {slogShow: true})}/>
        <div className={classNames("slogText", {slogShow: showSlog})}>
          {
            slogTextIndex === 0 &&
            <div className={"slogText1"}>
              Enjoy storing your <br/>
              files in a <span>Web3</span> style. <br/>
              Now <span>free</span>.
            </div>
          }
          {
            slogTextIndex === 1 &&
            <div className={"slogText2"}>
              - Multi-wallet access<br/>
              - Easily share links to friends<br/>
              - Long-term storage with abundant IPFS replicas<br/>
            </div>
          }
        </div>
      </div>
      <div className={"wallets"}>
        {
          wallets.map((w, index) => <Popup
            key={`wallet_${index}`}
            position={"top center"}
            content={w.name}
            trigger={
              <Image
                className={classNames({spaceLeft: index}, 'animStart', {animFinal: data[index].value})}
                circular
                inline
                size={'tiny'}
                src={w.image}
                onClick={w.onClick}
              />
            }
          />)
        }
      </div>
      <span className="signTip">{'Sign-in with a Web3 wallet'}</span>
    </div>
  )
}


export default React.memo(styled(Home)`

  color: white;
  display: flex;
  width: 100%;
  min-height: 600px;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //background: #333333;
  .logo {
    position: fixed;
    left: 3.5rem;
    top: 3rem;
    z-index: 10;
  }

  .slog {
    display: flex;
    overflow: hidden;
    padding-top: 4rem;
    width: 875px;
    height: 400px;

    .slogIcon {
      transition: all ease-out 300ms;
      position: relative;
      left: -300px;
      margin-right: 50px;
      width: 275px;
      height: 255px;
    }

    .slogShow {
      left: 0;
      right: 0;
      transform: translateX(0) !important;
    }

    .slogText {
      transition: all ease-out 300ms;
      position: relative;
      width: 550px;
      transform: translateX(550px);
    }

    .slogText1 {
      font-size: 60px;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 86px;

      span {
        color: orange;
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
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    padding: 20px 40px;

    .animStart {
      cursor: pointer;
      transition: all cubic-bezier(.41, .19, .21, 1.25) 1.2s;
      position: relative;
      transform: translateX(-800px) rotateZ(-900deg);

      &:hover {
        filter: drop-shadow(0 2px 6px rgba(255, 255, 255, 0.5));
      }
    }

    .spaceLeft {
      margin-left: 18px;
    }

    .animFinal {
      transform: none;
    }
  }

  .signTip {
    line-height: 3rem;
  }

`)
