import React, { useMemo } from "react";
import { Icon, Pagination, Table } from "semantic-ui-react";
import { useUserCrypto } from "../lib/crypto/useUserCrypto";
import { usePage } from "../lib/hooks/usePage";
import { SaveFile } from "../lib/types";
import FileItem from "./FileItem";
import { BaseProps } from "./types";
import styled from 'styled-components'
import { useRouter } from "next/router";

export interface Props extends BaseProps {
  pageCount?: number,
  files: SaveFile[],
  type?: 'public' | 'vault',
  onDeleteItem: (f: SaveFile) => void
}

export function filesTable(props: Props) {
  const {
    className,
    pageCount = 7,
    files,
    type = 'public',
    onDeleteItem
  } = props
  const r = useRouter()
  const isPublic = type === 'public'
  const mFiles = useMemo<SaveFile[]>(() => files.filter(
    (file) => type === 'public' ? !file.Encrypted : file.Encrypted
  ), [files, type])
  const localFiles = usePage(mFiles, pageCount)
  const uc = useUserCrypto()
  const footSpan = localFiles.totalPage > 1 ? 2 : 5
  const footerSpan = isPublic ? footSpan + 1 : footSpan
  return <Table basic={'very'} className={className}>
    <Table.Header className="font-sans-semibold">
      <Table.Row>
        <Table.HeaderCell>File Name</Table.HeaderCell>
        <Table.HeaderCell width="2" textAlign={"center"}>File CID</Table.HeaderCell>
        <Table.HeaderCell width="2" textAlign={"center"}>File Size</Table.HeaderCell>
        <Table.HeaderCell width="3" textAlign={"center"}>Status</Table.HeaderCell>
        <Table.HeaderCell width="2" textAlign={"center"}>Action</Table.HeaderCell>
        {isPublic && <Table.HeaderCell width="2" />}
      </Table.Row>
    </Table.Header>

    <Table.Body className="font-sans-regular">
      {
        localFiles.pageList.map((f, index) =>
          <FileItem
            type={type}
            onDelete={onDeleteItem}
            key={`files_item_${index}`}
            uc={uc}
            file={f}
          />)
      }
    </Table.Body>

    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan={footerSpan} className={"btns"}>
          <div className="files-tip">
            The file list is locally cached. If you want to keep this list when switching to another device, please go to <span onClick={() => r.push('/setting')}>{'Settings->User Data Management'}</span> to migrate your user data.
          </div>
          {/* <Popup
                  position={"top center"}
                  wide={'very'}
                  trigger={<span className="cru-fo-help-circle" style={{ fontSize: '1.3rem' }} />}
                  content={"Crust Files is a decentralized Application, and it will NEVER store your Upload History and File Encryption Key on any remote server. Instead, they are cached on your local devices. If you want to migrate your Upload History and File Encryption Key to a new device, use Export & Import function."} /> */}
        </Table.HeaderCell>
        {
          localFiles.totalPage > 1 && <Table.HeaderCell colSpan='3' textAlign={"right"}>
            <Pagination
              totalPages={localFiles.totalPage} activePage={localFiles.page}
              // firstItem={{content: <Icon name={"angle double left"}/>, icon: true}}
              // lastItem={{content: <Icon name={"angle double right"}/>, icon: true}}
              firstItem={null}
              lastItem={null}
              prevItem={{ content: <Icon name="angle left" />, icon: true }}
              nextItem={{ content: <Icon name="angle right" />, icon: true }}
              secondary
              onPageChange={(_, { activePage }) => localFiles.setPage(activePage as number)}
            />
          </Table.HeaderCell>
        }
      </Table.Row>
    </Table.Footer>
  </Table>
}

export const FilesTable = React.memo<Props>(styled(filesTable)`
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
      .files-tip {
        font-size: 13px;
        line-height: 22px;
        color: #999999;
        padding-left: 0.57rem;
        span {
          color: var(--primary-color);
        }
      }
    }
`)

export default FilesTable