import React, { useMemo } from "react";
import { Icon, Pagination, Table } from "semantic-ui-react";
import { useUserCrypto } from "../lib/crypto/useUserCrypto";
import { usePage } from "../lib/hooks/usePage";
import { SaveFile } from "../lib/types";
import FileItem from "./FileItem";
import { BaseProps } from "./types";
import styled from 'styled-components'
import { useRouter } from "next/navigation";
import { ScreenMobile } from "../lib/config";
import { useIsMobile } from "../lib/hooks/useIsMobile";

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
  const isMobile = useIsMobile()
  const isPublic = type === 'public'
  const mFiles = useMemo<SaveFile[]>(() => files.filter(
    (file) => type === 'public' ? !file.Encrypted : file.Encrypted
  ), [files, type])
  const localFiles = usePage(mFiles, pageCount)
  const uc = useUserCrypto()
  const footSpan = localFiles.totalPage > 1 ? 2 : 5
  const footerSpan = isPublic ? footSpan + 1 : footSpan
  return <div className={className}>
    <table>
      <thead className="font-sans-semibold">
        <tr>
          <th>File Name</th>
          <th>File CID</th>
          <th>File Size</th>
          <th>Status</th>
          <th>Action</th>
          {isPublic && <th />}
        </tr>
      </thead>

      <tbody className="font-sans-regular">
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
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={footerSpan} className={"btns"}>
            <div className="files-tip">
              The file list is locally cached. If you want to keep this list when switching to another device, please go to <span onClick={() => r.push('/setting')}>{'Settings->User Data Management'}</span> to migrate your user data.
            </div>
          </td>
          {
            localFiles.totalPage > 1 && <td colSpan={3}>
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
            </td>
          }
        </tr>
      </tfoot>
    </table>
  </div>
}

export const FilesTable = React.memo<Props>(styled(filesTable)`
    padding: 1rem 2rem;
    width: 100%;
    thead {
      font-size: 1.29rem;
      font-weight: 600;

      th:first-child {
        padding-left: 0.57rem;
        text-align: left;
      }

      th {
        padding-bottom: .8em;
        border-bottom: unset;
      }
    }
    table {
      border-spacing: 0;
      min-width: 100%;
    }
    tbody {
      color: var(--secend-color);

      tr > td {
        padding: .785em;
      }

      tr > td:first-child {
        padding-left: 0.57rem;
      }

      tr:nth-child(2n - 1) {
        background-color: #f8f8f8;

        td:first-child {
          overflow: hidden;
          border-top-left-radius: 0.57rem;
          border-bottom-left-radius: 0.57rem;
          text-align: left;
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
      tr > td {
        padding: 8px 0;
        border-top: solid 1px var(--line-color);
        border-bottom: solid 1px var(--line-color);
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
    ${ScreenMobile} {
      overflow-x: auto;
      padding: 16px;
      box-shadow: 0px 0px 16px 0px #0000001A;
      border-radius: 12px;
      table {
       min-width: 600px;
      }
      tfoot > tr {
        border-top: none;
        border-bottom: none;
      }
    }
` as any)

export default FilesTable