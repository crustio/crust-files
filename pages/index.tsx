import classNames from "classnames";
import React, { MouseEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Links } from "../components/Links";
import { PixelBg } from "../components/effect/PixelBg";
import { Pixel } from "../components/effect/Pixels";
// import BgAnim from '../components/effect/BgAnim';
import { FiChevronDown, FiChevronUp, FiDownload } from "react-icons/fi";
import Logo from "../components/Logo";
import { AppContext } from "../lib/AppContext";
import { CrustWalletDownUrl, MOBILE_WIDTH, ScreenMobile } from "../lib/config";
import { report } from "../lib/http/report";
import { BaseWallet } from "../lib/types";
import { getErrorMsg, openDocs } from "../lib/utils";
import { useContextWrapLoginUser, WALLETMAP } from "../lib/wallet/hooks";
import { updateAuth, UserClosed } from "../lib/wallet/tools";

declare global {
  interface Window {
    martian: any;
    aptos: any;
    ethereum?: any;
  }
}

const recomendWallets: BaseWallet[] = [WALLETMAP.crust, WALLETMAP.metamask, WALLETMAP["wallet-connect"], WALLETMAP["ton-connect"]];
const recomendWalletsMobile: BaseWallet[] = [WALLETMAP.metamask, WALLETMAP["wallet-connect"], WALLETMAP['coinbase'], WALLETMAP['metax']];
const moreWallets: BaseWallet[] = [
  WALLETMAP.algorand,
  WALLETMAP["aptos-martian"],
  WALLETMAP["aptos-petra"],
  WALLETMAP.elrond,
  WALLETMAP.metax,
  WALLETMAP.mimir,
  WALLETMAP["polkadot-js"],
  WALLETMAP.solana,
  WALLETMAP.subWallet,
  WALLETMAP.talisman,
];

function useRecomendWallets() {
  const [walelts, setWallets] = useState<BaseWallet[]>([])
  useEffect(() => {
    
    const onSizeChange = () => {
      setWallets(window.innerWidth <= MOBILE_WIDTH ? recomendWalletsMobile : recomendWallets)
    }
    onSizeChange()
    window.addEventListener('resize', onSizeChange)
    return () => window.removeEventListener('resize', onSizeChange)
  }, [])
  return walelts
}
function Home({ className }: { className?: string }) {
  // const { t } = useTranslation();
  const user = useContextWrapLoginUser();
  const { alert } = useContext(AppContext);
  const reWallets = useRecomendWallets()
  // const [error, setError] = useState('');
  const setError = (data: string) => {
    if (data) {
      alert.error(data);
    }
  };
  const _onClickCrustDown = useCallback((e: MouseEvent<any>) => {
    window.open(CrustWalletDownUrl, "_blank");
    e.stopPropagation();
  }, []);
  // const [showWallets, setShowWallets] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const onClickedWallet = useRef(false);
  const onClickWallet = async (w: BaseWallet) => {
    try {
      if (onClickedWallet.current) return;
      onClickedWallet.current = true;
      console.info("do connnect wallet ", w.name);
      await w.init();
      console.info("do connnect wallet Inited", w.name);
      const u = await w.connect();
      console.info("do connnect wallet Connected", w.name);
      await updateAuth(u);
      console.info("do connnect wallet Authed", w.name);
      user.setLoginUser(u);
      report({
        type: 1,
        walletType: u.wallet,
        address: u.account,
        data: {},
      });
    } catch (error) {
      console.info("login Error", error);
      const msg = getErrorMsg(error);
      if (msg !== UserClosed) {
        setError(msg);
      }
    }
    onClickedWallet.current = false;
  };

  return (
    <div className={className}>
      <div className="left_panel">
        {/* <BgAnim /> */}
        <PixelBg className="bg" />
        <div className="panel">
          <Logo className={"logo"} />
          <div className="tabs">
            <Links className="links" size={24} space={20} />
            <div className="tutorial" onClick={() => window.open("https://www.youtube.com/watch?v=AXt-JjupBAo&t=69s", "_blank")}>
              Watch Tutorial
            </div>
            <div className="docs" onClick={() => openDocs("/docs/CrustFiles_Welcome")}>
              Docs
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div className="slog font-sans-semibold">
            Your first personal <span>Web3.0</span> storage
          </div>
          <div className="wallets_panel">
            {reWallets.map((w, i) => (
              <div key={`recomendList_${i}`} className="item_connect" style={{ justifyContent: "flex-start", paddingLeft: 90 }} onClick={() => onClickWallet(w)}>
                <img style={{ height: 32, padding: 2.5, position: "relative" }} src={w.icon} />
                <span>{w.name}</span>
                {w.name == "Crust Wallet" && <FiDownload style={{ fontSize: 24, marginLeft: 20 }} onClick={_onClickCrustDown} />}
              </div>
            ))}
            <div className="more_opt" onClick={() => setShowMore(!showMore)}>
              <span>More Options</span>
              {showMore ? <FiChevronUp className="more_icon" /> : <FiChevronDown className="more_icon" />}
            </div>
            {showMore && (
              <div className="more_wallets">
                {moreWallets.map((w, index) => (
                  <div key={`wallet_item_${index}`} onClick={() => onClickWallet(w)} className={classNames("wallet_item")}>
                    <img className="item_image" src={w.icon} />
                    <span className="item_name">{w.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }} />
        </div>
      </div>
      <div className="center_panel">
        <div className="cosmos" />
        <Pixel className="pixel_left" width={"8.57rem"} position="left" fullH={true} />
      </div>
    </div>
  );
}

export default React.memo(
  styled(Home)`
    color: white;
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    overflow-x: auto;

    .left_panel {
      background-color: #000000;
      flex: 1;
      // height: 100%;
      position: relative;
      .panel {
        left: 0;
        top: 0;
        z-index: 10;
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        position: absolute;
      }
      .tabs {
        font-size: 1.29rem;
        line-height: 1.79rem;
        font-weight: 600;
        position: absolute;
        top: 3.57rem;
        right: 2.3rem;
        display: flex;
        align-items: center;
        .links {
          display: inline-flex;
          margin-right: 2rem;
        }
        .tutorial {
          display: inline-block;
          cursor: pointer;
          margin-right: 2rem;
          text-decoration: underline;
          text-decoration-color: white;
        }
        .docs {
          display: inline-block;
          cursor: pointer;
        }
      }

      .slog {
        font-size: 3.125rem;
        line-height: 4.25rem;
        span {
          color: var(--primary-color);
        }
      }
    }
    .center_panel {
      width: 25.71rem;
      // height: 100%;
      flex-shrink: 0;
      position: relative;
      .cosmos {
        width: calc(100% - 5.71rem);
        margin-left: 2.86rem;
        height: 100%;
        background: url("/images/cosmos.png");
        background-size: contain;
        background-position: center;
        background-repeat: repeat-y;
      }
      .pixel_left {
        position: absolute;
        left: 0;
        top: 0;
      }
      .pixel_right {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    /* .right_panel {
    background-color: var(--primary-color);
    width: 21.07rem;
    // height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  } */

    .logo {
      margin-left: 3.5rem;
      margin-top: 3rem;
      align-self: flex-start;
    }

    .wallets_panel {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      align-items: center;
      line-height: 1.5;
      width: 386px;
      margin-top: 50px;
      font-family: "OpenSans-Medium";
      .back {
        align-self: flex-start;
        display: flex;
        gap: 0.75rem;
        font-size: 1rem;
        cursor: pointer;
        .back_icon {
          font-size: 1.5rem;
        }
      }

      .item_connect {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-align: center;
        padding: 0.75rem 0;
        font-size: 1.5rem;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
      }
      .more_opt {
        display: flex;
        align-self: center;
        white-space: nowrap;
        width: min-content;
        cursor: pointer;
        gap: 6px;
        font-size: 1rem;
        .more_icon {
          font-size: 24px;
        }
      }
      .more_wallets {
        display: flex;
        gap: 1.25rem;
        width: 500px;
        max-width: 800px;
        justify-content: center;
        flex-wrap: wrap;
        .wallet_item {
          display: inline-block;
          width: 5.857rem;
          text-align: center;
          cursor: pointer;
          flex-shrink: 0;
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
      }
    }

    @media screen and (max-width: 1440px) {
      .links,
      .slog {
        font-size: 3.125rem !important;
        /* width: 40rem !important; */
        line-height: 4.25rem !important;
        /* padding-left: 2rem; */
      }
    }

    ${ScreenMobile} {
        .left_panel {
          .logo {
            margin: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 56px;
            background: #373737;
          }
          .tabs {
            position: absolute;
            left: 1rem;
            bottom: 2rem;
            top: unset;
            right: unset;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
          }
          .slog {
            white-space: pre-wrap;
            text-align: center;
          }
          .panel{
            padding: 0 1rem;
            .wallets_panel{
              max-width: 386px;
              width: 100%;
              .more_opt{
                display: none;
              }
            }
          }

        }
        .center_panel{
          display: none;
        }
        
    }
  ` as any
);
