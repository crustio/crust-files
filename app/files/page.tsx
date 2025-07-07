'use client'

import { BtnUpload } from "@/components/BtnUpload";
import FilesTable from "@/components/FilesTable";
import UploadModal from "@/components/modal/UploadModal";
import { OnDrapDropFrame } from "@/components/OnDrapDropFrame";
import PageUserSideLayout from "@/components/PageUserSideLayout";
import { ScreenMobile } from "@/lib/config";
import { useUserCrypto } from "@/lib/crypto/useUserCrypto";
import { useGetDepost } from "@/lib/hooks/useGetDeposit";
import useInputFile from "@/lib/hooks/useInputFile";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useFilesInfo } from "@/lib/useFilesInfo";
import { useFiles } from "@/lib/wallet/hooks";
import { FileInfo, SaveFile } from "@/lib/wallet/types";
import React, { useCallback } from "react";
import { Popup } from "semantic-ui-react";
import styled from "styled-components";

function Index(p: { className?: string }) {
  const wFiles = useFiles();
  const uc = useUserCrypto()
  const wInputFile = useInputFile()
  const { isPremiumUser, user } = useGetDepost()

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
    wInputFile.setFile(info)
  }
  const { publicCount, publicSize } = useFilesInfo(wFiles)
  const isMobile = useIsMobile()
  return <PageUserSideLayout path="/files" className={p.className}>
    <OnDrapDropFrame onDrop={_onDrop} />
    <div className="uploadPanel">
      <input
        onChange={wInputFile._onInputFile}
        ref={wInputFile.inputRef as any}
        style={{ display: 'none' }}
        type={'file'}
      />
      <div className={'upSlog'}>
        <div>
          <div className="title">Public</div>
          <Popup
            position={"top center"}
            trigger={<span className="helper cru-fo-help-circle" />}
            content={'Your files will be just as they were meant to be. No encryption, open access for all. Great for storing and sharing non-sensitive files.'} />
        </div>
        <div className="content font-sans-regular">File/Folder Stored: {publicCount}<span style={{ marginLeft: '4rem' }} />Space Usage: {publicSize}</div>
      </div>
      <BtnUpload
        onClickUpFile={wInputFile._onClickUpFile}
        onClickUpFolder={isMobile ? undefined : wInputFile._onClickUpFolder}
      />
      {
        wInputFile.file && <UploadModal
          isPremium={isPremiumUser}
          type="public"
          file={wInputFile.file}
          user={user}
          onClose={_onClose}
          onSuccess={_onSuccess}
          uc={uc}
        />
      }
    </div>
    <div className="line" />
    <FilesTable files={wFiles.files} onDeleteItem={wFiles.deleteItem} />
  </PageUserSideLayout >
}

export default styled(Index)`

  .line {
    margin: 0 2.3rem;
    border-bottom: solid 1px var(--line-color);
  }
  
  .uploadPanel {
    font-family: OpenSans-SemiBold;
    width: 100%;
    justify-content: space-between;
    white-space: pre-wrap;
    flex-wrap: wrap;
    gap: 20px;
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
  }
  ${ScreenMobile} {
    .uploadPanel{
      padding: 16px;
      box-shadow: 0px 0px 16px 0px #0000001A;
      border-radius: 12px;
    }
    .line{
      margin: 10px 0;
      border-bottom: none;
    }
  }
` as any
