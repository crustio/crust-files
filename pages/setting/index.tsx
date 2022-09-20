import classNames from 'classnames';
import FileSaver from 'file-saver';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionTitle, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { BindAirdrop } from '../../components/BindAirdrop';
import Btn from "../../components/Btn";
import ModalNewKey from "../../components/modal/ModalNewKey";
import PageUserSideLayout from '../../components/PageUserSideLayout';
import { AppContext } from "../../lib/AppContext";
import { parseUserCrypto, useUserCrypto } from "../../lib/crypto/useUserCrypto";
import { useClipboard } from "../../lib/hooks/useClipboard";
import { useGetDepost } from '../../lib/hooks/useGetDeposit';
import { useToggle } from "../../lib/hooks/useToggle";
import { ExportObj, SaveFile } from "../../lib/types";
import { useFilesInfo } from '../../lib/useFilesInfo';
import { useFiles, WalletName } from "../../lib/wallet/hooks";
export interface Props {
  className?: string
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

function Index(props: Props) {
  const { className } = props
  const { t } = useTranslation()
  const uc = useUserCrypto()
  const r = useRouter()
  const { alert } = useContext(AppContext)
  const [open, toggleOpen] = useToggle(false)
  const [showFileEncryption, toggleFileEncryption] = useToggle()
  useEffect(() => {
    if (uc.init && !uc.secret) toggleFileEncryption(true)
  }, [uc])
  const { user, isPremiumUser } = useGetDepost()
  const copy = useClipboard()
  const userType = useMemo(() => {
    if (isPremiumUser) return 'Premium User'
    return 'Trial User'
  }, [user, isPremiumUser])
  const isCrust = user.wallet === 'crust'
  const wFiles = useFiles();
  const { publicCount, publicSize, valutCount, valutSize} = useFilesInfo(wFiles);
  console.log('user::', user)

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

  return <PageUserSideLayout path={'/setting'} className={className}>
    <input
      onChange={_onInputImportFile}
      ref={importInputRef}
      style={{ display: 'none' }}
      type={'file'}
    />
    {
      open && <ModalNewKey
        alert={alert}
        size={'tiny'}
        open={true}
        toggleOpen={toggleOpen}
        onSuccess={uc.set}
      />
    }
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
      {
        isCrust && user.nickName && <div className="text font-sans-regular">
          {`${t('Nick Name:')} `}
          {<span className="bold-text font-sans-semibold">{user.nickName}</span>}
          {/* {!isCrust && <a className="" target="_blank" href="/docs/CrustFiles_Users" rel="noreferrer">Get a Nick Name</a>} */}
        </div>
      }
      <div className="text font-sans-regular">
        {`${t('User Type:')} `}
        <span className="bold-text font-sans-semibold">{userType}</span> {!isPremiumUser && <a onClick={() => r.push('/user')} rel="noreferrer">Get Premium</a>}
      </div>
      <div className="text font-sans-regular">
        {`${t('File/Folder Stored:')} `} <span className="bold-text font-sans-semibold">{`${publicCount} in Public, ${valutCount} in Vault`}</span>
      </div>
      <div className="text font-sans-regular">
        {`${t('Space Usage:')} `} <span className="bold-text font-sans-semibold">{`${publicSize} in Public, ${valutSize} in Vault`}</span>
      </div>
    </Segment>
    <Segment basic className={"mcard"}>
      <div className="title font-sans-semibold">
        {t('Developer Profile')}
      </div>
      <div className="text font-sans-regular">
        {`${t('Access token:')} `} <span className="bold-text font-sans-semibold" style={{ "wordBreak": 'break-all' }}>
          {user.authBasic}
          <span className="icon cru-fo-copy" onClick={() => copy(user.authBasic)} />
        </span>
      </div>
    </Segment>
    <Segment basic className={"mcard"}>
      {/* <div className="title font-sans-semibold">
        {t('User Data Management')}
      </div>
      <div className="text font-sans-regular">
        {`${t('Your user data (including three File Lists and one File Encryption Key) are cached on your local devices. If you want to migrate your user data to a new device, use Export & Import function.')} `}
        <span style={{ color: '#f47e6b' }}>Attention Please! If you want to switch device or explorer, please follow the following steps: 1) Export your user data from old device/explorer. 2) Log in to Crust Files in your new device/explorer. 3) Import the user data. 4) Enjoy Crust Files!</span>
      </div> */}
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
    <BindAirdrop />
  </PageUserSideLayout>
}

export default React.memo<Props>(styled(Index)`
  .pusl_center_flex_content {
    min-width: 60rem;
  }
  .mcard {
    padding: 1.71rem !important;
    box-shadow: 0 0.71rem 1.71rem 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 1.14rem !important;
    border: 0.07rem solid #EEEEEE !important;
    margin-top: 2.21rem;
  
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
