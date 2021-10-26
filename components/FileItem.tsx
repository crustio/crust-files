import React, {useCallback, useContext} from "react";
import {SaveFile} from "../lib/wallet/types";
import {AuthIpfsEndpoint} from "../lib/config";
import {Icon, Table} from "semantic-ui-react";
import filesize from "filesize";
import {useClipboard} from "../lib/hooks/useClipboard";
import {AppContext} from "../lib/AppContext";
import {useCall} from "../lib/hooks/useCall";
import styled from "styled-components";
import {useAuthGateway} from "../lib/useAuth";

export interface Props {
  className?: string,
  file: SaveFile
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

const createOnDown = (f: SaveFile, endpoints: AuthIpfsEndpoint[]) => () => {
  window.open(createUrl(f, endpoints), '_blank');
  // FileSaver.saveAs(createUrl(f), f.Name);
};

const shortStr = (name: string, count = 6): string => {
  if (name.length > (count * 2)) {
    return `${name.substr(0, count)}...${name.substr(name.length - count)}`;
  }

  return name;
};

//
const FailedTime = 2 * 60 * 60 * 1000

function FileItem(props: Props) {
  const {file, className} = props;
  const copy = useClipboard();
  const {api} = useContext(AppContext)
  const {endpoints} = useAuthGateway()
  const _onClickCopy = useCallback(() => copy(createUrl(file, endpoints)), [file, endpoints])
  const queryFileApi = api && api.query?.market && api.query?.market.files
  const hasQueryFileApi = !!queryFileApi
  const stat = useCall(queryFileApi, [file.Hash])
  let bestNumber = useCall(api && api.derive.chain.bestNumber);
  bestNumber = bestNumber && JSON.parse(JSON.stringify(bestNumber));
  const fileStat: FileStat = {status: 'Loading'}
  if (stat) {
    const statObj = JSON.parse(JSON.stringify(stat))
    if (statObj) {
      const {
        expired_at,
        reported_replica_count
      } = statObj
      fileStat.expireTime = statObj.expired_at;
      fileStat.amount = statObj.amount;
      fileStat.startTime = statObj.expired_at ? statObj.expired_at - 216000 : 0;
      fileStat.fileSize = statObj.file_size;
      fileStat.confirmedReplicas = statObj.reported_replica_count;
      fileStat.prepaid = statObj.prepaid;
      if (expired_at && expired_at < bestNumber) {
        // expired
        fileStat.status = 'Expired';
      }
      if (!expired_at && expired_at > bestNumber && reported_replica_count < 1) {
        // pending
        fileStat.status = 'Waiting';
      }
      if (expired_at && expired_at > bestNumber && reported_replica_count > 0) {
        // success
        fileStat.status = 'Success';
      }
    } else if (hasQueryFileApi && (file.PinTime - new Date().getTime()) >= FailedTime) {
      // 'Failed or Waiting'
      fileStat.status = 'Failed'
    } else {
      fileStat.status = 'Waiting'
    }

  }
  return <Table.Row className={className}>
    <Table.Cell>{shortStr(file.Name)}</Table.Cell>
    <Table.Cell textAlign={"center"}>
      {shortStr(file.Hash)}
      <span onClick={() => copy(file.Hash)} style={{cursor: "pointer", paddingLeft: 10}}>
                  <Icon name={'clone outline'}/>
                </span>
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
      <span style={{cursor: "pointer"}}>
        <Icon name={'external'}/>
      </span>
      <span style={{cursor: "pointer"}} onClick={_onClickCopy}>
        <Icon name={'clone outline'}/>
      </span>
    </Table.Cell>
  </Table.Row>
}

export default React.memo<Props>(styled(FileItem)`
  color: var(--secend-color) !important;
`)
