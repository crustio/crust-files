import React, {useCallback, useContext} from "react";
import {SaveFile} from "../lib/wallet/types";
import {AuthIpfsEndpoint} from "../lib/config";
import {Icon, Popup, Table} from "semantic-ui-react";
import filesize from "filesize";
import {saveAs} from 'file-saver';
import {useClipboard} from "../lib/hooks/useClipboard";
import {AppContext} from "../lib/AppContext";
import {useCall} from "../lib/hooks/useCall";
import styled from "styled-components";
import {useAuthGateway} from "../lib/useAuth";
import {WrapUserCrypto} from "../lib/crypto/useUserCrypto";
import axios from "axios";
import {decryptFile} from "../lib/crypto/encryption";
import _ from 'lodash';
import {shortStr} from "../lib/utils";
import {BlockNumber} from "@polkadot/types/interfaces/types";

export interface Props {
  className?: string,
  file: SaveFile,
  uc: WrapUserCrypto,
}

type Status = 'Loading' | 'Waiting' | 'Expired' | 'Success' | 'Failed';

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
  const {file, className, uc} = props;
  const copy = useClipboard();
  const {api, alert, loading} = useContext(AppContext)
  const {endpoints} = useAuthGateway()

  const _onClickOpen = useCallback(async () => {
    if (file.Encrypted && _.size(file.items) === 0) {
      try {
        if (!uc.secret) return;
        loading.show()
        const res = await axios.get<ArrayBuffer>(createUrl(file, endpoints), {responseType: "arraybuffer"})
        console.info('res::', res)
        const time1 = new Date().getTime()
        const decryptData = await decryptFile(res.data, uc.secret)
        console.info('decrypt:', (new Date().getTime() - time1) / 1000)
        if (!decryptData) {
          throw 'error'
        }
        console.info('de:', decryptData)
        const saveFile = new File([decryptData], file.Name, {type: res.headers['content-type']})
        saveAs(saveFile, file.Name)
        loading.hide()
      } catch (e) {
        loading.hide()
        alert.error("decrypt error")
      }
    } else {
      window.open(createUrl(file, endpoints), '_blank')
    }
  }, [uc, file, endpoints])
  const _onClickCopy = useCallback(() => copy(createUrl(file, endpoints)), [file, endpoints])

  const queryFileApi = api && api.query?.market && api.query?.market.files
  const hasQueryFileApi = !!queryFileApi
  const stat = useCall<{ isEmpty: boolean } | undefined | null>(queryFileApi, [file.Hash])
  const bestNum = useCall<BlockNumber>(api?.derive?.chain?.bestNumber);
  const bestNumber = bestNum && bestNum.toNumber()
  const fileStat: FileStat = {status: 'Loading'}
  if (stat && !stat.isEmpty) {
    const {
      expired_at,
      reported_replica_count,
      amount,
      file_size,
      prepaid,
    } = parseStat(stat)
    fileStat.expireTime = expired_at;
    fileStat.amount = amount;
    fileStat.startTime = expired_at ? expired_at - 216000 : 0;
    fileStat.fileSize = file_size;
    fileStat.confirmedReplicas = reported_replica_count;
    fileStat.prepaid = prepaid;
    if (expired_at && expired_at < bestNumber) {
      // expired
      fileStat.status = 'Expired';
    }
    if (reported_replica_count < 1) {
      // pending
      fileStat.status = 'Waiting';
    }
    if (expired_at && expired_at > bestNumber && reported_replica_count > 0) {
      // success
      fileStat.status = 'Success';
    }
  } else if (hasQueryFileApi && (file.PinTime - new Date().getTime()) >= FailedTime) {
    // 'Failed'
    fileStat.status = 'Failed'
  }
  if (!bestNumber) fileStat.status = 'Loading'

  return <Table.Row className={className}>
    <Table.Cell className={'fileName'}>
      {shortStr(file.Name)}
      {file.items && <Icon name={'folder outline'}/>}
      {file.Encrypted &&
      <Popup trigger={<embed src={"/key.svg"}/>} position={"top center"} content={"Encrypted"}/>}
    </Table.Cell>
    <Table.Cell textAlign={"center"}>
      {shortStr(file.Hash)}
      <Popup
        position={"top center"}
        content={"Copy File CID"}
        trigger={
          <span
            onClick={() => copy(file.Hash)}
            style={{cursor: "pointer", paddingLeft: 10}}>
            <Icon name={'clone outline'}/>
          </span>
        }
      />
    </Table.Cell>
    <Table.Cell textAlign={"center"}>{filesize(Number(file.Size), {round: 2})}</Table.Cell>
    <Table.Cell textAlign={"center"}>
      {
        fileStat.status === 'Loading' &&
        <Icon loading name="spinner"/>
      }
      {fileStat.status === "Waiting" && fileStat.status}
      {fileStat.status === "Expired" && fileStat.status}
      {fileStat.status === "Failed" && fileStat.status}
      {fileStat.status === "Success" && `${fileStat.status} (${fileStat.confirmedReplicas} replicas)`}
    </Table.Cell>
    <Table.Cell textAlign={"center"}>
      <Popup
        position={"top center"}
        content={"Open File"}
        trigger={
          <span style={{cursor: "pointer", marginRight: '1rem'}} onClick={_onClickOpen}>
            <Icon name={'external'}/>
          </span>
        }
      />
      <Popup
        position={"top center"}
        content={"Copy Download Link"}
        trigger={
          <span style={{cursor: "pointer"}} onClick={_onClickCopy}>
            <Icon name={'clone outline'}/>
          </span>
        }
      />

    </Table.Cell>
  </Table.Row>
}

export default React.memo<Props>(styled(FileItem)`
  color: var(--secend-color) !important;

  .fileName {
    i, embed {
      margin-left: 0.6rem;
    }

    embed {
      width: 1.2rem;
      height: 1.2rem;
      position: relative;
      top: 0.3rem;
      cursor: pointer;

      path {
        fill: var(--secend-color);
      }
    }
  }

`)
