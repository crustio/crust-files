import FileSaver from 'file-saver';
import React, { useCallback, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";
import Btn from "../../components/Btn";
import ModalNewKey from "../../components/ModalNewKey";
import SideLayout from "../../components/SideLayout";
import User from "../../components/User";
import { AppContext } from "../../lib/AppContext";
import { useUserCrypto } from "../../lib/crypto/useUserCrypto";
import { useClipboard } from "../../lib/hooks/useClipboard";
import { useToggle } from "../../lib/hooks/useToggle";
import { SaveFile } from "../../lib/types";
import { LoginUser, useContextWrapLoginUser, useFiles } from "../../lib/wallet/hooks";

export interface Props {
  className?: string
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

const WalletName: { [k in LoginUser['wallet']]: string } = {
  "crust": 'Crust Wallet',
  "metamask": 'MetaMask',
  "metamask-Polygon": "MetaMask",
  "metamask-Moonriver": "MetaMask",
  "polkadot-js": "Polkadot Extension",
  "near": "Near Wallet",
  "elrond": "Elrond(Maiar Wallet)",
  "flow": "Flow Wallet",
  "solana": "Solana(Phantom Wallet)",
  "wallet-connect": "WalletConnect"
}

function Index(props: Props) {
  const { className } = props
  const { t } = useTranslation()
  const uc = useUserCrypto()
  const { alert } = useContext(AppContext)
  const [open, toggleOpen] = useToggle(false)
  const copy = useClipboard()
  const user = useContextWrapLoginUser()
  const wFiles = useFiles();

  const importInputRef = useRef<HTMLInputElement>(null);
  const _clickImport = useCallback(() => {
    if (!importInputRef.current) return;
    importInputRef.current.click();
  }, [importInputRef]);
  const _onInputImportFile = useCallback<FunInputFile>((e) => {
    try {
      const fileReader = new FileReader();
      const files = e.target.files;

      if (!files) return;
      fileReader.readAsText(files[0], 'UTF-8');

      if (!(/(.json)$/i.test(e.target.value))) {
        return alert.alert({ msg: t('File error'), type: 'error' });
      }

      fileReader.onload = (e) => {
        const _list = JSON.parse(e.target?.result as string) as SaveFile[];

        if (!Array.isArray(_list)) {
          return alert.alert({ msg: t('File content error'), type: 'error' });
        }

        const fitter: SaveFile[] = [];
        const mapImport: { [key: string]: boolean } = {};

        for (const item of _list) {
          if (item.Hash && item.Name && item.UpEndpoint && item.PinEndpoint) {
            fitter.push(item);
            mapImport[item.Hash] = true;
          }
        }

        const filterOld = wFiles.files.filter((item) => !mapImport[item.Hash]);

        wFiles.setFiles([...fitter, ...filterOld]);
        alert.alert({ msg: t('Import Success'), type: "success" })
      };
    } catch (e) {
      alert.alert({ msg: t('File content error'), type: "error" })
    }
  }, [wFiles, alert, t]);

  const _clickExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(wFiles.files)], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, 'files.json');
  }, [wFiles]);

  return <SideLayout path={'/setting'}>
    <Segment basic className={className}>
      <input
        onChange={_onInputImportFile}
        ref={importInputRef}
        style={{ display: 'none' }}
        type={'file'}
      />
      <User />
      {
        open && <ModalNewKey
          alert={alert}
          size={'tiny'}
          open={true}
          toggleOpen={toggleOpen}
          onSuccess={uc.set}
        />
      }
      <Segment basic className="mcontent">
        <Segment basic className={"mcard"}>
          <div className="title font-sans-semibold">
            {t('User Profile')}
          </div>
          <div className="text font-sans-regular">
            {`${t('Web3 Identity Logged-in:')} `}
            <span className="bold-text font-sans-semibold">{user.account}</span>
          </div>
          <div className="text font-sans-regular">
            {`${t('Logged-in Wallet:')} `}
            <span className="bold-text font-sans-semibold">{WalletName[user.wallet]}</span>
          </div>
          <div className="text font-sans-regular">
            {`${t('Nick Name:')} `}
            {user.nickName && <span className="bold-text font-sans-semibold">{user.nickName}</span>}
            {!user.nickName && <a className="" target="_blank" href="https://hhhhhh" rel="noreferrer">Get a Nick Name</a>}
          </div>
          <div className="text font-sans-regular">
            {`${t('User Type:')} `}
            {<span className="bold-text font-sans-semibold">{user.userType}</span>}
            {!user.userType && <a target="_blank" href="https://hhhhh" rel="noreferrer">Get a Premium</a>}
          </div>
        </Segment>
        <Segment basic className={"mcard"}>
          <div className="title font-sans-semibold">
            {t('User Data Management')}
          </div>
          <div className="text font-sans-regular">
            {`${t('Your user data (including three File Lists and one File Encryption Key) are cached on your local devices. If you want to migrate your user data to a new device, use Export & Import function.')} `}
          </div>
          <div className={'btns'}>
            <Btn content={t('Export')} onClick={_clickExport} />
            <Btn content={t('Import')} onClick={_clickImport} />
          </div>
        </Segment>
        <Segment basic className={"mcard"}>
          <div className="title font-sans-semibold">
            {t('File Encryption')}
          </div>
          {
            uc.secret && <div className="text font-sans-regular">
              {`${t('Your File Encryption Key:')} `}
              <span className="bold-text font-sans-semibold">{uc.secret}</span>
            </div>
          }
          {
            uc.seeds && <div className="text font-sans-regular">
              {`${t('Seed Phrase:')} `}
              <span className="bold-text font-sans-semibold">{uc.seeds}</span>
            </div>
          }
          <div className={'btns'}>
            {
              uc.secret ? <Btn content={t('Copy')} onClick={() => copy(uc.seeds)} /> :
                <>
                  <Btn content={t('Generate new')} onClick={uc.generate} />
                  <Btn content={t('Input a new key')} onClick={() => toggleOpen(true)} />
                </>
            }
          </div>
        </Segment>
      </Segment>
    </Segment>
  </SideLayout>
}

export default React.memo<Props>(styled(Index)`
  padding: unset !important;
  .mcontent {
    margin: unset !important;
    padding: 0 0 3rem 0 !important;
    overflow: auto;
  }
  .mcard {
    padding: 1.71rem !important;
    box-shadow: 0 0.71rem 1.71rem 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 1.14rem !important;
    border: 0.07rem solid #EEEEEE !important;
    margin: 2.21rem 2.29rem 0 2.39rem !important;
  
    .title {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--main-color);
      padding-bottom: 1.14rem;
      .cru-fo {
        margin-right: 0.8rem;
      }
    }

    .text {
      font-size: 1rem;
      color: var(--secend-color);
      line-height: 1.57rem;
    }

    .bold-text {
      color: var(--main-color);
    }
    
    a {
      text-decoration: underline;
      line-height: 1.2rem;
    }

    .btns {
      margin-top: 1.7rem;
      button:first-child {
        margin-right: 1rem;
      }
    }
  }

`)
