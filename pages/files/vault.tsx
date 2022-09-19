import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Popup, Segment } from "semantic-ui-react";
import styled from "styled-components";
import { BtnUpload } from "../../components/BtnUpload";
import FilesTable from "../../components/FilesTable";
import UploadModal from "../../components/modal/UploadModal";
import { OnDrapDropFrame } from "../../components/OnDrapDropFrame";
import PageUserSideLayout from "../../components/PageUserSideLayout";
import { useUserCrypto } from "../../lib/crypto/useUserCrypto";
import { useGetDepost } from "../../lib/hooks/useGetDeposit";
import useInputFile from "../../lib/hooks/useInputFile";
import { useFilesInfo } from "../../lib/useFilesInfo";
import { useFiles } from "../../lib/wallet/hooks";
import { FileInfo, SaveFile } from "../../lib/wallet/types";

function Vault(p: { className?: string }) {

  const wFiles = useFiles();
  const uc = useUserCrypto()
  const wInputFile = useInputFile()
  const { isPremiumUser, user } = useGetDepost()
  const r = useRouter()

  const _onClose = () => wInputFile.setFile(undefined);
  const _onSuccess = useCallback((res: SaveFile) => {
    wInputFile.setFile(undefined)
    const filterFiles = wFiles.files.filter((f) => f.Hash !== res.Hash);
    wFiles.setFiles([res, ...filterFiles]);
  }, [wFiles]);
  const _onDrop = (info: FileInfo) => {
    if (!info) return
    if (!info.dir && info.files && info.files.length > 1) {
      return
    }
    if (!info.file) return
    wInputFile.setFile(info)
  }
  const noSecret = uc.init && !uc.secret
  const disabledUpload = noSecret
  const { valutCount, valutSize } = useFilesInfo(wFiles)

  return <PageUserSideLayout path={'/files/vault'} className={p.className}>
    <OnDrapDropFrame onDrop={_onDrop} />
    <Segment basic textAlign={'center'} className={"font-sans-semibold uploadPanel"}>
      <input
        onChange={wInputFile._onInputFile}
        ref={wInputFile.inputRef}
        style={{ display: 'none' }}
        type={'file'}
      />
      <div className={'upSlog'}>
        <div>
          <div className="title">Vault</div>
          <Popup
            position={"top center"}
            trigger={<span className="helper cru-fo-help-circle" />}
            content={'This is your personal file vault which is 100% private, 100% secure and 100% owned by YOU. Every file will be encrypted by a locally-stored encryption key.'} />
        </div>

        <div className="content font-sans-regular">File/Folder Stored: {valutCount}<span style={{ marginLeft: '4rem' }} />Space Usage: {valutSize}</div>
      </div>
      <div className="btn-upload-panel">
        <BtnUpload
          disabled={disabledUpload}
          onClickUpFile={() => !disabledUpload && wInputFile._onClickUpFile()}
        // onClickUpFolder={wInputFile._onClickUpFolder}
        />
        {/* {!isPremiumUser && <div className="unValut">Get <span onClick={() => r.push('/user')}>Premium</span> to Unlock.</div>} */}
        {isPremiumUser && noSecret && <div className="unValut">Set your <span onClick={() => r.push('/setting')}>Encryption Key</span> first.</div>}
      </div>

      {
        wInputFile.file && <UploadModal
          isPremium={true}
          type="vault"
          file={wInputFile.file}
          user={user}
          onClose={_onClose}
          onSuccess={_onSuccess}
          uc={uc}
        />
      }
    </Segment>
    <div className="line" />
    <FilesTable type="vault" files={wFiles.files} onDeleteItem={wFiles.deleteItem} />
  </PageUserSideLayout>
}

export default React.memo(styled(Vault)`

  .line {
    margin: 0 2.3rem;
    border-bottom: solid 1px var(--line-color) !important;
  }
  
  .uploadPanel {
    width: 100%;
    justify-content: space-between;
    margin: unset !important;
    white-space: pre-wrap;
    padding: 3.14rem 2.3rem 4.2857rem 2.3rem;
    color: var(--main-color);
    display: flex;
    align-items: flex-end;

    .upSlog {
      display: inline-block;
      cursor: default;
      padding-right: 1rem;
      max-width: 58rem;
      min-width: 24rem;
      text-align: left;
      .title {
        display: inline-block;
        font-family: OpenSans-SemiBold;
        font-size: 3.2857rem;
        line-height: 4.285714rem;
        border-bottom: 5px solid #92D8F7;
      }
      .helper {
        font-size: 2.2rem;
        margin-left: 1rem;
        cursor: pointer;
      }
      .content {
        font-size: 1.7rem;
        line-height: 2.357143rem;
        white-space: pre-wrap;
        margin-top: 1.857143rem;
      }
    }
    .btn-upload-panel {
      .unValut {
        font-size: 16px;
        line-height: 18px;
        font-family: OpenSans-SemiBold;
        margin-top: 8px;
        span {
          cursor: pointer;
          text-decoration: underline;
          color: var(--primary-color)
        }
      }
    }
  }

`)
