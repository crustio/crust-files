import React, {useCallback, useContext, useMemo} from "react";
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
        alert.error("Decrypt error")
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
  const fileStat = useMemo<FileStat>(() => {
    const fStat: FileStat = {status: 'Loading'}
    if (stat && !stat.isEmpty) {
      const {
        expired_at,
        reported_replica_count,
        amount,
        file_size,
        prepaid,
      } = parseStat(stat)
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
    } else if (hasQueryFileApi && (file.PinTime - new Date().getTime()) >= FailedTime) {
      // 'Failed'
      fStat.status = 'Failed'
    }
    if (!bestNumber) fStat.status = 'Loading'
    return fStat
  }, [stat, bestNumber])


  return <Table.Row className={className}>
    <Table.Cell className={'fileName'}>
      {shortStr(file.Name)}
      {file.items && <span className="icon cru-fo-folder"/>}
      {
        file.Encrypted &&
        <Popup
          trigger={<span className="icon cru-fo-key"/>}
          content={"Encrypted"}
          position={"top center"}/>
      }
    </Table.Cell>
    <Table.Cell textAlign={"center"}>
      {shortStr(file.Hash)}
      <Popup
        position={"top center"}
        content={"Copy File CID"}
        trigger={
          <span
            className="cru-fo cru-fo-copy"
            onClick={() => copy(file.Hash)}
            style={{marginLeft: '1.8rem'}}/>
        }
      />
    </Table.Cell>
    <Table.Cell textAlign={"center"}
                style={{textTransform: 'uppercase'}}>{filesize(Number(file.Size), {round: 2})}</Table.Cell>
    <Table.Cell textAlign={"center"}>
      {
        fileStat.status === 'Loading' &&
        <Icon loading name="spinner"/>
      }
      {fileStat.status === "Submitted" && fileStat.status}
      {fileStat.status === "Expired" && fileStat.status}
      {fileStat.status === "Failed" && fileStat.status}
      {fileStat.status === "Success" && `${fileStat.status} (${fileStat.confirmedReplicas} Replicas)`}
    </Table.Cell>
    <Table.Cell textAlign={"center"}>
      <Popup
        position={"top center"}
        content={"Open File"}
        trigger={
          <span
            className="cru-fo cru-fo-external-link"
            style={{marginRight: '1.14rem'}} onClick={_onClickOpen}/>
        }
      />
      <Popup
        position={"left center"}
        content={"Copy Download Link"}
        trigger={
          <span className="cru-fo cru-fo-copy" onClick={_onClickCopy}/>
        }
      />

    </Table.Cell>
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

`)
