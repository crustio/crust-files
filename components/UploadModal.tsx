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
import {readFileAsync, WrapUserCrypto} from "../lib/crypto/useUserCrypto";
import {encryptFile} from "../lib/crypto/encryption";

export interface Props {
  className?: string,
  file: FileInfo,
  onClose?: () => void,
  onSuccess?: (res: SaveFile) => void,
  user: WrapLoginUser,
  uc: WrapUserCrypto,
}

const NOOP = (): void => undefined;

function UploadModal(p: Props): React.ReactElement<Props> {
  const {className, uc, file, onClose = NOOP, onSuccess = NOOP, user} = p;
  const {t} = useTranslation();
  const {endpoint, endpoints, onChangeEndpoint} = useAuthGateway();
  const {onChangePinner, pinner, pins} = useAuthPinner();
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
  const [encrypt, toggleEncrypt] = useToggle()

  const _onClose = useCallback(() => {
    if (cancelUp) cancelUp.cancel();
    onClose();
  }, [cancelUp, onClose]);

  const _onClickUp = useCallback(async () => {
    setError('');

    if (fileSizeError || !user.account || !user.sign) {
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
      // 2.**** : encrypt
      const form = new FormData();
      const isEncrypt = !!(encrypt && uc.secret)
      if (isEncrypt) { // encrypt
        if (file.file) {
          const time1 = new Date().getTime()
          const fileData = await readFileAsync(file.file)
          const encryptedData = await encryptFile(fileData, uc.secret)
          console.info('encrypted::', (new Date().getTime() - time1) / 1000)
          const encryptedFile = new Blob([encryptedData], {type: file.file.type})
          form.append('file', encryptedFile, file.file.name)
        } else if (file.files) {
          for (const f of file.files) {
            const fileData = await readFileAsync(f)
            const encryptedData = await encryptFile(fileData, uc.secret)
            const encryptedFile = new Blob([encryptedData], {type: f.type})
            form.append('file', encryptedFile, f.webkitRelativePath)
          }
        }
      } else { // normal
        if (file.file) {
          form.append('file', file.file, file.file.name);
        } else if (file.files) {
          for (const f of file.files) {
            form.append('file', f, f.webkitRelativePath);
          }
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
      setUpState({progress: 99, up: true})
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

      setUpState({progress: 100, up: false});
      onSuccess({
        ...upRes,
        PinEndpoint,
        PinTime: new Date().getTime(),
        UpEndpoint,
        Encrypted: isEncrypt,
      });
    } catch (e) {
      setUpState({progress: 0, up: false});
      setBusy(false);
      console.error(e);
      setError(t('Network Error,Please try to switch a Gateway.'));
      // setError((e as Error).message);
    }
  }, [fileSizeError, user, file, pinner, endpoint, encrypt, onSuccess, t]);

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
              defaultGroup={endpoint.group}
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
          {
            file.file && <Card fluid className="encryption">
              <Card.Content>
                <Card.Header content={"File Encryption"}/>
                {
                  uc.secret ? <Card.Description content={encrypt ? 'Yes' : 'No'}/> :
                    <Card.Description
                      content={"Please go to the 'Setting' page and set encryption key before activating this function."}
                    />
                }
                <Radio toggle defaultChecked={encrypt} disabled={!uc.secret} onChange={() => toggleEncrypt()}/>
              </Card.Content>
            </Card>
          }
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
          {upState.up && <Btn onClick={_onClose}>{t('Cancel')}</Btn>}
          {!upState.up && <Btn fluid onClick={_onClickUp} disabled={fileSizeError}>{t('Sign and Upload')}</Btn>}
        </div>
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo<Props>(styled(UploadModal)`

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

    .content > .header {
      font-size: 1.14rem;
      font-weight: unset !important;
    }

    .content > .description {
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

      input[type="radio"]:checked + label:before {
        background-color: #2ED158 !important;
      }
    }
  }
`);
