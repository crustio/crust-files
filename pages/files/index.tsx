import React, {useCallback, useContext, useRef, useState} from "react";
import {useContextWrapLoginUser, useFiles} from "../../lib/wallet/hooks";
import {Icon, Pagination, Popup, Segment, Table, Transition} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {DirFile, FileInfo, SaveFile} from "../../lib/wallet/types";
import SideLayout from "../../components/SideLayout";
import FileSaver from 'file-saver';
import UploadModal from "../../components/UploadModal";
import Btn from "../../components/Btn"
import {AppContext} from "../../lib/AppContext";
import User from "../../components/User";
import {usePage} from "../../lib/hooks/usePage";
import FileItem from "../../components/FileItem";
import styled from "styled-components";
import {useUserCrypto} from "../../lib/crypto/useUserCrypto";
import {useAutoToggle} from "../../lib/hooks/useAutoToggle";

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void


function Index(p: { className?: string }) {
  const user = useContextWrapLoginUser()
  const {t} = useTranslation();
  const {alert} = useContext(AppContext)
  const [showUpMode, setShowUpMode] = useState(false);
  const wFiles = useFiles();
  const localFiles = usePage(wFiles.files, 7)
  const [file, setFile] = useState<FileInfo | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const uc = useUserCrypto()

  const _clickUploadFile = useCallback((dir = false) => {
    if (!inputRef.current) return;
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    inputRef.current.webkitdirectory = dir;
    // eslint-disable-next-line
    inputRef.current.multiple = dir;
    inputRef.current.click();
  }, [inputRef]);
  const onClickUpFile = useCallback(() => _clickUploadFile(false), [_clickUploadFile]);
  const onClickUpFolder = useCallback(() => _clickUploadFile(true), [_clickUploadFile]);
  const _onInputFile = useCallback<FunInputFile>((e) => {
    const files = e.target.files;

    if (!files) return;

    if (files.length > 2000) {
      alert.alert({
        title: t('Upload'),
        msg: t('Please do not upload more than 2000 files'),
        type: 'error'
      })
      return;
    }

    if (files.length === 0) {
      alert.alert({
        title: t('Upload'),
        msg: t('Please select non-empty folder'),
        type: 'error'
      })
      return;
    }

    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    const isDirectory = e.target.webkitdirectory;

    if (!isDirectory) {
      setFile({file: files[0]});
      setShowUpMode(true);
    } else if (files.length >= 1) {
      const dirFiles: DirFile[] = [];
      for (let index = 0; index < files.length; index++) {
        // console.info('f:', files[index]);
        dirFiles.push(files[index] as DirFile);
      }

      console.info(dirFiles);

      const [dir] = dirFiles[0].webkitRelativePath.split('/');

      setFile({files: dirFiles, dir});
      setShowUpMode(true);
    }

    e.target.value = '';
  }, [setFile, setShowUpMode, alert, t]);

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
        return alert.alert({msg: t('File error'), type: 'error'});
      }

      fileReader.onload = (e) => {
        const _list = JSON.parse(e.target?.result as string) as SaveFile[];

        if (!Array.isArray(_list)) {
          return alert.alert({msg: t('File content error'), type: 'error'});
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
        alert.alert({msg: t('Import Success'), type: "success"})
      };
    } catch (e) {
      alert.alert({msg: t('File content error'), type: "error"})
    }
  }, [wFiles, alert, t]);

  const _onClose = useCallback(() => {
    setShowUpMode(false);
  }, []);

  const _onSuccess = useCallback((res: SaveFile) => {
    setShowUpMode(false);
    const filterFiles = wFiles.files.filter((f) => f.Hash !== res.Hash);

    wFiles.setFiles([res, ...filterFiles]);
  }, [wFiles]);

  const _export = useCallback(() => {
    const blob = new Blob([JSON.stringify(wFiles.files)], {type: 'application/json; charset=utf-8'});

    FileSaver.saveAs(blob, 'files.json');
  }, [wFiles]);

  const visibleFile = useAutoToggle(2000)
  const visibleFolder = useAutoToggle(1800)

  return <SideLayout path={'/files'}>
    <Segment basic className={p.className}>
      <User/>
      <Segment basic className="contentPanel">
        <Segment basic textAlign={'center'} className={"font-sans-semibold uploadPanel"}>
          <input
            onChange={_onInputFile}
            ref={inputRef}
            style={{display: 'none'}}
            type={'file'}
          />
          <input
            onChange={_onInputImportFile}
            ref={importInputRef}
            style={{display: 'none'}}
            type={'file'}
          />
          <div className={'upSlog'}>
            Upload and Store
            your File or Folder to IPFS
            via <a target='_blank' href={"https://apps.crust.network"} rel="noreferrer">Crust</a>’s decentralized
            storage network.
          </div>
          <div className="btns">
            <Transition animation={'pulse'} duration={500} visible={visibleFile}>
            <span className={"btn file"} onClick={onClickUpFile}>
              <span className="cru-fo cru-fo-file"/> <br/>
              File
          </span>
            </Transition>
            <Transition animation={'pulse'} duration={500} visible={visibleFolder}>
            <span className={"btn folder"} onClick={onClickUpFolder}>
              <span className="cru-fo cru-fo-folder"/> <br/>
              Folder
            </span>
            </Transition>
          </div>
          {
            showUpMode && <UploadModal
              file={file}
              user={user}
              onClose={_onClose}
              onSuccess={_onSuccess}
              uc={uc}
            />
          }
        </Segment>
        <div className="line"/>
        <Table basic={'very'}>
          <Table.Header className="font-sans-semibold">
            <Table.Row>
              <Table.HeaderCell>File Name</Table.HeaderCell>
              <Table.HeaderCell textAlign={"center"}>File CID</Table.HeaderCell>
              <Table.HeaderCell textAlign={"center"}>File Size</Table.HeaderCell>
              <Table.HeaderCell textAlign={"center"}>Status</Table.HeaderCell>
              <Table.HeaderCell textAlign={"center"}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body className="font-sans-regular">
            {
              localFiles.pageList.map((f, index) =>
                <FileItem
                  key={`files_item_${index}`}
                  uc={uc}
                  file={f}
                />)
            }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={localFiles.totalPage > 1 ? 2 : 5} className={"btns"}>
                <Btn onClick={_clickImport}>Import</Btn>
                <Btn onClick={_export}>Export</Btn>
                <Popup
                  position={"top center"}
                  wide={'very'}
                  trigger={<span className="cru-fo-help-circle" style={{fontSize: '1.3rem'}}/>}
                  content={"Crust Files is a decentralized Application, and it will NEVER store your Upload History and File Encryption Key on any remote server. Instead, they are cached on your local devices. If you want to migrate your Upload History and File Encryption Key to a new device, use Export & Import function."}/>
              </Table.HeaderCell>
              {
                localFiles.totalPage > 1 && <Table.HeaderCell colSpan='3' textAlign={"right"}>
                  <Pagination
                    totalPages={localFiles.totalPage} activePage={localFiles.page}
                    // firstItem={{content: <Icon name={"angle double left"}/>, icon: true}}
                    // lastItem={{content: <Icon name={"angle double right"}/>, icon: true}}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{content: <Icon name="angle left"/>, icon: true}}
                    nextItem={{content: <Icon name="angle right"/>, icon: true}}
                    secondary
                    onPageChange={(_, {activePage}) => localFiles.setPage(activePage as number)}
                  />
                </Table.HeaderCell>
              }
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    </Segment>
  </SideLayout>
}

export default React.memo(styled(Index)`
  padding: unset !important;
  display: flex;
  flex-direction: column;
  align-items: center;

  .contentPanel {
    max-width: 100rem;
    width: 100%;
    margin: unset !important;
    padding: unset !important;
  }

  .table {
    padding: 1rem 2rem;
    width: 100%;
    thead {
      font-size: 1.29rem;
      font-weight: 600;

      th:first-child {
        padding-left: 0.57rem !important;
      }

      th {
        border-bottom: unset !important;
      }
    }

    tbody {
      color: var(--secend-color);

      tr, td {
        border-top: unset !important;
      }

      tr > td:first-child {
        padding-left: 0.57rem !important;
      }

      tr:nth-child(2n - 1) {
        background-color: #f8f8f8;

        td:first-child {
          overflow: hidden;
          border-top-left-radius: 0.57rem;
          border-bottom-left-radius: 0.57rem;
        }

        td:last-child {
          overflow: hidden;
          border-top-right-radius: 0.57rem;
          border-bottom-right-radius: 0.57rem;
        }
      }
    }

    tfoot {
      .btns > button {
        margin-right: 1rem !important;
      }

      th {
        border-top: unset !important;
      }

      .btns {
        span {
          cursor: pointer;
          color: #808080;
        }
      }

      .btns > i {
        color: var(--secend-color);
        cursor: pointer;
      }

      .pagination > .item {
        color: var(--secend-color);
        padding: 0.8rem 1rem !important;
        min-width: unset !important;
        border-radius: 5rem !important;
        margin: unset;
      }
    }
  }

  .line {
    margin: 0 2.3rem;
    border-bottom: solid 1px var(--line-color) !important;
  }
  
  .uploadPanel {
    width: 100%;
    justify-content: space-between;
    font-size: 4rem !important;
    font-weight: 600;
    margin: unset !important;
    white-space: pre-wrap;
    padding: 2.5rem 2.3rem;
    color: var(--main-color);
    display: flex;
    align-items: center;

    .upSlog {
      margin: unset !important;
      display: inline-block;
      cursor: default;
      font-size: 2.8rem;
      padding-right: 1rem;
      max-width: 50rem;
      min-width: 24rem;
      white-space: pre-wrap;
      line-height: 3.8rem;
      text-align: left;
      vertical-align: top;

      a {
        text-decoration: unset;
        color: var(--primary-color);
      }
    }

    .btns {
      display: inline-block;
      flex-shrink: 0;
    }

    .btn {
      vertical-align: top;
      line-height: 4.43rem;
      display: inline-block;
      width: 16rem;
      height: 15rem;
      font-size: 3.3rem;
      text-align: center;
      border-radius: 50px;
      cursor: pointer;
      padding: 3rem 0;
      //transition: all ease-in-out 2s;
      .cru-fo {
        font-size: 4rem;
      }
    }

    .btn:first-child {
      margin-right: 1.6rem;
    }

    .file {
      background: rgba(255, 141, 0, 0.1);
      margin-right: 1rem;

      &:hover {
        background: rgba(255, 141, 0, 0.2);
        box-shadow: 0 0.14rem 1.43rem 0 rgba(0, 0, 0, 0.1);
      }
    }

    .folder {
      background: rgba(86, 203, 143, 0.1);

      &:hover {
        background: rgba(86, 203, 143, 0.2);
        box-shadow: 0 0.14rem 1.43rem 0 rgba(0, 0, 0, 0.1);
      }
    }
  }

`)
