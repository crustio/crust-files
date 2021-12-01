import classNames from 'classnames';
import FileSaver from 'file-saver';
import React, { useCallback, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionTitle, Segment } from "semantic-ui-react";
import styled from "styled-components";
import Btn from "../../components/Btn";
import ModalNewKey from "../../components/ModalNewKey";
import SideLayout from "../../components/SideLayout";
import User from "../../components/User";
import { AppContext } from "../../lib/AppContext";
import { parseUserCrypto, useUserCrypto } from "../../lib/crypto/useUserCrypto";
import { useClipboard } from "../../lib/hooks/useClipboard";
import { useToggle } from "../../lib/hooks/useToggle";
import { ExportObj, SaveFile } from "../../lib/types";
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
  const [showFileEncryption, toggleFileEncryption] = useToggle()
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
        return alert.error(t('File error'));
      }

      fileReader.onload = (e) => {

        const data = JSON.parse(e.target?.result as string) as (SaveFile[] | ExportObj);
        const nExportObj: ExportObj = { files: [] }
        if (Array.isArray(data)) {
          nExportObj.files = data
        } else if (data.files && Array.isArray(data.files)) {
          nExportObj.secret = data.secret
          nExportObj.files = data.files
        } else {
          return alert.error(t('File content error'));
        }

        if (uc.secret && nExportObj.secret && nExportObj.secret !== uc.secret) {
          return alert.error("Two secrets were found, and they are different.")
        }
        if (nExportObj.secret) {
          const userCrypto = parseUserCrypto(nExportObj.secret)
          if (userCrypto) {
            uc.set(userCrypto)
          }
        }

        const fitter: SaveFile[] = [];
        const mapImport: { [key: string]: boolean } = {};

        for (const item of nExportObj.files) {
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
  }, [wFiles, uc.set, alert, t]);

  const _clickExport = useCallback(() => {
    const exportObj: ExportObj = {
      files: wFiles.files,
      secret: uc.secret
    }
    const blob = new Blob([JSON.stringify(exportObj)], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, 'backup.json');
  }, [wFiles, uc]);

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
          <Accordion>
            <AccordionTitle active={showFileEncryption} onClick={() => toggleFileEncryption()}>
              <div className="title font-sans-semibold">
                {t('File Encryption')}<span className={classNames('icon', showFileEncryption ? 'cru-fo-chevron-up' : 'cru-fo-chevron-down')} />
              </div>
            </AccordionTitle>
            <AccordionContent active={showFileEncryption} className="no-padding">
              <div className="text font-sans-regular">
                {`${t('Your File Encryption Key:')} `}
                {
                  uc.secret && <span className="bold-text font-sans-semibold">
                    {uc.secret}
                    <span className="icon cru-fo-copy" onClick={() => copy(uc.secret)} />
                  </span>}
                {
                  !uc.secret && <a onClick={uc.generate}>Generate a New</a>
                }
              </div>
              {
                uc.seeds && <div className="text font-sans-regular">
                  {`${t('Seed Phrase:')} `}
                  <span className="bold-text font-sans-semibold">
                    {uc.seeds}
                  </span>
                </div>
              }
            </AccordionContent>
          </Accordion>
          <div className={'btns'}>
            <Btn content={t('Export')} onClick={_clickExport} />
            <Btn content={t('Import')} onClick={_clickImport} />
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
      font-size: 1.3rem !important;
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
    .icon {
      margin-left: 1rem;
      font-size: 1.428571rem;
      position: relative;
      top: 3px;
      cursor: pointer;
    }
    .bold-text {
      color: var(--main-color);
    }
    
    a {
      text-decoration: underline;
      line-height: 1.2rem;
      cursor: pointer;
    }

    .btns {
      margin-top: 1.7rem;
      button:first-child {
        margin-right: 1rem;
      }
    }
  }

`)
