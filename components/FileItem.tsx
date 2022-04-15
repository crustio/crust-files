import { BlockNumber } from "@polkadot/types/interfaces/types";
import axios from "axios";
import { saveAs } from 'file-saver';
import filesize from "filesize";
import _ from 'lodash';
import React, { useCallback, useContext, useMemo } from "react";
import { Icon, Popup, Table } from "semantic-ui-react";
import styled from "styled-components";
import { AppContext } from "../lib/AppContext";
import { AuthIpfsEndpoint } from "../lib/config";
import { decryptFile } from "../lib/crypto/encryption";
import { WrapUserCrypto } from "../lib/crypto/useUserCrypto";
import { useCall } from "../lib/hooks/useCall";
import { useClipboard } from "../lib/hooks/useClipboard";
import { report } from "../lib/http/report";
import { createShortUrl } from "../lib/http/share_earn";
import { useAuthGateway } from "../lib/useAuth";
import { getErrorMsg, shortStr } from "../lib/utils";
import { useContextWrapLoginUser, WrapLoginUser } from "../lib/wallet/hooks";
import { SaveFile } from "../lib/wallet/types";
import Btn from "./Btn";
import { isFunction } from '@polkadot/util';

export interface Props {
  type?: 'public' | 'vault',
  className?: string,
  file: SaveFile,
  uc: WrapUserCrypto,
  onDelete: (f: SaveFile) => void
}

type Status = 'Loading' | 'Submitted' | 'Expired' | 'Success' | 'Failed';

export interface FileStat {
  status: Status
  expireTime?: number
  amount?: number
  startTime?: number
  fileSize?: number
  confirmedReplicas?: number
  prepaid?: boolean
}

function createUrl(f: SaveFile, endpoints: AuthIpfsEndpoint[]) {
  const p = endpoints.find((e) => e.value === f.UpEndpoint);
  const endpoint = (p && p.value) || endpoints[0].value;

  return `${endpoint}/ipfs/${f.Hash}?filename=${f.Name}`;
}

// function createShareOrReceiveUrl(file: SaveFile, user: WrapLoginUser, receive = false) {
//   const options: ShareOptions = {
//     name: file.Name,
//     encrypted: file.Encrypted,
//     gateway: file.UpEndpoint,
//     fromAccount: user.account,
//     fromWallet: user.wallet,
//     from: user.nickName,
//     isDir: !!file.items,
//   }
//   report({
//     type: 3,
//     walletType: user.wallet,
//     address: user.account,
//     data: {
//       cid: file.Hash,
//       fileType: file.items ? 1 : 0,
//       strategy: file.Encrypted ? 1 : 0,
//       shareType: 0
//     }
//   })
//   const str = encodeURI(JSON.stringify(options))
//   return receive ? `${window.location.origin}/files/receive?cid=${file.Hash}&options=${str}` : `${window.location.origin}/files/share?cid=${file.Hash}&options=${str}`;
// }

async function createShare(file: SaveFile, user: WrapLoginUser) {
  const code = await createShortUrl(file.Hash, {
    name: file.Name,
    encrypted: file.Encrypted,
    gateway: file.UpEndpoint,
    fromAccount: user.account,
    fromWallet: user.wallet,
    from: user.nickName,
    isDir: !!file.items,
  })
  report({
    type: 3,
    walletType: user.wallet,
    address: user.account,
    data: {
      cid: file.Hash,
      fileType: file.items ? 1 : 0,
      strategy: file.Encrypted ? 1 : 0,
      shareType: 0
    }
  })
  return `${window.location.origin}/share?code=${code}`
}

function parseStat(stat: any) {
  try {
    return JSON.parse(JSON.stringify(stat))
  } catch (e) {
    return {
      expired_at: 0,
      reported_replica_count: 0,
      amount: 0,
      file_size: 0,
      prepaid: false,
    }
  }
}

//
const FailedTime = 2 * 60 * 60 * 1000

function FileItem(props: Props) {
  const { file, className, uc, onDelete, type = 'public' } = props;
  const isPublic = type === 'public';
  const copy = useClipboard();
  const { api, alert, loading } = useContext(AppContext)
  const { endpoints } = useAuthGateway()
  const _onClickDelete = () => { onDelete(file) }
  const _onClickOpen = useCallback(async () => {
    if (file.Encrypted && _.size(file.items) === 0) {
      try {
        if (!uc.secret) return;
        loading.show()
        const res = await axios.get<ArrayBuffer>(createUrl(file, endpoints), { responseType: "arraybuffer" })
        console.info('res::', res)
        const time1 = new Date().getTime()
        const decryptData = await decryptFile(res.data, uc.secret)
        console.info('decrypt:', (new Date().getTime() - time1) / 1000)
        if (!decryptData) {
          throw 'error'
        }
        console.info('de:', decryptData)
        const saveFile = new File([decryptData], file.Name, { type: res.headers['content-type'] })
        saveAs(saveFile, file.Name)
        loading.hide()
      } catch (e) {
        loading.hide()
        alert.error("Decrypt error")
      }
    } else {
      window.open(createUrl(file, endpoints), '_blank')
    }
  }, [uc, file, endpoints])
  const _onClickSearch = () => {
    window.open(`https://ipfs-scan.io?cid=${file.Hash}`, '_blank')
  }
  // const _onClickCopy = useCallback(() => copy(createUrl(file, endpoints)), [file, endpoints])
  // const r = useRouter()
  const user = useContextWrapLoginUser()
  const _onClickShare = async () => {
    try {
      const shareUrl = await createShare(file, user)
      window.open(shareUrl, '_blank')
    } catch (error) {
      alert.error(getErrorMsg(error))
    }
  }
  const _onClickTweet = async () => {
    try {
      const shareUrl = await createShare(file, user);
      const text = user.nickName ?
        `Check out what '${user.nickName}' is sharing on Crust Files!` :
        `Check out what I am sharing on Crust Files!`;
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURI(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=web3,ipfs,crustnetwork,metaverse,crustfiles`;
      window.open(tweetUrl, '_blank');
    } catch (error) {
      alert.error(getErrorMsg(error))
    }
  }

  const queryFileApiV2 = api && api.query?.market && (isFunction(api.query.market.filesV2) ? api.query.market.filesV2 : api.query.market.files)
  const queryFileApiV1 = api && api.query?.market && api.query.market.files;
  const hasQueryFileApi = !!queryFileApiV2
  const statV2 = useCall<{ isEmpty: boolean } | undefined | null>(queryFileApiV2, [file.Hash])
  const statV1 = useCall<{ isEmpty: boolean } | undefined | null>(queryFileApiV1, [file.Hash])
  const bestNum = useCall<BlockNumber>(api?.derive?.chain?.bestNumber);
  const bestNumber = bestNum && bestNum.toNumber()
  const fileStat = useMemo<FileStat>(() => {
    const fStat: FileStat = { status: 'Submitted' }
    if (statV1 && !statV1.isEmpty) {
      const {
        expired_at,
        reported_replica_count,
        amount,
        file_size,
        prepaid,
      } = parseStat(statV1)
      fStat.expireTime = expired_at;
      fStat.amount = amount;
      fStat.startTime = expired_at ? expired_at - 216000 : 0;
      fStat.fileSize = file_size;
      fStat.confirmedReplicas = reported_replica_count;
      fStat.prepaid = prepaid;
      if (expired_at && expired_at < bestNumber) {
        // expired
        fStat.status = 'Expired';
      }
      if (reported_replica_count < 1) {
        // pending
        fStat.status = 'Submitted';
      }
      if (expired_at && expired_at > bestNumber && reported_replica_count > 0) {
        // success
        fStat.status = 'Success';
      }
    } else if (statV2 && !statV2.isEmpty) {
      const {
        expired_at,
        reported_replica_count,
        amount,
        file_size,
        prepaid,
      } = parseStat(statV2)
      fStat.expireTime = expired_at;
      fStat.amount = amount;
      fStat.startTime = expired_at ? expired_at - 216000 : 0;
      fStat.fileSize = file_size;
      fStat.confirmedReplicas = reported_replica_count;
      fStat.prepaid = prepaid;
      if (expired_at && expired_at < bestNumber) {
        // expired
        fStat.status = 'Expired';
      }
      if (reported_replica_count < 1) {
        // pending
        fStat.status = 'Submitted';
      }
      if (expired_at && expired_at > bestNumber && reported_replica_count > 0) {
        // success
        fStat.status = 'Success';
      }
    } else if (hasQueryFileApi && (new Date().getTime() - file.PinTime) >= FailedTime) {
      // 'Failed'
      fStat.status = 'Failed'
    }
    if (!bestNumber) fStat.status = 'Loading'
    return fStat
  }, [statV1, statV2, bestNumber])


  return <Table.Row className={className}>
    <Table.Cell className={'fileName'}>
      {shortStr(file.Name)}
      {file.items && <span className="icon cru-fo-folder" />}
      {
        file.Encrypted &&
        <Popup
          trigger={<span className="icon cru-fo-key" />}
          content={"Encrypted"}
          position={"top center"} />
      }
    </Table.Cell>
    <Table.Cell textAlign={"right"}>
      {shortStr(file.Hash)}
      <Popup
        position={"top center"}
        content={"Copy File CID"}
        trigger={
          <span
            className="cru-fo cru-fo-copy"
            onClick={() => copy(file.Hash)}
            style={{ marginLeft: '1.8rem' }} />
        }
      />
    </Table.Cell>
    <Table.Cell textAlign={"center"}
      style={{ textTransform: 'uppercase' }}>{filesize(Number(file.Size), { round: 2 })}</Table.Cell>
    <Table.Cell textAlign={"center"}>
      {
        fileStat.status === 'Loading' &&
        <Icon loading name="spinner" />
      }
      {fileStat.status === "Submitted" && fileStat.status}
      {fileStat.status === "Expired" && fileStat.status}
      {fileStat.status === "Failed" && fileStat.status}
      {fileStat.status === "Success" && `${fileStat.status} (${fileStat.confirmedReplicas} Replicas)`}
    </Table.Cell>
    <Table.Cell textAlign={"center"}>

      {/* <Popup
        position={"top center"}
        content={"Copy Download Link"}
        trigger={
          <span className="cru-fo cru-fo-copy" onClick={_onClickCopy} />
        }
      /> */}
      <Popup
        position={"top center"}
        content={"Open"}
        trigger={
          <span
            className="cru-fo cru-fo-external-link"
            style={{ marginLeft: '1rem' }} onClick={_onClickOpen} />
        }
      />
      <Popup
        position={"top center"}
        content={"Delete"}
        trigger={
          <span
            className="cru-fo cru-fo-trash-2"
            style={{ marginLeft: '1rem' }} onClick={_onClickDelete} />
        }
      />
      <Popup
        position={"top center"}
        content={"IPFS Scan"}
        trigger={
          <span
            className="cru-fo cru-fo-search"
            style={{ marginLeft: '1rem' }} onClick={_onClickSearch} />
        }
      />

    </Table.Cell>
    {
      isPublic && <Table.Cell textAlign={"center"}>
        {
          <>
            <Btn className="item-share-btn" onClick={_onClickShare}>Share</Btn>
            <Popup
              position={"top center"}
              content={"Quick Tweet"}
              trigger={
                <span
                  className="cru-fo cru-fo-twitter"
                  onClick={_onClickTweet}
                  style={{ marginLeft: '0.5rem', top: '0.2rem' }} />
              }
            />
          </>}
      </Table.Cell>}
  </Table.Row>
}

export default React.memo<Props>(styled(FileItem)`
  color: var(--secend-color) !important;

  .cru-fo, .icon {
    cursor: pointer;
    font-size: 1.3rem;
    position: relative;
    top: 0.3rem;
  }

  .fileName {
    .icon {
      margin-left: 0.6rem;
    }
  }

  .item-share-btn {
    padding: 5px 11px !important;
    border-radius: 8px !important;
  }

`)
