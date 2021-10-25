// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios, {CancelTokenSource} from 'axios';
import React, {useCallback, useMemo, useState} from 'react';

import {getPerfix, WrapLoginUser} from '../lib/wallet/hooks';
import {useAuthGateway, useAuthPinner} from '../lib/useAuth';
import {Card, Modal, Progress, Radio} from 'semantic-ui-react';
import {useTranslation} from 'react-i18next';
import {FileInfo, SaveFile, UploadRes} from '../lib/wallet/types';
import styled from "styled-components";
import MDropdown from "./MDropdown";
import Btn from "./Btn";
import {useToggle} from "../lib/hooks/useToggle";

export interface Props {
  className?: string,
  file: FileInfo,
  onClose?: () => void,
  onSuccess?: (res: SaveFile) => void,
  user: WrapLoginUser,
}

const NOOP = (): void => undefined;

function UploadModal(p: Props): React.ReactElement<Props> {
  const {className, file, onClose = NOOP, onSuccess = NOOP, user} = p;
  const {t} = useTranslation();
  const {endpoint, endpoints, onChangeEndpoint} = useAuthGateway();
  const {onChangePinner, pinner, pins} = useAuthPinner();
  const [password, setPassword] = useState('');
  const [isBusy, setBusy] = useState(false);
  const fileSizeError = useMemo(() => {
    const MAX = 100 * 1024 * 1024;

    if (file.file) {
      return file.file.size > MAX;
    } else if (file.files) {
      let sum = 0;

      for (const f of file.files) {
        sum += f.size;
      }

      return sum > MAX;
    }

    return false;
  }, [file]);
  // const fileSizeError = file.size > 100 * 1024 * 1024;
  const [error, setError] = useState('');
  const errorText = fileSizeError ? t<string>('Do not upload files larger than 100MB!') : error;
  const [upState, setUpState] = useState({progress: 0, up: false});
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);

  const _onClose = useCallback(() => {
    if (cancelUp) cancelUp.cancel();
    onClose();
  }, [cancelUp, onClose]);

  const _onClickUp = useCallback(async () => {
    setError('');

    if (!user.account || !user.sign) {
      return;
    }

    try {
      // 1: sign
      setBusy(true);

      const prefix = getPerfix(user);
      const msg = user.wallet === 'near' ? user.pubKey || '' : user.account;
      const signature = await user.sign(msg, user.account);
      const perSignData = user.wallet === 'elrond' ? signature : `${prefix}-${msg}:${signature}`;
      const base64Signature = window.btoa(perSignData);
      const AuthBasic = `Basic ${base64Signature}`;
      const AuthBearer = `Bearer ${base64Signature}`;
      // 2: up file
      const cancel = axios.CancelToken.source();

      setCancelUp(cancel);
      setUpState({progress: 0, up: true});
      const form = new FormData();

      if (file.file) {
        form.append('file', file.file, file.file.name);
      } else if (file.files) {
        for (const f of file.files) {
          form.append('file', f, f.webkitRelativePath);
        }
      }

      const UpEndpoint = endpoint.value;
      const upResult = await axios.request<UploadRes | string>({
        cancelToken: cancel.token,
        data: form,
        headers: {Authorization: AuthBasic},
        maxContentLength: 100 * 1024 * 1024,
        method: 'POST',
        onUploadProgress: (p: { loaded: number, total: number }) => {
          const percent = p.loaded / p.total;

          setUpState({progress: Math.round(percent * 99), up: true});
        },
        params: {pin: true},
        url: `${UpEndpoint}/api/v0/add`
      });

      let upRes: UploadRes;

      if (typeof upResult.data === 'string') {
        const jsonStr = upResult.data.replaceAll('}\n{', '},{');
        const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
        const folder = items.length - 1;

        upRes = items[folder];
        delete items[folder];
        upRes.items = items;
      } else {
        upRes = upResult.data;
      }

      console.info('upResult:', upResult);
      setCancelUp(null);
      setUpState({progress: 100, up: false});
      // remote pin order
      const PinEndpoint = pinner.value;

      await axios.request({
        data: {
          cid: upRes.Hash,
          name: upRes.Name
        },
        headers: {Authorization: AuthBearer},
        method: 'POST',
        url: `${PinEndpoint}/psa/pins`
      });
      onSuccess({
        ...upRes,
        PinEndpoint,
        UpEndpoint
      });
    } catch (e) {
      setUpState({progress: 0, up: false});
      setBusy(false);
      console.error(e);
      setError(t('Network Error,Please try to switch a Gateway.'));
      // setError((e as Error).message);
    }
  }, [user, file, password, pinner, endpoint, onSuccess, t]);

  const [encrypt, toggleEncrypt] = useToggle()

  return (
    <Modal
      closeIcon
      onClose={_onClose}
      open={true}
      size={'large'}
      className={className}
    >
      <Modal.Header>{t<string>(file.dir ? 'Upload Folder' : 'Upload File')}</Modal.Header>
      <Modal.Content>
        <Card.Group>
          <Card fluid>
            <Card.Content>
              <Card.Header content={file.dir ? 'Folder' : 'File'}/>
              <Card.Description
                content={file.dir ?
                  `${file.dir} (${file.files.length} files)` :
                  `${file.file.name} (${file.file.size} bytes)`
                }
              />
            </Card.Content>
          </Card>
          <Card fluid>
            <MDropdown
              fluid
              selection
              help={t<string>('File streaming and wallet authentication will be processed by the chosen gateway.')}
              disabled={isBusy}
              label={t<string>('Select a Web3 IPFS Gateway')}
              onChange={onChangeEndpoint}
              options={endpoints}
              defaultValue={endpoint.value}
            />
          </Card>
          <Card fluid>
            <MDropdown
              fluid
              selection
              help={t<string>('Your file will be pinned to IPFS for long-term storage.')}
              disabled={pins.length === 0}
              label={t<string>('Select a Web3 IPFS Pinner')}
              onChange={onChangePinner}
              options={pins}
              defaultValue={pinner.value}
            />
          </Card>
          <Card fluid className="encryption">
            <Card.Content>
              <Card.Header content={"File Encryption"}/>
              <Card.Description content={encrypt ? 'Yes' : 'No'}/>
              <Radio toggle defaultChecked={encrypt} onChange={() => toggleEncrypt()}/>
            </Card.Content>
          </Card>
        </Card.Group>
        {
          errorText &&
          <div
            style={{
              color: 'orangered',
              padding: '1rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {errorText}
          </div>
        }
      </Modal.Content>
      <Modal.Actions>
        <div className={'uploading'}>
          {upState.up && <Progress
            value={upState.progress}
            total={100}
            active
            color={"orange"}
          />}
          {upState.up && <Btn color={"orange"}>{t('Cancel')}</Btn>}
          {!upState.up && <Btn fluid onClick={_onClickUp} color={"orange"}>{t('Sing and Upload')}</Btn>}
        </div>
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(UploadModal)`

  .header:nth-child(2) {
    height: 3.36rem;
    font-size: 1rem !important;
    padding: 0 1rem !important;
    font-weight: unset !important;
    line-height: 3.36rem !important;
  }


  .close.icon {
    top: 0.5rem;
    right: 0.6rem;
    color: #666666;
  }

  .content {
    padding: 1rem !important;
  }

  .ui.cards > .card {
    margin: 0.5rem !important;
    .content>.header {
      font-size: 1.14rem;
      font-weight: unset !important;
    }
    .content>.description {
      font-size: 1rem;
    }
  }

  .ui.cards > .card:first-child {
    margin-top: 1rem !important;
  }

  .actions {
    height: 4.8rem;
    padding: 0.5rem 1rem 0 1rem !important;
    border-top: unset !important;
    background: unset !important;

    .button {
      margin-left: unset !important;
    }
  }

  .uploading {
    height: 4rem;
    display: flex;
    align-items: center;

    .progress {
      margin: 0 1rem 0 0 !important;
      vertical-align: baseline;
      background: unset !important;
      border: 1px solid orange;
      flex: 1;

      .bar {
        min-width: unset !important;
        height: 2.5rem;
      }
    }
  }
  
  .card.encryption {
    position: relative;
    .toggle {
      position: absolute;
      top: calc(50% - 0.75rem);
      right: 1rem;
      
      input[type="radio"]:checked + label:before{
        background-color: #2ED158 !important;
      }
    }
  }
`);
